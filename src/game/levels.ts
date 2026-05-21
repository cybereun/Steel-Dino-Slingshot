import { type GameLevel, DinoType, BlockMaterial } from '../types';

export const GAME_LEVELS: GameLevel[] = [
  // ==========================================
  // 🌿 쉬움 난이도 (EASY) - 1단계 ~ 10단계
  // ==========================================
  {
    id: 1,
    name: "1. 로봇 정찰대 초소 🌿",
    dinoQueue: [DinoType.TYRANNO, DinoType.PTERA, DinoType.TRICERA],
    threeStarScore: 3500,
    twoStarScore: 2000,
    obstacles: [
      { x: 650, y: 500, width: 20, height: 120, material: BlockMaterial.STONE },
      { x: 750, y: 500, width: 20, height: 120, material: BlockMaterial.STONE },
      { x: 700, y: 430, width: 140, height: 20, material: BlockMaterial.WOOD },
      { x: 670, y: 370, width: 20, height: 100, material: BlockMaterial.GLASS },
      { x: 730, y: 370, width: 20, height: 100, material: BlockMaterial.GLASS },
      { x: 700, y: 310, width: 100, height: 20, material: BlockMaterial.WOOD },
    ],
    enemies: [
      { x: 700, y: 540, radius: 20, hp: 1 },
      { x: 700, y: 402, radius: 18, hp: 1 },
    ],
  },
  {
    id: 2,
    name: "2. TNT 화약고 요새 💥",
    dinoQueue: [DinoType.TYRANNO, DinoType.TYRANNO, DinoType.TRICERA],
    threeStarScore: 4800,
    twoStarScore: 2800,
    obstacles: [
      { x: 620, y: 480, width: 30, height: 160, material: BlockMaterial.STONE },
      { x: 780, y: 480, width: 30, height: 160, material: BlockMaterial.STONE },
      { x: 700, y: 390, width: 200, height: 20, material: BlockMaterial.STONE },
      { x: 700, y: 540, width: 40, height: 40, material: BlockMaterial.TNT },
      { x: 650, y: 320, width: 20, height: 120, material: BlockMaterial.WOOD },
      { x: 750, y: 320, width: 20, height: 120, material: BlockMaterial.WOOD },
      { x: 700, y: 250, width: 140, height: 20, material: BlockMaterial.GLASS },
    ],
    enemies: [
      { x: 670, y: 362, radius: 18, hp: 1 },
      { x: 730, y: 362, radius: 18, hp: 1 },
      { x: 740, y: 538, radius: 22, hp: 1 },
    ],
  },
  {
    id: 3,
    name: "3. 목재 벙커 돌파선 🪵",
    dinoQueue: [DinoType.TRICERA, DinoType.TRICERA, DinoType.PTERA],
    threeStarScore: 4000,
    twoStarScore: 2500,
    obstacles: [
      { x: 600, y: 530, width: 40, height: 60, material: BlockMaterial.STONE },
      { x: 760, y: 530, width: 40, height: 60, material: BlockMaterial.STONE },
      { x: 680, y: 490, width: 180, height: 20, material: BlockMaterial.WOOD },
      { x: 630, y: 420, width: 25, height: 120, material: BlockMaterial.WOOD },
      { x: 680, y: 420, width: 25, height: 120, material: BlockMaterial.WOOD },
      { x: 730, y: 420, width: 25, height: 120, material: BlockMaterial.WOOD },
      { x: 680, y: 350, width: 140, height: 20, material: BlockMaterial.WOOD },
    ],
    enemies: [
      { x: 655, y: 465, radius: 16, hp: 1 },
      { x: 705, y: 465, radius: 16, hp: 1 },
    ],
  },
  {
    id: 4,
    name: "4. 크리스탈 가든 온실 💎",
    dinoQueue: [DinoType.PTERA, DinoType.PTERA, DinoType.TYRANNO],
    threeStarScore: 5500,
    twoStarScore: 3500,
    obstacles: [
      { x: 610, y: 500, width: 20, height: 120, material: BlockMaterial.GLASS },
      { x: 690, y: 500, width: 20, height: 120, material: BlockMaterial.GLASS },
      { x: 770, y: 500, width: 20, height: 120, material: BlockMaterial.GLASS },
      { x: 650, y: 430, width: 100, height: 20, material: BlockMaterial.GLASS },
      { x: 730, y: 430, width: 100, height: 20, material: BlockMaterial.GLASS },
      { x: 650, y: 360, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 730, y: 360, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 690, y: 290, width: 120, height: 20, material: BlockMaterial.WOOD },
    ],
    enemies: [
      { x: 650, y: 535, radius: 16, hp: 1 },
      { x: 730, y: 535, radius: 16, hp: 1 },
      { x: 690, y: 395, radius: 18, hp: 1 },
    ],
  },
  {
    id: 5,
    name: "5. 공중 부유 레이더 기지 🚀",
    dinoQueue: [DinoType.TYRANNO, DinoType.TRICERA, DinoType.TYRANNO],
    threeStarScore: 5200,
    twoStarScore: 3200,
    obstacles: [
      { x: 640, y: 510, width: 16, height: 100, material: BlockMaterial.GLASS },
      { x: 740, y: 510, width: 16, height: 100, material: BlockMaterial.GLASS },
      { x: 690, y: 450, width: 160, height: 20, material: BlockMaterial.STONE },
      { x: 650, y: 380, width: 20, height: 120, material: BlockMaterial.WOOD },
      { x: 730, y: 380, width: 20, height: 120, material: BlockMaterial.WOOD },
      { x: 690, y: 310, width: 110, height: 20, material: BlockMaterial.WOOD },
      { x: 690, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
    ],
    enemies: [
      { x: 690, y: 420, radius: 20, hp: 1 },
      { x: 690, y: 280, radius: 22, hp: 2 },
    ],
  },
  {
    id: 6,
    name: "6. 아치형 글라스 브릿지 🌉",
    dinoQueue: [DinoType.TYRANNO, DinoType.PTERA, DinoType.TRICERA],
    threeStarScore: 4200,
    twoStarScore: 2600,
    obstacles: [
      { x: 620, y: 530, width: 30, height: 60, material: BlockMaterial.STONE },
      { x: 740, y: 530, width: 30, height: 60, material: BlockMaterial.STONE },
      { x: 680, y: 490, width: 150, height: 20, material: BlockMaterial.GLASS },
      { x: 650, y: 420, width: 20, height: 120, material: BlockMaterial.WOOD },
      { x: 710, y: 420, width: 20, height: 120, material: BlockMaterial.WOOD },
      { x: 680, y: 350, width: 100, height: 20, material: BlockMaterial.STONE },
    ],
    enemies: [
      { x: 680, y: 540, radius: 18, hp: 1 },
      { x: 680, y: 400, radius: 16, hp: 1 },
    ],
  },
  {
    id: 7,
    name: "7. 공중 부유 풍선 기지 🎈",
    dinoQueue: [DinoType.PTERA, DinoType.PTERA, DinoType.TRICERA],
    threeStarScore: 3800,
    twoStarScore: 2200,
    obstacles: [
      { x: 680, y: 400, width: 120, height: 20, material: BlockMaterial.WOOD },
      { x: 640, y: 340, width: 15, height: 100, material: BlockMaterial.GLASS },
      { x: 720, y: 340, width: 15, height: 100, material: BlockMaterial.GLASS },
      { x: 680, y: 280, width: 100, height: 20, material: BlockMaterial.GLASS },
      { x: 680, y: 540, width: 35, height: 35, material: BlockMaterial.TNT }
    ],
    enemies: [
      { x: 680, y: 370, radius: 16, hp: 1 },
      { x: 680, y: 250, radius: 16, hp: 1 }
    ],
  },
  {
    id: 8,
    name: "8. 목재 수직 방벽 🪵",
    dinoQueue: [DinoType.TRICERA, DinoType.TRICERA, DinoType.TYRANNO],
    threeStarScore: 5000,
    twoStarScore: 3000,
    obstacles: [
      { x: 600, y: 460, width: 20, height: 200, material: BlockMaterial.WOOD },
      { x: 650, y: 460, width: 20, height: 200, material: BlockMaterial.WOOD },
      { x: 700, y: 460, width: 20, height: 200, material: BlockMaterial.WOOD },
      { x: 750, y: 460, width: 20, height: 200, material: BlockMaterial.STONE },
      { x: 675, y: 350, width: 180, height: 20, material: BlockMaterial.GLASS }
    ],
    enemies: [
      { x: 625, y: 540, radius: 16, hp: 1 },
      { x: 675, y: 540, radius: 16, hp: 1 },
      { x: 725, y: 540, radius: 18, hp: 1 }
    ],
  },
  {
    id: 9,
    name: "9. TNT 샌드위치 요새 🥪",
    dinoQueue: [DinoType.TYRANNO, DinoType.TRICERA, DinoType.TYRANNO],
    threeStarScore: 5800,
    twoStarScore: 3600,
    obstacles: [
      { x: 620, y: 500, width: 30, height: 120, material: BlockMaterial.STONE },
      { x: 720, y: 500, width: 30, height: 120, material: BlockMaterial.STONE },
      { x: 670, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 670, y: 430, width: 130, height: 20, material: BlockMaterial.STONE },
      { x: 670, y: 390, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 630, y: 320, width: 20, height: 120, material: BlockMaterial.GLASS },
      { x: 710, y: 320, width: 20, height: 120, material: BlockMaterial.GLASS },
      { x: 670, y: 250, width: 100, height: 20, material: BlockMaterial.WOOD }
    ],
    enemies: [
      { x: 670, y: 485, radius: 18, hp: 1 },
      { x: 670, y: 220, radius: 18, hp: 2 }
    ],
  },
  {
    id: 10,
    name: "10. 쉬움 관문: 전진 초소 🛡",
    dinoQueue: [DinoType.TYRANNO, DinoType.PTERA, DinoType.TRICERA, DinoType.TYRANNO],
    threeStarScore: 6500,
    twoStarScore: 4000,
    obstacles: [
      { x: 590, y: 480, width: 30, height: 160, material: BlockMaterial.STONE },
      { x: 750, y: 480, width: 30, height: 160, material: BlockMaterial.STONE },
      { x: 670, y: 480, width: 20, height: 160, material: BlockMaterial.WOOD },
      { x: 670, y: 390, width: 200, height: 20, material: BlockMaterial.STONE },
      { x: 630, y: 330, width: 20, height: 100, material: BlockMaterial.GLASS },
      { x: 710, y: 330, width: 20, height: 100, material: BlockMaterial.GLASS },
      { x: 670, y: 270, width: 100, height: 20, material: BlockMaterial.WOOD }
    ],
    enemies: [
      { x: 630, y: 540, radius: 18, hp: 1 },
      { x: 710, y: 540, radius: 18, hp: 1 },
      { x: 670, y: 350, radius: 20, hp: 2 }
    ],
  },

  // ==========================================
  // ⚡ 보통 난이도 (NORMAL) - 11단계 ~ 20단계
  // ==========================================
  {
    id: 11,
    name: "11. 사이버 메카 코어 성벽 ⚡",
    dinoQueue: [DinoType.TRICERA, DinoType.PTERA, DinoType.TYRANNO, DinoType.TYRANNO],
    threeStarScore: 7800,
    twoStarScore: 4600,
    obstacles: [
      { x: 600, y: 490, width: 40, height: 140, material: BlockMaterial.STONE },
      { x: 800, y: 490, width: 40, height: 140, material: BlockMaterial.STONE },
      { x: 700, y: 490, width: 40, height: 140, material: BlockMaterial.STONE },
      { x: 700, y: 410, width: 260, height: 20, material: BlockMaterial.STONE },
      { x: 650, y: 542.5, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 750, y: 542.5, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 630, y: 330, width: 20, height: 140, material: BlockMaterial.WOOD },
      { x: 770, y: 330, width: 20, height: 140, material: BlockMaterial.WOOD },
      { x: 700, y: 330, width: 20, height: 140, material: BlockMaterial.GLASS },
      { x: 700, y: 250, width: 200, height: 20, material: BlockMaterial.WOOD },
      { x: 680, y: 180, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 720, y: 180, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 700, y: 110, width: 80, height: 20, material: BlockMaterial.WOOD }
    ],
    enemies: [
      { x: 700, y: 75, radius: 24, hp: 2 },
      { x: 660, y: 382, radius: 18, hp: 1 },
      { x: 740, y: 382, radius: 18, hp: 1 },
      { x: 700, y: 540, radius: 20, hp: 2 }
    ]
  },
  {
    id: 12,
    name: "12. 더블 대칭 타워 🏗",
    dinoQueue: [DinoType.PTERA, DinoType.TRICERA, DinoType.TYRANNO, DinoType.TRICERA],
    threeStarScore: 6800,
    twoStarScore: 4000,
    obstacles: [
      { x: 580, y: 490, width: 20, height: 140, material: BlockMaterial.GLASS },
      { x: 660, y: 490, width: 20, height: 140, material: BlockMaterial.GLASS },
      { x: 620, y: 410, width: 100, height: 20, material: BlockMaterial.GLASS },
      { x: 620, y: 340, width: 60, height: 120, material: BlockMaterial.WOOD },
      { x: 720, y: 490, width: 25, height: 140, material: BlockMaterial.STONE },
      { x: 800, y: 490, width: 25, height: 140, material: BlockMaterial.STONE },
      { x: 760, y: 410, width: 110, height: 20, material: BlockMaterial.STONE },
      { x: 760, y: 340, width: 50, height: 120, material: BlockMaterial.GLASS },
      { x: 690, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
    ],
    enemies: [
      { x: 620, y: 490, radius: 18, hp: 1 },
      { x: 760, y: 490, radius: 18, hp: 2 },
      { x: 620, y: 260, radius: 16, hp: 1 },
    ],
  },
  {
    id: 13,
    name: "13. 지그재그 도미노 슬라이드 🚧",
    dinoQueue: [DinoType.TRICERA, DinoType.TYRANNO, DinoType.TYRANNO],
    threeStarScore: 7200,
    twoStarScore: 4200,
    obstacles: [
      { x: 600, y: 520, width: 20, height: 80, material: BlockMaterial.STONE },
      { x: 780, y: 520, width: 20, height: 80, material: BlockMaterial.STONE },
      { x: 690, y: 470, width: 200, height: 20, material: BlockMaterial.WOOD },
      { x: 620, y: 410, width: 20, height: 100, material: BlockMaterial.WOOD },
      { x: 700, y: 410, width: 20, height: 100, material: BlockMaterial.WOOD },
      { x: 660, y: 350, width: 120, height: 20, material: BlockMaterial.GLASS },
      { x: 680, y: 290, width: 20, height: 100, material: BlockMaterial.GLASS },
      { x: 760, y: 290, width: 20, height: 100, material: BlockMaterial.GLASS },
      { x: 720, y: 230, width: 120, height: 20, material: BlockMaterial.WOOD },
      { x: 740, y: 430, width: 35, height: 35, material: BlockMaterial.TNT },
    ],
    enemies: [
      { x: 660, y: 430, radius: 18, hp: 1 },
      { x: 720, y: 310, radius: 18, hp: 1 },
      { x: 720, y: 190, radius: 20, hp: 2 },
    ],
  },
  {
    id: 14,
    name: "14. 마그마 코어 피라미드 🌋",
    dinoQueue: [DinoType.TYRANNO, DinoType.TRICERA, DinoType.PTERA, DinoType.TYRANNO],
    threeStarScore: 8500,
    twoStarScore: 5000,
    obstacles: [
      { x: 560, y: 500, width: 30, height: 120, material: BlockMaterial.STONE },
      { x: 640, y: 500, width: 30, height: 120, material: BlockMaterial.STONE },
      { x: 720, y: 500, width: 30, height: 120, material: BlockMaterial.STONE },
      { x: 800, y: 500, width: 30, height: 120, material: BlockMaterial.STONE },
      { x: 680, y: 430, width: 280, height: 20, material: BlockMaterial.STONE },
      { x: 600, y: 370, width: 25, height: 100, material: BlockMaterial.WOOD },
      { x: 680, y: 370, width: 25, height: 100, material: BlockMaterial.WOOD },
      { x: 760, y: 370, width: 25, height: 100, material: BlockMaterial.WOOD },
      { x: 680, y: 310, width: 200, height: 20, material: BlockMaterial.WOOD },
      { x: 640, y: 250, width: 20, height: 100, material: BlockMaterial.GLASS },
      { x: 720, y: 250, width: 20, height: 100, material: BlockMaterial.GLASS },
      { x: 680, y: 190, width: 120, height: 20, material: BlockMaterial.GLASS },
      { x: 680, y: 535, width: 35, height: 35, material: BlockMaterial.TNT },
    ],
    enemies: [
      { x: 600, y: 535, radius: 18, hp: 1 },
      { x: 760, y: 535, radius: 18, hp: 1 },
      { x: 680, y: 270, radius: 20, hp: 2 },
    ],
  },
  {
    id: 15,
    name: "15. 사이버 레이더 송신탑 📡",
    dinoQueue: [DinoType.PTERA, DinoType.TYRANNO, DinoType.TRICERA, DinoType.PTERA],
    threeStarScore: 7500,
    twoStarScore: 4500,
    obstacles: [
      { x: 680, y: 500, width: 25, height: 120, material: BlockMaterial.STONE },
      { x: 740, y: 500, width: 25, height: 120, material: BlockMaterial.STONE },
      { x: 710, y: 430, width: 100, height: 20, material: BlockMaterial.STONE },
      { x: 690, y: 370, width: 15, height: 100, material: BlockMaterial.GLASS },
      { x: 730, y: 370, width: 15, height: 100, material: BlockMaterial.GLASS },
      { x: 710, y: 310, width: 80, height: 20, material: BlockMaterial.WOOD },
      { x: 700, y: 250, width: 12, height: 100, material: BlockMaterial.GLASS },
      { x: 720, y: 250, width: 12, height: 100, material: BlockMaterial.GLASS },
      { x: 710, y: 190, width: 60, height: 20, material: BlockMaterial.GLASS },
      { x: 630, y: 500, width: 15, height: 120, material: BlockMaterial.WOOD },
      { x: 790, y: 500, width: 15, height: 120, material: BlockMaterial.WOOD },
    ],
    enemies: [
      { x: 710, y: 540, radius: 20, hp: 2 },
      { x: 710, y: 155, radius: 24, hp: 3 },
    ],
  },
  {
    id: 16,
    name: "16. 크리스탈 타워 윙 🪶",
    dinoQueue: [DinoType.PTERA, DinoType.TYRANNO, DinoType.TRICERA, DinoType.PTERA],
    threeStarScore: 7000,
    twoStarScore: 4200,
    obstacles: [
      { x: 590, y: 490, width: 25, height: 140, material: BlockMaterial.STONE },
      { x: 750, y: 490, width: 25, height: 140, material: BlockMaterial.STONE },
      { x: 670, y: 410, width: 190, height: 20, material: BlockMaterial.GLASS },
      { x: 620, y: 340, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 720, y: 340, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 670, y: 270, width: 120, height: 20, material: BlockMaterial.WOOD },
      { x: 670, y: 540, width: 35, height: 35, material: BlockMaterial.TNT }
    ],
    enemies: [
      { x: 630, y: 490, radius: 18, hp: 2 },
      { x: 710, y: 490, radius: 18, hp: 2 },
      { x: 670, y: 240, radius: 20, hp: 1 }
    ],
  },
  {
    id: 17,
    name: "17. 지그재그 수직 광산 ⛏",
    dinoQueue: [DinoType.TRICERA, DinoType.TYRANNO, DinoType.TYRANNO],
    threeStarScore: 6800,
    twoStarScore: 4000,
    obstacles: [
      { x: 580, y: 520, width: 40, height: 80, material: BlockMaterial.STONE },
      { x: 660, y: 460, width: 40, height: 140, material: BlockMaterial.WOOD },
      { x: 740, y: 400, width: 40, height: 200, material: BlockMaterial.STONE },
      { x: 800, y: 540, width: 35, height: 35, material: BlockMaterial.TNT }
    ],
    enemies: [
      { x: 620, y: 540, radius: 18, hp: 1 },
      { x: 700, y: 490, radius: 18, hp: 2 },
      { x: 740, y: 270, radius: 22, hp: 2 }
    ],
  },
  {
    id: 18,
    name: "18. 더블 타격 벙커 🧱",
    dinoQueue: [DinoType.TYRANNO, DinoType.TRICERA, DinoType.PTERA, DinoType.TYRANNO],
    threeStarScore: 8200,
    twoStarScore: 4800,
    obstacles: [
      { x: 580, y: 500, width: 25, height: 120, material: BlockMaterial.STONE },
      { x: 640, y: 500, width: 25, height: 120, material: BlockMaterial.STONE },
      { x: 610, y: 430, width: 90, height: 20, material: BlockMaterial.STONE },
      { x: 720, y: 500, width: 25, height: 120, material: BlockMaterial.STONE },
      { x: 780, y: 500, width: 25, height: 120, material: BlockMaterial.STONE },
      { x: 750, y: 430, width: 90, height: 20, material: BlockMaterial.STONE },
      { x: 680, y: 350, width: 120, height: 20, material: BlockMaterial.WOOD },
      { x: 680, y: 300, width: 35, height: 35, material: BlockMaterial.TNT }
    ],
    enemies: [
      { x: 610, y: 540, radius: 18, hp: 2 },
      { x: 750, y: 540, radius: 18, hp: 2 },
      { x: 680, y: 240, radius: 20, hp: 1 }
    ],
  },
  {
    id: 19,
    name: "19. 다이내믹 체인 기지 ⛓",
    dinoQueue: [DinoType.PTERA, DinoType.TRICERA, DinoType.TYRANNO, DinoType.PTERA],
    threeStarScore: 7600,
    twoStarScore: 4400,
    obstacles: [
      { x: 600, y: 530, width: 20, height: 60, material: BlockMaterial.GLASS },
      { x: 760, y: 530, width: 20, height: 60, material: BlockMaterial.GLASS },
      { x: 680, y: 490, width: 180, height: 20, material: BlockMaterial.STONE },
      { x: 640, y: 420, width: 20, height: 120, material: BlockMaterial.WOOD },
      { x: 720, y: 420, width: 20, height: 120, material: BlockMaterial.WOOD },
      { x: 680, y: 350, width: 100, height: 20, material: BlockMaterial.GLASS },
      { x: 680, y: 540, width: 35, height: 35, material: BlockMaterial.TNT }
    ],
    enemies: [
      { x: 680, y: 450, radius: 16, hp: 1 },
      { x: 680, y: 310, radius: 20, hp: 2 }
    ],
  },
  {
    id: 20,
    name: "20. 보통 관문: 메카 공장 🏭",
    dinoQueue: [DinoType.TYRANNO, DinoType.TRICERA, DinoType.PTERA, DinoType.TYRANNO, DinoType.TRICERA],
    threeStarScore: 9500,
    twoStarScore: 5800,
    obstacles: [
      { x: 570, y: 480, width: 40, height: 160, material: BlockMaterial.STONE },
      { x: 790, y: 480, width: 40, height: 160, material: BlockMaterial.STONE },
      { x: 680, y: 480, width: 25, height: 160, material: BlockMaterial.STONE },
      { x: 680, y: 390, width: 260, height: 20, material: BlockMaterial.STONE },
      { x: 620, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 740, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 630, y: 310, width: 20, height: 140, material: BlockMaterial.WOOD },
      { x: 730, y: 310, width: 20, height: 140, material: BlockMaterial.WOOD },
      { x: 680, y: 230, width: 120, height: 20, material: BlockMaterial.GLASS }
    ],
    enemies: [
      { x: 680, y: 540, radius: 22, hp: 3 },
      { x: 680, y: 350, radius: 18, hp: 1 },
      { x: 680, y: 190, radius: 20, hp: 2 }
    ],
  },

  // ==========================================
  // 💀 어려움 난이도 (HARD) - 21단계 ~ 30단계
  // ==========================================
  {
    id: 21,
    name: "21. 아크 가디언 성채 요새 🏰",
    dinoQueue: [DinoType.TYRANNO, DinoType.TRICERA, DinoType.PTERA, DinoType.TYRANNO],
    threeStarScore: 9200,
    twoStarScore: 5500,
    obstacles: [
      { x: 570, y: 460, width: 40, height: 200, material: BlockMaterial.STONE },
      { x: 810, y: 460, width: 40, height: 200, material: BlockMaterial.STONE },
      { x: 690, y: 350, width: 280, height: 20, material: BlockMaterial.STONE },
      { x: 630, y: 480, width: 20, height: 120, material: BlockMaterial.WOOD },
      { x: 750, y: 480, width: 20, height: 120, material: BlockMaterial.WOOD },
      { x: 690, y: 410, width: 140, height: 20, material: BlockMaterial.GLASS },
      { x: 690, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 640, y: 280, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 740, y: 280, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 690, y: 210, width: 130, height: 20, material: BlockMaterial.WOOD }
    ],
    enemies: [
      { x: 690, y: 470, radius: 22, hp: 3 },
      { x: 690, y: 175, radius: 18, hp: 1 },
      { x: 610, y: 540, radius: 18, hp: 1 },
      { x: 770, y: 540, radius: 18, hp: 1 }
    ],
  },
  {
    id: 22,
    name: "22. 플로팅 보텍스 플랫폼 🌪",
    dinoQueue: [DinoType.PTERA, DinoType.TRICERA, DinoType.TRICERA, DinoType.PTERA],
    threeStarScore: 8800,
    twoStarScore: 5000,
    obstacles: [
      { x: 620, y: 510, width: 15, height: 100, material: BlockMaterial.GLASS },
      { x: 760, y: 510, width: 15, height: 100, material: BlockMaterial.GLASS },
      { x: 690, y: 450, width: 220, height: 25, material: BlockMaterial.STONE },
      { x: 610, y: 370, width: 20, height: 130, material: BlockMaterial.WOOD },
      { x: 690, y: 370, width: 20, height: 130, material: BlockMaterial.GLASS },
      { x: 770, y: 370, width: 20, height: 130, material: BlockMaterial.WOOD },
      { x: 690, y: 295, width: 200, height: 20, material: BlockMaterial.WOOD },
      { x: 660, y: 230, width: 15, height: 110, material: BlockMaterial.GLASS },
      { x: 720, y: 230, width: 15, height: 110, material: BlockMaterial.GLASS },
      { x: 690, y: 165, width: 100, height: 20, material: BlockMaterial.WOOD },
      { x: 690, y: 540, width: 35, height: 35, material: BlockMaterial.TNT }
    ],
    enemies: [
      { x: 650, y: 405, radius: 18, hp: 2 },
      { x: 730, y: 405, radius: 18, hp: 2 },
      { x: 690, y: 130, radius: 20, hp: 1 },
    ],
  },
  {
    id: 23,
    name: "23. TNT 폭발 연쇄 도미노 ☣️",
    dinoQueue: [DinoType.TYRANNO, DinoType.PTERA, DinoType.TRICERA],
    threeStarScore: 11000,
    twoStarScore: 6500,
    obstacles: [
      { x: 570, y: 500, width: 20, height: 120, material: BlockMaterial.STONE },
      { x: 630, y: 500, width: 20, height: 120, material: BlockMaterial.GLASS },
      { x: 600, y: 430, width: 80, height: 20, material: BlockMaterial.WOOD },
      { x: 600, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 670, y: 500, width: 20, height: 120, material: BlockMaterial.GLASS },
      { x: 730, y: 500, width: 20, height: 120, material: BlockMaterial.GLASS },
      { x: 700, y: 430, width: 80, height: 20, material: BlockMaterial.WOOD },
      { x: 700, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 770, y: 500, width: 20, height: 120, material: BlockMaterial.GLASS },
      { x: 830, y: 500, width: 20, height: 120, material: BlockMaterial.STONE },
      { x: 800, y: 430, width: 80, height: 20, material: BlockMaterial.WOOD },
      { x: 800, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 700, y: 390, width: 300, height: 20, material: BlockMaterial.STONE },
      { x: 700, y: 310, width: 20, height: 140, material: BlockMaterial.WOOD }
    ],
    enemies: [
      { x: 600, y: 400, radius: 18, hp: 1 },
      { x: 700, y: 400, radius: 18, hp: 2 },
      { x: 800, y: 400, radius: 18, hp: 1 },
      { x: 700, y: 220, radius: 22, hp: 3 },
    ],
  },
  {
    id: 24,
    name: "24. 가디언 포스 실드 요새 🛡",
    dinoQueue: [DinoType.TYRANNO, DinoType.TRICERA, DinoType.TRICERA, DinoType.PTERA, DinoType.TYRANNO],
    threeStarScore: 9800,
    twoStarScore: 6000,
    obstacles: [
      { x: 570, y: 500, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 620, y: 500, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 670, y: 500, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 720, y: 500, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 770, y: 500, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 820, y: 500, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 695, y: 430, width: 300, height: 25, material: BlockMaterial.STONE },
      { x: 630, y: 350, width: 25, height: 130, material: BlockMaterial.WOOD },
      { x: 760, y: 350, width: 25, height: 130, material: BlockMaterial.WOOD },
      { x: 695, y: 275, width: 160, height: 20, material: BlockMaterial.STONE },
      { x: 695, y: 220, width: 40, height: 40, material: BlockMaterial.TNT },
      { x: 660, y: 220, width: 15, height: 90, material: BlockMaterial.GLASS },
      { x: 730, y: 220, width: 15, height: 90, material: BlockMaterial.GLASS },
      { x: 695, y: 165, width: 90, height: 20, material: BlockMaterial.WOOD },
    ],
    enemies: [
      { x: 600, y: 400, radius: 18, hp: 1 },
      { x: 790, y: 400, radius: 18, hp: 1 },
      { x: 695, y: 360, radius: 24, hp: 3 },
      { x: 695, y: 135, radius: 18, hp: 1 }
    ],
  },
  {
    id: 25,
    name: "25. 스틸 디노 가디언즈 요새 🌌",
    dinoQueue: [DinoType.TYRANNO, DinoType.PTERA, DinoType.TRICERA, DinoType.TYRANNO, DinoType.TRICERA, DinoType.PTERA],
    threeStarScore: 15000,
    twoStarScore: 9000,
    obstacles: [
      { x: 550, y: 480, width: 35, height: 160, material: BlockMaterial.STONE },
      { x: 620, y: 480, width: 35, height: 160, material: BlockMaterial.STONE },
      { x: 690, y: 480, width: 35, height: 160, material: BlockMaterial.STONE },
      { x: 760, y: 480, width: 35, height: 160, material: BlockMaterial.STONE },
      { x: 830, y: 480, width: 35, height: 160, material: BlockMaterial.STONE },
      { x: 690, y: 390, width: 320, height: 20, material: BlockMaterial.STONE },
      { x: 585, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 795, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 690, y: 350, width: 40, height: 40, material: BlockMaterial.TNT },
      { x: 610, y: 300, width: 25, height: 160, material: BlockMaterial.WOOD },
      { x: 770, y: 300, width: 25, height: 160, material: BlockMaterial.WOOD },
      { x: 690, y: 210, width: 200, height: 20, material: BlockMaterial.WOOD },
      { x: 650, y: 150, width: 20, height: 100, material: BlockMaterial.GLASS },
      { x: 730, y: 150, width: 20, height: 100, material: BlockMaterial.GLASS },
      { x: 690, y: 90, width: 110, height: 20, material: BlockMaterial.GLASS },
    ],
    enemies: [
      { x: 655, y: 540, radius: 20, hp: 2 },
      { x: 725, y: 540, radius: 20, hp: 2 },
      { x: 690, y: 300, radius: 22, hp: 3 },
      { x: 690, y: 50, radius: 24, hp: 3 },
      { x: 690, y: 180, radius: 16, hp: 1 },
    ],
  },
  {
    id: 26,
    name: "26. 인버티드 피라미드 요새 🗼",
    dinoQueue: [DinoType.PTERA, DinoType.TRICERA, DinoType.TYRANNO, DinoType.PTERA],
    threeStarScore: 9800,
    twoStarScore: 5800,
    obstacles: [
      { x: 660, y: 510, width: 15, height: 100, material: BlockMaterial.GLASS },
      { x: 720, y: 510, width: 15, height: 100, material: BlockMaterial.GLASS },
      { x: 690, y: 450, width: 140, height: 20, material: BlockMaterial.WOOD },
      { x: 620, y: 370, width: 20, height: 140, material: BlockMaterial.WOOD },
      { x: 760, y: 370, width: 20, height: 140, material: BlockMaterial.WOOD },
      { x: 690, y: 290, width: 200, height: 20, material: BlockMaterial.STONE },
      { x: 690, y: 540, width: 35, height: 35, material: BlockMaterial.TNT }
    ],
    enemies: [
      { x: 690, y: 400, radius: 18, hp: 2 },
      { x: 690, y: 250, radius: 22, hp: 3 }
    ],
  },
  {
    id: 27,
    name: "27. 철갑 메카 기어 요새 ⚙️",
    dinoQueue: [DinoType.TYRANNO, DinoType.TRICERA, DinoType.TYRANNO],
    threeStarScore: 9000,
    twoStarScore: 5400,
    obstacles: [
      { x: 580, y: 490, width: 35, height: 140, material: BlockMaterial.STONE },
      { x: 640, y: 490, width: 35, height: 140, material: BlockMaterial.STONE },
      { x: 700, y: 490, width: 35, height: 140, material: BlockMaterial.STONE },
      { x: 760, y: 490, width: 35, height: 140, material: BlockMaterial.STONE },
      { x: 670, y: 410, width: 220, height: 20, material: BlockMaterial.STONE },
      { x: 630, y: 330, width: 20, height: 140, material: BlockMaterial.WOOD },
      { x: 710, y: 330, width: 20, height: 140, material: BlockMaterial.WOOD },
      { x: 670, y: 250, width: 120, height: 20, material: BlockMaterial.GLASS },
      { x: 670, y: 540, width: 35, height: 35, material: BlockMaterial.TNT }
    ],
    enemies: [
      { x: 610, y: 540, radius: 18, hp: 2 },
      { x: 730, y: 540, radius: 18, hp: 2 },
      { x: 670, y: 210, radius: 24, hp: 3 }
    ],
  },
  {
    id: 28,
    name: "28. TNT 메이즈 지하창고 🌀",
    dinoQueue: [DinoType.TRICERA, DinoType.PTERA, DinoType.TYRANNO, DinoType.TRICERA],
    threeStarScore: 11500,
    twoStarScore: 6800,
    obstacles: [
      { x: 570, y: 480, width: 40, height: 160, material: BlockMaterial.STONE },
      { x: 790, y: 480, width: 40, height: 160, material: BlockMaterial.STONE },
      { x: 680, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 680, y: 480, width: 20, height: 80, material: BlockMaterial.STONE },
      { x: 680, y: 430, width: 180, height: 20, material: BlockMaterial.STONE },
      { x: 620, y: 350, width: 20, height: 140, material: BlockMaterial.GLASS },
      { x: 740, y: 350, width: 20, height: 140, material: BlockMaterial.GLASS },
      { x: 680, y: 270, width: 140, height: 20, material: BlockMaterial.WOOD },
      { x: 625, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 735, y: 540, width: 35, height: 35, material: BlockMaterial.TNT }
    ],
    enemies: [
      { x: 680, y: 390, radius: 18, hp: 2 },
      { x: 680, y: 230, radius: 20, hp: 3 }
    ],
  },
  {
    id: 29,
    name: "29. 부유식 가디언 크로스 ➕",
    dinoQueue: [DinoType.PTERA, DinoType.PTERA, DinoType.TRICERA, DinoType.TYRANNO, DinoType.PTERA],
    threeStarScore: 10500,
    twoStarScore: 6200,
    obstacles: [
      { x: 680, y: 440, width: 160, height: 25, material: BlockMaterial.STONE },
      { x: 680, y: 360, width: 25, height: 140, material: BlockMaterial.STONE },
      { x: 680, y: 280, width: 100, height: 20, material: BlockMaterial.WOOD },
      { x: 630, y: 510, width: 15, height: 100, material: BlockMaterial.GLASS },
      { x: 730, y: 510, width: 15, height: 100, material: BlockMaterial.GLASS },
      { x: 680, y: 540, width: 35, height: 35, material: BlockMaterial.TNT }
    ],
    enemies: [
      { x: 630, y: 400, radius: 18, hp: 2 },
      { x: 730, y: 400, radius: 18, hp: 2 },
      { x: 680, y: 240, radius: 22, hp: 3 }
    ],
  },
  {
    id: 30,
    name: "30. 최종 결전: 네오 스틸 🌌",
    dinoQueue: [DinoType.TYRANNO, DinoType.PTERA, DinoType.TRICERA, DinoType.TYRANNO, DinoType.TRICERA, DinoType.PTERA, DinoType.TYRANNO],
    threeStarScore: 16000,
    twoStarScore: 9500,
    obstacles: [
      { x: 550, y: 480, width: 40, height: 160, material: BlockMaterial.STONE },
      { x: 620, y: 480, width: 40, height: 160, material: BlockMaterial.STONE },
      { x: 690, y: 480, width: 40, height: 160, material: BlockMaterial.STONE },
      { x: 760, y: 480, width: 40, height: 160, material: BlockMaterial.STONE },
      { x: 830, y: 480, width: 40, height: 160, material: BlockMaterial.STONE },
      { x: 690, y: 390, width: 320, height: 25, material: BlockMaterial.STONE },
      { x: 585, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 795, y: 540, width: 35, height: 35, material: BlockMaterial.TNT },
      { x: 690, y: 350, width: 40, height: 40, material: BlockMaterial.TNT },
      { x: 600, y: 290, width: 20, height: 180, material: BlockMaterial.WOOD },
      { x: 780, y: 290, width: 20, height: 180, material: BlockMaterial.WOOD },
      { x: 690, y: 190, width: 200, height: 20, material: BlockMaterial.STONE },
      { x: 640, y: 120, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 740, y: 120, width: 15, height: 120, material: BlockMaterial.GLASS },
      { x: 690, y: 50, width: 120, height: 20, material: BlockMaterial.GLASS }
    ],
    enemies: [
      { x: 655, y: 540, radius: 20, hp: 3 },
      { x: 725, y: 540, radius: 20, hp: 3 },
      { x: 690, y: 280, radius: 24, hp: 4 },
      { x: 690, y: 150, radius: 20, hp: 3 },
      { x: 690, y: 20, radius: 18, hp: 2 }
    ],
  }
];
