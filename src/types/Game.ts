export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface BlockData {
  id: string;
  color: Color;
  position: [number, number];
  size: [number, number];
}

export interface LevelData {
  id: number;
  cols: number;
  rows: number;
  blocks: BlockData[];
}
