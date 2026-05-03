export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type ExitSide = 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT';
export type BlockType = 'simple' | 'obstacle';

export interface BlockData {
  id: string;
  color: Color;
  position: [number, number];
  size: [number, number];
  type?: BlockType;
  allowedExits?: ExitSide[];
}

export interface ExitZone {
  side: ExitSide;
  index: number;
}

export interface LevelData {
  id: number;
  cols: number;
  rows: number;
  blocks: BlockData[];
  exits: ExitZone[];
  optimalMoves: number;
}

export interface MoveHistoryEntry {
  blockId: string;
  prevPos: [number, number];
  removed: boolean;
}
