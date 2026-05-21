import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { DinoType, BlockMaterial, type GameLevel } from '../types';
import { createDinoBody, createBlockBody, createEnemyBody, applyExplosionForce } from '../game/physics';
import { sound } from '../utils/sound';

interface GameCanvasProps {
  levelData: GameLevel;
  onScoreChange: (score: number) => void;
  onEnemiesCountChange: (alive: number, total: number) => void;
  onDinoQueueChange: (queue: DinoType[]) => void;
  onGameOver: (stars: number, score: number) => void;
  restartTrigger: number;
  bgTheme: 'space' | 'day' | 'sunset' | 'cyberpunk';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  levelData,
  onScoreChange,
  onEnemiesCountChange,
  onDinoQueueChange,
  onGameOver,
  restartTrigger,
  bgTheme,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const worldRef = useRef<Matter.World | null>(null);
  
  const bgAnimFrameRef = useRef(0);
  const starsRef = useRef<{ x: number; y: number; size: number; phase: number }[]>([]);

  if (starsRef.current.length === 0) {
    for (let i = 0; i < 35; i++) {
      starsRef.current.push({
        x: Math.random() * 800,
        y: Math.random() * 450,
        size: Math.random() * 1.8 + 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }
  
  // 게임 플레이 상태
  const [dinoQueue, setDinoQueue] = useState<DinoType[]>([]);
  const [currentDinoType, setCurrentDinoType] = useState<DinoType | null>(null);
  const [slingshot, setSlingshot] = useState({
    x: 160,
    y: 440,
    isDragging: false,
    dragX: 160,
    dragY: 440,
  });
  const [hoveredSlingshot, setHoveredSlingshot] = useState(false);

  // 로컬 점수
  const scoreRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const loadedImagesRef = useRef<Record<string, HTMLImageElement | HTMLCanvasElement>>({});
  const activeDinoBodyRef = useRef<Matter.Body | null>(null);
  const splitDinosRef = useRef<Matter.Body[]>([]); // 프테라 분열체들 추적
  const hasUsedSkillRef = useRef(false);
  const blockHpMapRef = useRef<Map<number, number>>(new Map()); // 바디 id별 HP 기록
  const enemyHpMapRef = useRef<Map<number, number>>(new Map());
  const initialEnemyCountRef = useRef(0);

  // 화면 흔들림 효과
  const shakeIntensityRef = useRef(0);

  // 최신 State를 클로저 렌더 루프(requestAnimationFrame)에 전달하기 위한 Ref 선언
  const currentDinoTypeRef = useRef<DinoType | null>(null);
  const slingshotRef = useRef(slingshot);
  const dinoQueueRef = useRef<DinoType[]>([]);

  // State가 바뀔 때마다 최신 값을 Ref에 동기화
  useEffect(() => {
    currentDinoTypeRef.current = currentDinoType;
  }, [currentDinoType]);

  useEffect(() => {
    slingshotRef.current = slingshot;
  }, [slingshot]);

  useEffect(() => {
    dinoQueueRef.current = dinoQueue;
  }, [dinoQueue]);

  // 1. 에셋 이미지 프리로딩 및 크로마키(투명화) 처리
  useEffect(() => {
    const assets = {
      bg: '/images/bg.png',
      tyranno: '/images/tyranno.png',
      ptera: '/images/ptera.png',
      tricera: '/images/tricera.png',
      robot: '/images/robot.png',
      tnt: '/images/tnt.png',
    };

    const processChromaKey = (img: HTMLImageElement): HTMLCanvasElement => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return canvas;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let transparentCount = 0;
      let nonTransparentCount = 0;

      // 마젠타 (#ff00ff) 계열 색상 투명화 (R과 B가 높고 G가 낮은 계열)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // 핑크/자홍색 마젠타 범위 감지 (R > 130, B > 130이고 R-G > 50, B-G > 50)
        if (r > 130 && b > 130 && r - g > 50 && b - g > 50) {
          data[i + 3] = 0; // Alpha = 0 (투명)
          transparentCount++;
        } else {
          nonTransparentCount++;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas;
    };

    Object.entries(assets).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (key === 'bg') {
          loadedImagesRef.current[key] = img;
        } else {
          // 캐릭터와 프롭 에셋의 경우 크로마키(마젠타배경) 제거 적용
          loadedImagesRef.current[key] = processChromaKey(img);
        }
      };
    });
  }, []);

