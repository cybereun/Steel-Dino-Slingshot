export type Position = {
  x: number;
  y: number;
};

export const DinoType = {
  TYRANNO: 'TYRANNO', // Fire (Explosion on click)
  PTERA: 'PTERA',     // Ice (Splits into 3 on click)
  TRICERA: 'TRICERA', // Ground/Speed (Dash attack on click)
} as const;
export type DinoType = typeof DinoType[keyof typeof DinoType];

export const BlockMaterial = {
  WOOD: 'WOOD',
  STONE: 'STONE',
  GLASS: 'GLASS',
  TNT: 'TNT',
} as const;
export type BlockMaterial = typeof BlockMaterial[keyof typeof BlockMaterial];

export interface SlingshotState {
  x: number;
  y: number;
  isDragging: boolean;
  dragX: number;
  dragY: number;
}

export interface GameLevel {
  id: number;
  name: string;
  dinoQueue: DinoType[]; // 유저가 사용할 수 있는 공룡 목록
  obstacles: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    material: BlockMaterial;
  }>;
  enemies: Array<{
    x: number;
    y: number;
    radius: number;
    hp: number;
  }>;
  threeStarScore: number;
  twoStarScore: number;
}
