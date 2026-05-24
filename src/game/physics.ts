import Matter from 'matter-js';
import { DinoType, BlockMaterial } from '../types';

// 공룡 물리 바디 생성
export const createDinoBody = (x: number, y: number, type: DinoType): Matter.Body => {
  let radius = 22;
  let density = 0.002;
  let restitution = 0.4; // 조금 튕기도록 설정

  if (type === DinoType.TRICERA) {
    density = 0.004; // 트리케라는 무겁고 관통력이 강함
    restitution = 0.2;
  } else if (type === DinoType.PTERA) {
    density = 0.0015; // 프테라는 가벼움
    restitution = 0.5;
  }

  const body = Matter.Bodies.circle(x, y, radius, {
    density: density,
    restitution: restitution,
    friction: 0.1,
    frictionAir: 0.01,
    label: `dino_${type}`,
  });

  return body;
};

// 블록/장애물 물리 바디 생성
export const createBlockBody = (
  x: number,
  y: number,
  width: number,
  height: number,
  material: BlockMaterial
): Matter.Body => {
  let density = 0.001;
  let friction = 0.5;
  let restitution = 0.1;

  switch (material) {
    case BlockMaterial.STONE:
      density = 0.005; // 돌은 단단하고 무거움
      friction = 0.8;
      break;
    case BlockMaterial.WOOD:
      density = 0.002; // 나무는 중간 수준
      friction = 0.4;
      restitution = 0.2;
      break;
    case BlockMaterial.GLASS:
      density = 0.001; // 유리는 가볍고 부서지기 쉬움
      friction = 0.2;
      restitution = 0.3;
      break;
    case BlockMaterial.TNT:
      density = 0.0015;
      friction = 0.6;
      break;
  }

  const body = Matter.Bodies.rectangle(x, y, width, height, {
    density: density,
    friction: friction,
    restitution: restitution,
    isSleeping: true,
    label: `block_${material}`,
  });

  return body;
};

// 적 로봇 물리 바디 생성
export const createEnemyBody = (x: number, y: number, radius: number): Matter.Body => {
  const body = Matter.Bodies.circle(x, y, radius, {
    density: 0.002,
    friction: 0.6,
    restitution: 0.2,
    isSleeping: true,
    label: 'enemy',
  });

  return body;
};

// TNT 폭발 충격파 적용 로직
export const applyExplosionForce = (
  world: Matter.World,
  explosionSource: Matter.Vector,
  radius: number,
  maxForce: number
) => {
  const bodies = Matter.Composite.allBodies(world);

  bodies.forEach((body) => {
    // 고정체(땅)는 폭발로 밀리지 않음
    if (body.isStatic) return;

    const dx = body.position.x - explosionSource.x;
    const dy = body.position.y - explosionSource.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < radius && distance > 0) {
      // 거리가 가까울수록 강한 힘을 받음
      const forceFactor = (radius - distance) / radius;
      const forceMagnitude = maxForce * forceFactor;

      const force = {
        x: (dx / distance) * forceMagnitude * body.mass * 0.05,
        y: (dy / distance) * forceMagnitude * body.mass * 0.05 - 0.02 * body.mass, // 약간 위로 붕 뜨도록 y 보정
      };

      Matter.Body.applyForce(body, body.position, force);
    }
  });
};