  // 2. Matter.js 엔진 초기화 및 스테이지 세팅
  useEffect(() => {
    // 1) 엔진 및 월드 생성
    const engine = Matter.Engine.create({
      gravity: { y: 1.0 }, // 지구 중력 수준
    });
    const world = engine.world;
    engineRef.current = engine;
    worldRef.current = world;

    // 2) 맵 경계선 (바닥, 좌, 우 벽)
    const ground = Matter.Bodies.rectangle(400, 580, 800, 40, {
      isStatic: true,
      friction: 0.8,
      label: 'ground',
    });
    const leftWall = Matter.Bodies.rectangle(-20, 300, 40, 600, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(820, 300, 40, 600, { isStatic: true });
    
    Matter.World.add(world, [ground, leftWall, rightWall]);

    // 3) 블록 구조물 생성
    blockHpMapRef.current.clear();
    levelData.obstacles.forEach((obs) => {
      const block = createBlockBody(obs.x, obs.y, obs.width, obs.height, obs.material);
      Matter.World.add(world, block);
      
      // 재질별 체력 지정
      let hp = 100;
      if (obs.material === BlockMaterial.STONE) hp = 400;
      if (obs.material === BlockMaterial.WOOD) hp = 200;
      if (obs.material === BlockMaterial.GLASS) hp = 50;
      if (obs.material === BlockMaterial.TNT) hp = 10;
      
      blockHpMapRef.current.set(block.id, hp);
    });

    // 4) 로봇 적 생성
    enemyHpMapRef.current.clear();
    initialEnemyCountRef.current = levelData.enemies.length;
    levelData.enemies.forEach((en) => {
      const enemyBody = createEnemyBody(en.x, en.y, en.radius);
      Matter.World.add(world, enemyBody);
      enemyHpMapRef.current.set(enemyBody.id, en.hp);
    });

    // 5) 대기열 셋업
    setDinoQueue(levelData.dinoQueue);
    setCurrentDinoType(levelData.dinoQueue[0] || null);
    onDinoQueueChange(levelData.dinoQueue);
    scoreRef.current = 0;
    onScoreChange(0);
    onEnemiesCountChange(levelData.enemies.length, levelData.enemies.length);

    activeDinoBodyRef.current = null;
    splitDinosRef.current = [];
    hasUsedSkillRef.current = false;
    particlesRef.current = [];

    // 6) 충돌 감지 바인딩
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        
        // 상대 속도로 가해진 데미지 계산
        const relativeSpeed = Math.sqrt(
          Math.pow(bodyA.speed - bodyB.speed, 2)
        );

        // 충돌 속도가 일정 강도 이상일 때 타격 타악음 재생
        if (relativeSpeed > 1.2) {
          sound.playImpact(relativeSpeed);
        }

        const damage = Math.floor(relativeSpeed * 20);

        if (damage > 15) {
          handleBodyDamage(bodyA, damage);
          handleBodyDamage(bodyB, damage);
        }
      });
    });

    return () => {
      sound.stopFlyingWind();
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, [levelData, restartTrigger]);

  // 3. 데미지 및 폭발 처리
  const handleBodyDamage = (body: Matter.Body, damage: number) => {
    // 1) 블록 체력 감소
    if (body.label.startsWith('block_')) {
      const currentHp = blockHpMapRef.current.get(body.id);
      if (currentHp !== undefined) {
        const nextHp = currentHp - damage;
        if (nextHp <= 0) {
          blockHpMapRef.current.delete(body.id);
          Matter.World.remove(worldRef.current!, body);
          
          // 파괴 점수
          scoreRef.current += 100;
          onScoreChange(scoreRef.current);
          
          // 블록 파괴 파편 파티클 생성
          const isTNT = body.label.includes('TNT');
          createDebrisParticles(body.position.x, body.position.y, body.label, isTNT ? 25 : 8);

          if (isTNT) {
            triggerTNTExplosion(body.position.x, body.position.y);
          } else {
            const material = body.label.split('_')[1];
            sound.playBreak(material);
          }
        } else {
          blockHpMapRef.current.set(body.id, nextHp);
        }
      }
    }

    // 2) 로봇 적 체력 감소
    if (body.label === 'enemy') {
      const currentHp = enemyHpMapRef.current.get(body.id);
      if (currentHp !== undefined) {
        const nextHp = currentHp - 1; // 로봇은 부딪히면 무조건 1깎이거나 큰 충격에 파괴
        if (nextHp <= 0) {
          enemyHpMapRef.current.delete(body.id);
          Matter.World.remove(worldRef.current!, body);
          
          // 로봇 파괴 시 묵직한 돌 파편 효과음 재생
          sound.playBreak('STONE');
          
          // 점수 획득
          scoreRef.current += 1000;
          onScoreChange(scoreRef.current);
          
          // 로봇 전용 스파크 연출
          createDebrisParticles(body.position.x, body.position.y, 'robot', 15);
          shakeIntensityRef.current = 15; // 파괴 시 화면 흔들림

          // 남은 로봇 수 통보
          const alive = enemyHpMapRef.current.size;
          onEnemiesCountChange(alive, initialEnemyCountRef.current);

          // 만약 적이 다 죽었으면 게임 오버 클리어 처리
          if (alive === 0) {
            setTimeout(() => {
              checkGameStatus();
            }, 1000);
          }
        } else {
          enemyHpMapRef.current.set(body.id, nextHp);
        }
      }
    }
  };

  // TNT 폭발 로직
  const triggerTNTExplosion = (x: number, y: number) => {
    shakeIntensityRef.current = 25; // 강한 흔들림
    applyExplosionForce(worldRef.current!, { x, y }, 150, 1.2);
    
    // 폭발음 재생
    sound.playExplosion();
    
    // 폭발 불꽃 연출
    createExplosionParticles(x, y);
  };

  // 4. 파티클 연출 생성 헬퍼
  const createDebrisParticles = (x: number, y: number, label: string, count: number) => {
    let color = '#d97706'; // 나무 색상
    if (label.includes('STONE')) color = '#9ca3af';
    if (label.includes('GLASS')) color = '#22d3ee';
    if (label.includes('robot')) color = '#e11d48';

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: Math.random() * 4 + 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 30 + 20,
      });
    }
  };

  const createExplosionParticles = (x: number, y: number) => {
    const colors = ['#ff4500', '#ff8c00', '#ffd700', '#ffffff'];
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 40 + 20,
      });
    }
  };

  // 5. 프레임 렌더링 및 물리 루프
  useEffect(() => {
    let animationId: number;

    const tick = () => {
      if (engineRef.current) {
        Matter.Engine.update(engineRef.current, 16.666); // 60FPS 기준 업데이트
      }

      // 비행 바람 루프음 실시간 속도 연동
      if (activeDinoBodyRef.current) {
        const speed = activeDinoBodyRef.current.speed;
        sound.updateFlyingWind(speed);
      }

      // 화면 흔들림 감쇄
      if (shakeIntensityRef.current > 0.1) {
        shakeIntensityRef.current *= 0.9; // 자연스럽게 작아짐
      } else {
        shakeIntensityRef.current = 0;
      }

      bgAnimFrameRef.current++; // 배경 애니메이션 프레임 증가
      draw();
      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // 6. 메인 드로우(Draw) 로직
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 최신 상태 Ref 참조
    const currentSlingshot = slingshotRef.current;
    const currentDino = currentDinoTypeRef.current;

    ctx.save();
    
    // 화면 흔들림 연출 적용
    if (shakeIntensityRef.current > 0) {
      const dx = (Math.random() - 0.5) * shakeIntensityRef.current;
      const dy = (Math.random() - 0.5) * shakeIntensityRef.current;
      ctx.translate(dx, dy);
    }

    // 1) 배경화면 그리기
    const bgImg = loadedImagesRef.current.bg;
    const frame = bgAnimFrameRef.current;

    if (bgTheme === 'space') {
      // 우주 야경 테마
      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      } else {
        // 폴백 그라데이션
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#0b0f19');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 반짝이는 별빛 그리기
      ctx.save();
      starsRef.current.forEach((star) => {
        const alpha = 0.2 + 0.8 * Math.abs(Math.sin(frame * 0.02 + star.phase));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 성운 효과 (은은한 방사형 보라색 빛)
      ctx.save();
      const nebulaGrad = ctx.createRadialGradient(250, 200, 20, 250, 200, 300);
      nebulaGrad.addColorStop(0, 'rgba(147, 51, 234, 0.15)');
      nebulaGrad.addColorStop(1, 'rgba(147, 51, 234, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

    } else if (bgTheme === 'day') {
      // 맑은 평원 낮 테마
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#38bdf8'); // 맑은 하늘색
      grad.addColorStop(0.6, '#bae6fd');
      grad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 에메랄드 잔디 언덕 실루엣 (멀리 있는 언덕들)
      ctx.save();
      ctx.fillStyle = '#10b981'; // 1차 언덕
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(0, 560);
      ctx.quadraticCurveTo(200, 480, 450, 520);
      ctx.quadraticCurveTo(650, 550, 800, 500);
      ctx.lineTo(800, 560);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#059669'; // 2차 언덕 (더 가까움)
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 560);
      ctx.quadraticCurveTo(150, 530, 350, 500);
      ctx.quadraticCurveTo(550, 470, 800, 530);
      ctx.lineTo(800, 560);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 흘러가는 뭉게구름 그리기
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      
      // 구름 그리기 헬퍼 함수
      const drawCloud = (x: number, y: number, scale: number) => {
        ctx.beginPath();
        ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
        ctx.arc(x + 15 * scale, y - 10 * scale, 25 * scale, 0, Math.PI * 2);
        ctx.arc(x + 35 * scale, y - 5 * scale, 22 * scale, 0, Math.PI * 2);
        ctx.arc(x + 50 * scale, y, 18 * scale, 0, Math.PI * 2);
        ctx.rect(x - 5 * scale, y - 5 * scale, 60 * scale, 15 * scale);
        ctx.fill();
      };

      // 구름 세 개 다른 속도와 높이로 이동
      const cloud1X = ((frame * 0.08) % 1000) - 150;
      drawCloud(cloud1X, 100, 1.2);

      const cloud2X = (((frame * 0.05) + 350) % 1000) - 150;
      drawCloud(cloud2X, 160, 0.8);

      const cloud3X = (((frame * 0.12) + 700) % 1000) - 150;
      drawCloud(cloud3X, 70, 1.0);
      
      ctx.restore();

    } else if (bgTheme === 'sunset') {
      // 노을 황혼 테마
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#3b0764'); // 딥 바이올렛
      grad.addColorStop(0.4, '#ea580c'); // 오렌지
      grad.addColorStop(0.8, '#fef08a'); // 금빛 노을
      grad.addColorStop(1, '#ffedd5');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 노을 태양 그리기
      ctx.save();
      const sunGrad = ctx.createRadialGradient(550, 480, 10, 550, 480, 120);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      sunGrad.addColorStop(0.3, 'rgba(249, 115, 22, 0.5)');
      sunGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(550, 480, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 노을빛 실루엣 산맥
      ctx.save();
      ctx.fillStyle = '#4a044e'; // 짙은 자색 산맥
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 560);
      ctx.lineTo(0, 420);
      ctx.lineTo(150, 360);
      ctx.lineTo(300, 440);
      ctx.lineTo(480, 340);
      ctx.lineTo(650, 410);
      ctx.lineTo(800, 320);
      ctx.lineTo(800, 560);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#2e022f'; // 더 짙은 앞산 실루엣
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, 560);
      ctx.lineTo(0, 490);
      ctx.lineTo(100, 450);
      ctx.lineTo(250, 510);
      ctx.lineTo(400, 460);
      ctx.lineTo(580, 500);
      ctx.lineTo(720, 440);
      ctx.lineTo(800, 480);
      ctx.lineTo(800, 560);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

    } else if (bgTheme === 'cyberpunk') {
      // 네온 사이버 테마
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#0f051d'); // 매우 어두운 퍼플
      grad.addColorStop(0.7, '#2e0854'); // 딥 네온 퍼플
      grad.addColorStop(1, '#5c0b75');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 사이버 마젠타 링 (네온 달)
      ctx.save();
      ctx.strokeStyle = '#f43f5e';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f43f5e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(620, 180, 50, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 미래지향 네온 격자(Outrun Grid) 라인 그리기 (y=430부터 바닥 y=560까지)
      ctx.save();
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.25)'; // 마젠타 투명 격자선
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#ec4899';
      
      const gridStartY = 430;
      const vanishingX = 400;

      // 세로선 (소실점 vanishingX=400, gridStartY=430에서 펼쳐짐)
      for (let i = -12; i <= 12; i++) {
        ctx.beginPath();
        ctx.moveTo(vanishingX, gridStartY);
        ctx.lineTo(vanishingX + i * 75, 560);
        ctx.stroke();
      }

      // 가로선 (바닥으로 갈수록 왜곡(간격이 점점 넓어짐) 적용)
      let currentY = gridStartY;
      let gap = 5;
      while (currentY <= 560) {
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(800, currentY);
        ctx.stroke();
        gap += 2.8; // 밑으로 갈수록 간격이 커짐
        currentY += gap;
      }
      ctx.restore();
    }

    // 2) 새총 그리기 (기둥 및 Y자 가지)
    ctx.save();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // 왼쪽 가지, 오른쪽 가지, 기둥
    ctx.beginPath();
    ctx.moveTo(currentSlingshot.x - 22, currentSlingshot.y - 30);
    ctx.lineTo(currentSlingshot.x, currentSlingshot.y);
    ctx.lineTo(currentSlingshot.x + 22, currentSlingshot.y - 30);
    ctx.moveTo(currentSlingshot.x, currentSlingshot.y);
    ctx.lineTo(currentSlingshot.x, currentSlingshot.y + 110);
    ctx.stroke();

    // 메탈 실버 광선 덧칠
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.stroke();

    // 드래그 가능한 조준 영역 가이드 호버 링 (조작 대기중일 때만 은은하게)
    if (hoveredSlingshot && !currentSlingshot.isDragging && currentDino && !activeDinoBodyRef.current) {
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(currentSlingshot.x, currentSlingshot.y - 15, 90, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();

    // 3) 예상 궤적 가이드라인 렌더링 (드래그 중에만 표시)
    if (currentSlingshot.isDragging && currentDino) {
      drawTrajectory(ctx);
    }

    // 4) Matter.js 월드의 바디들 그리기
    if (worldRef.current) {
      const bodies = Matter.Composite.allBodies(worldRef.current);
      bodies.forEach((body) => {
        if (body.isStatic) {
          // 땅 그리기
          if (body.label === 'ground') {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 560, canvas.width, 40);
          }
          return;
        }

        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        // a) 공룡 투사체 그리기
        if (body.label.startsWith('dino_')) {
          const type = body.label.split('_')[1];
          const dinoImg = loadedImagesRef.current[type.toLowerCase()];
          if (dinoImg) {
            ctx.drawImage(dinoImg, -40, -40, 80, 80);
          } else {
            ctx.font = '36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(type === DinoType.TYRANNO ? '🦖' : (type === DinoType.PTERA ? '🦅' : '🐊'), 0, 0);
          }
        }
        // b) 블록 그리기
        else if (body.label.startsWith('block_')) {
          const material = body.label.split('_')[1] as BlockMaterial;
          const bounds = body.bounds;
          const w = bounds.max.x - bounds.min.x;
          const h = bounds.max.y - bounds.min.y;

          if (material === BlockMaterial.TNT) {
            const tntImg = loadedImagesRef.current.tnt;
            if (tntImg) {
              ctx.drawImage(tntImg, -w * 0.65, -h * 0.65, w * 1.3, h * 1.3);
            } else {
              ctx.fillStyle = '#ef4444';
              ctx.fillRect(-w / 2, -h / 2, w, h);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText('TNT', 0, 4);
            }
          } else {
            // 커스텀 네온 그라데이션 블록 드로잉
            ctx.beginPath();
            ctx.rect(-w / 2, -h / 2, w, h);
            
            let strokeColor = '#f59e0b'; // WOOD
            let fillColor = 'rgba(245, 158, 11, 0.4)';
            if (material === BlockMaterial.STONE) {
              strokeColor = '#9ca3af';
              fillColor = 'rgba(156, 163, 175, 0.5)';
            } else if (material === BlockMaterial.GLASS) {
              strokeColor = '#06b6d4';
              fillColor = 'rgba(6, 182, 212, 0.2)';
            }
            
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2;
            ctx.stroke();

            // 체력 비례 균열 실금 렌더링
            const hp = blockHpMapRef.current.get(body.id) || 100;
            const maxHp = material === BlockMaterial.STONE ? 400 : (material === BlockMaterial.WOOD ? 200 : 50);
            if (hp < maxHp * 0.6) {
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(-w/4, -h/4);
              ctx.lineTo(w/4, h/4);
              ctx.moveTo(w/4, -h/4);
              ctx.lineTo(-w/4, h/4);
              ctx.stroke();
            }
          }
        }
        // c) 로봇 에너미 그리기
        else if (body.label === 'enemy') {
          const r = body.circleRadius || 20;
          const robotImg = loadedImagesRef.current.robot;
          if (robotImg) {
            ctx.drawImage(robotImg, -r * 1.8, -r * 1.8, r * 3.6, r * 3.6);
          } else {
            ctx.font = '32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🤖', 0, 0);
          }
        }

        ctx.restore();
      });
    }

    // 5) 아직 당기는 중인 새총의 고무줄 렌더링
    if (currentSlingshot.isDragging) {
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      
      // 왼쪽 고무줄
      ctx.beginPath();
      ctx.moveTo(currentSlingshot.x - 22, currentSlingshot.y - 30);
      ctx.lineTo(currentSlingshot.dragX, currentSlingshot.dragY);
      ctx.stroke();

      // 오른쪽 고무줄
      ctx.beginPath();
      ctx.moveTo(currentSlingshot.x + 22, currentSlingshot.y - 30);
      ctx.lineTo(currentSlingshot.dragX, currentSlingshot.dragY);
      ctx.stroke();
      ctx.restore();

      // 드래그 중인 공룡 머리 렌더링
      if (currentDino) {
        ctx.save();
        ctx.translate(currentSlingshot.dragX, currentSlingshot.dragY);
        const dinoImg = loadedImagesRef.current[currentDino.toLowerCase()];
        if (dinoImg) {
          ctx.drawImage(dinoImg, -40, -40, 80, 80);
        } else {
          ctx.font = '36px Arial';
          ctx.fillText(currentDino === DinoType.TYRANNO ? '🦖' : '🦅', -18, 12);
        }
        ctx.restore();
      }
    } else if (currentDino && !activeDinoBodyRef.current) {
      // 새총 위에 조용히 앉아 대기 중인 공룡 그리기
      ctx.save();
      ctx.translate(currentSlingshot.x, currentSlingshot.y - 20);
      const dinoImg = loadedImagesRef.current[currentDino.toLowerCase()];
      if (dinoImg) {
        ctx.drawImage(dinoImg, -40, -40, 80, 80);
      } else {
        ctx.font = '36px Arial';
        ctx.fillText(currentDino === DinoType.TYRANNO ? '🦖' : '🦅', -18, 12);
      }
      ctx.restore();
    }

    // 6) 파티클 렌더링 및 수명 차감
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // 파티클 중력 효과
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      if (p.life >= p.maxLife) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore(); // 셰이크 복원
  };

  // 예상 포물선 경로 및 파워 그리기
  const drawTrajectory = (ctx: CanvasRenderingContext2D) => {
    ctx.save();

    const currentSlingshot = slingshotRef.current;
    const startX = currentSlingshot.x;
    const startY = currentSlingshot.y - 20;
    
    // 슬링샷 당긴 거리만큼 속도로 치환
    const vx = (currentSlingshot.x - currentSlingshot.dragX) * 0.15;
    const vy = (startY - currentSlingshot.dragY) * 0.15;
    
    const dragDist = Math.sqrt(
      Math.pow(currentSlingshot.x - currentSlingshot.dragX, 2) +
      Math.pow(startY - currentSlingshot.dragY, 2)
    );
    const powerPercent = Math.min(100, Math.round((dragDist / 100) * 100));

    // 당긴 파워에 따른 색상 변화 (노랑 -> 주황 -> 네온 로즈)
    // 밝은 day 테마 하에서는 대비를 위해 어두운 계열로 보정
    let dotColor = '#f43f5e'; // 75% 이상
    if (bgTheme === 'day') {
      dotColor = '#b91c1c'; // 다크 레드
      if (powerPercent < 40) {
        dotColor = '#0369a1'; // 다크 블루
      } else if (powerPercent < 75) {
        dotColor = '#c2410c'; // 다크 오렌지
      }
    } else {
      if (powerPercent < 40) {
        dotColor = '#eab308'; // 노랑
      } else if (powerPercent < 75) {
        dotColor = '#f97316'; // 주황
      }
    }

    const gravity = 0.28; // Matter.js의 dt=16.66 및 gravity scale 환산 중력
    
    // 예상 포물선 궤적 (닷 구슬 형태)
    for (let t = 1; t < 60; t += 2) {
      const x = startX + vx * t;
      const y = startY + vy * t + 0.5 * gravity * t * t;
      
      // 화면 끝에 가거나 바닥에 닿으면 드로우 정지
      if (y > 560 || x > 800 || x < 0) break;

      ctx.fillStyle = dotColor;
      ctx.beginPath();
      const dotSize = 3 + (powerPercent / 100) * 3.5;
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // 파워 게이지 수치 텍스트 표현
    // 밝은 day 테마 하에서는 텍스트를 어두운 색상으로 그려 시인성 대폭 강화
    ctx.fillStyle = bgTheme === 'day' ? '#0f172a' : dotColor;
    ctx.font = 'bold 20px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`LAUNCH POWER: ${powerPercent}%`, 24, 24);

    ctx.restore();
  };

  // 7. 마우스/터치 드래그 조작 연동
  const startDrag = (clientX: number, clientY: number) => {
    if (activeDinoBodyRef.current) {
      // 공룡이 이미 공중에 날아다닐 때 마우스를 누르면 '액티브 특수 스킬' 발동
      triggerActiveSkill();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = (clientX - rect.left) * scaleX;
    const clickY = (clientY - rect.top) * scaleY;

    // 새총 조준 지점 반경 90px 내 클릭 시 드래그 활성화 (감도 향상)
    const dx = clickX - slingshot.x;
    const dy = clickY - (slingshot.y - 20); // 새총 머리부분 높이에 대칭
    if (Math.sqrt(dx * dx + dy * dy) < 90 && currentDinoType) {
      // 즉각적인 Ref 업데이트로 프레임 렌더러와 동기화
      slingshotRef.current.isDragging = true;
      slingshotRef.current.dragX = clickX;
      slingshotRef.current.dragY = clickY;

      setSlingshot((prev) => ({
        ...prev,
        isDragging: true,
        dragX: clickX,
        dragY: clickY,
      }));
    }
  };

  const moveDrag = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const moveX = (clientX - rect.left) * scaleX;
    const moveY = (clientY - rect.top) * scaleY;

    // 드래그 중이 아닐 때는 새총 주변에 마우스가 있는지 확인하여 grab 커서 유도
    if (!slingshotRef.current.isDragging) {
      const dx = moveX - slingshot.x;
      const dy = moveY - (slingshot.y - 20);
      const isClose = Math.sqrt(dx * dx + dy * dy) < 90;
      if (isClose !== hoveredSlingshot) {
        setHoveredSlingshot(isClose);
      }
      return;
    }

    // 드래그 거리 최대 100px 한도 설정 (새총 고무줄 한계)
    const dx = moveX - slingshot.x;
    const dy = moveY - (slingshot.y - 20);
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    let targetDragX = moveX;
    let targetDragY = moveY;

    if (dist < 100) {
      // 범위 내
      slingshotRef.current.dragX = moveX;
      slingshotRef.current.dragY = moveY;
      setSlingshot((prev) => ({ ...prev, dragX: moveX, dragY: moveY }));
      sound.playStretch(dist);
    } else {
      // 범위 초과 시 각도 고정 및 100px 한계 보정 (y-20 기준)
      const angle = Math.atan2(dy, dx);
      targetDragX = slingshot.x + Math.cos(angle) * 100;
      targetDragY = (slingshot.y - 20) + Math.sin(angle) * 100;
      
      slingshotRef.current.dragX = targetDragX;
      slingshotRef.current.dragY = targetDragY;
      setSlingshot((prev) => ({
        ...prev,
        dragX: targetDragX,
        dragY: targetDragY,
      }));
      sound.playStretch(100);
    }
  };

  const endDrag = () => {
    const currentSlingshot = slingshotRef.current;
    if (!currentSlingshot.isDragging || !currentDinoTypeRef.current) return;

    // 즉각적인 Ref 업데이트
    slingshotRef.current.isDragging = false;
    setSlingshot((prev) => ({ ...prev, isDragging: false }));

    // 포탄 발사음 및 비행 바람 루프음 트리거
    sound.playLaunch();
    sound.startFlyingWind();

    // 1) 발사 물리 바디 생성 (새총 머리 높이인 y-20에서 생성)
    const dinoBody = createDinoBody(slingshot.x, slingshot.y - 20, currentDinoTypeRef.current);
    Matter.World.add(worldRef.current!, dinoBody);

    // 2) 속도(힘) 주입 (당긴 방향과 거리에 비례)
    const vx = (slingshot.x - currentSlingshot.dragX) * 0.15;
    const vy = ((slingshot.y - 20) - currentSlingshot.dragY) * 0.15;
    Matter.Body.setVelocity(dinoBody, { x: vx, y: vy });

    activeDinoBodyRef.current = dinoBody;
    hasUsedSkillRef.current = false;

    // 3) 대기열 업데이트 (최신 Ref 참조를 통해 꼬임 현상 해결)
    const nextQueue = dinoQueueRef.current.slice(1);
    setDinoQueue(nextQueue);
    onDinoQueueChange(nextQueue);

    // 4) 4초 후 공룡 정지 시 다음 턴 자동 처리 예약
    const checkTurnTimer = setTimeout(() => {
      handleNextTurn();
    }, 4500);

    // 공룡이 아예 멈췄거나 월드 밖으로 낙하 시 정밀 확인
    const checkMovement = setInterval(() => {
      if (!dinoBody) {
        clearInterval(checkMovement);
        return;
      }
      
      const speed = dinoBody.speed;
      const isOutOfBounds = dinoBody.position.x > 820 || dinoBody.position.y > 600;
      
      // 스킬 사용 여부에 관계없이 속도가 0.12 이하로 떨어지거나 맵 밖으로 나가면 다음 턴으로 전환
      if (speed < 0.12 || isOutOfBounds) {
        clearInterval(checkMovement);
        clearTimeout(checkTurnTimer);
        handleNextTurn();
      }
    }, 200);
  };

  // 마우스 핸들러 (브라우저 기본 고스트 드래그 및 텍스트 선택 등 원천 차단)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    moveDrag(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    endDrag();
  };

  // 터치 핸들러
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      if (!activeDinoBodyRef.current && (slingshotRef.current.isDragging || !activeDinoBodyRef.current)) {
        // 새총 근처 터치 시 브라우저 스크롤을 막아 게임 조작에만 집중
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          const clickX = (e.touches[0].clientX - rect.left) * scaleX;
          const clickY = (e.touches[0].clientY - rect.top) * scaleY;
          const dx = clickX - slingshot.x;
          const dy = clickY - (slingshot.y - 20);
          if (Math.sqrt(dx * dx + dy * dy) < 90) {
            e.preventDefault();
          }
        }
      }
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      if (slingshotRef.current.isDragging) {
        e.preventDefault(); // 드래그 시 브라우저 스크롤/바운스 방지
      }
      const touch = e.touches[0];
      moveDrag(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (slingshotRef.current.isDragging) {
      e.preventDefault();
    }
    endDrag();
  };

  // 8. 공룡 특수 스킬 작동
  const triggerActiveSkill = () => {
    if (hasUsedSkillRef.current || !activeDinoBodyRef.current) return;
    hasUsedSkillRef.current = true;

    // 공룡 기믹별 스킬 특화음 재생
    if (currentDinoTypeRef.current) {
      sound.playSkill(currentDinoTypeRef.current);
    }

    const body = activeDinoBodyRef.current;
    
    // a) 티라노: 공중 대형 폭발 💥
    if (currentDinoType === DinoType.TYRANNO) {
      triggerTNTExplosion(body.position.x, body.position.y);
      // 폭발 후 티라노 바디 제거
      Matter.World.remove(worldRef.current!, body);
      activeDinoBodyRef.current = null;
    }
    // b) 트리케라: 초고속 황금 돌진 🐲⚡
    else if (currentDinoType === DinoType.TRICERA) {
      const currentVelocity = body.velocity;
      const speed = Math.sqrt(currentVelocity.x * currentVelocity.x + currentVelocity.y * currentVelocity.y);
      if (speed > 0) {
        // 이동 방향으로 2.5배 추진력 제공
        Matter.Body.setVelocity(body, {
          x: (currentVelocity.x / speed) * 16,
          y: (currentVelocity.y / speed) * 16,
        });
      }
      // 돌진 연마 스파크 생성
      createDebrisParticles(body.position.x, body.position.y, 'STONE', 15);
      shakeIntensityRef.current = 10;
    }
    // c) 프테라: 3분열 투사체 🦅🦅🦅
    else if (currentDinoType === DinoType.PTERA) {
      const { x, y } = body.position;
      const { x: vx, y: vy } = body.velocity;

      Matter.World.remove(worldRef.current!, body);

      // 3개 방향으로 분열하여 발사
      const angles = [-0.25, 0, 0.25]; // 라디안
      const splitBodies = angles.map((ang) => {
        const splitDino = createDinoBody(x, y, DinoType.PTERA);
        Matter.World.add(worldRef.current!, splitDino);

        // 각도 변환 속도 적용
        const rx = vx * Math.cos(ang) - vy * Math.sin(ang);
        const ry = vx * Math.sin(ang) + vy * Math.cos(ang);
        Matter.Body.setVelocity(splitDino, { x: rx, y: ry });
        return splitDino;
      });

      splitDinosRef.current = splitBodies;
      // activeDinoBodyRef는 임의로 첫 번째 분열체로 연결하여 추적 유지
      activeDinoBodyRef.current = splitBodies[1];
    }
  };

  // 9. 턴 전환 및 게임 종료 체크
  const handleNextTurn = () => {
    // 비행 사운드 루프 정지
    sound.stopFlyingWind();

    // 날아가고 남은 찌꺼기들 잔여 바디 제거
    if (activeDinoBodyRef.current) {
      Matter.World.remove(worldRef.current!, activeDinoBodyRef.current);
      activeDinoBodyRef.current = null;
    }
    splitDinosRef.current.forEach((b) => {
      Matter.World.remove(worldRef.current!, b);
    });
    splitDinosRef.current = [];

    // 다음 대기공룡 셋업
    if (dinoQueue.length > 0) {
      setCurrentDinoType(dinoQueue[0]);
    } else {
      setCurrentDinoType(null);
      // 공룡이 더 이상 없으면 약 2초 후에 최종 스코어 및 결과 산출
      setTimeout(() => {
        checkGameStatus();
      }, 1500);
    }
  };

  // 최종 스탯 및 별점 환산
  const checkGameStatus = () => {
    const enemiesAlive = enemyHpMapRef.current.size;
    
    // 이미 게임 오버를 호출했는지 중복 방지
    if (enemiesAlive === 0) {
      // 클리어! 별 개수 계산
      let stars = 1;
      if (scoreRef.current >= levelData.threeStarScore) stars = 3;
      else if (scoreRef.current >= levelData.twoStarScore) stars = 2;
      onGameOver(stars, scoreRef.current);
    } else if (dinoQueue.length === 0 && !activeDinoBodyRef.current) {
      // 적이 남았는데 공룡 소진 -> 패배 (별 0개)
      onGameOver(0, scoreRef.current);
    }
  };

  return (
    <div className="relative border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl bg-slate-950">
      <canvas
        ref={canvasRef}
        width={800}
        height={580}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
        className={`block ${slingshot.isDragging ? 'cursor-grabbing' : (hoveredSlingshot ? 'cursor-grab' : 'cursor-crosshair')}`}
      />
    </div>
  );
};
