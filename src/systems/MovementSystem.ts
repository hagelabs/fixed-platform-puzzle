import { Direction, ExitSide } from '../types/Game';
import { Block } from '../entities/Block';
import { Grid } from '../entities/Grid';

const DIR_TO_SIDE: Record<Direction, ExitSide> = {
  UP: 'TOP',
  DOWN: 'BOTTOM',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const DELTA: Record<Direction, [number, number]> = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

export type SlideResult =
  | { kind: 'exit'; side: ExitSide; toCol: number; toRow: number; distance: number }
  | { kind: 'slide'; toCol: number; toRow: number; distance: number }
  | { kind: 'invalid'; reason: 'blocked' | 'wrong_dir' | 'locked' | 'no_exit' };

export class MovementSystem {
  public slide(block: Block, grid: Grid, dir: Direction, allBlocks: Block[]): SlideResult {
    if (block.removed) return { kind: 'invalid', reason: 'blocked' };
    if (block.type === 'obstacle') return { kind: 'invalid', reason: 'blocked' };
    if (block.type === 'dependent' && !this.depsCleared(block, allBlocks)) {
      return { kind: 'invalid', reason: 'locked' };
    }
    if (block.type === 'constrained' && !this.constraintsOK(block, dir)) {
      return { kind: 'invalid', reason: 'wrong_dir' };
    }

    const [dx, dy] = DELTA[dir];
    let curCol = block.gridPos[0];
    let curRow = block.gridPos[1];
    const startCol = curCol;
    const startRow = curRow;

    while (true) {
      const nextCol = curCol + dx;
      const nextRow = curRow + dy;

      if (this.outOfGrid(nextCol, nextRow, grid)) {
        const side = DIR_TO_SIDE[dir];
        const exitIdx = side === 'LEFT' || side === 'RIGHT' ? curRow : curCol;
        const distance = Math.abs(curCol - startCol) + Math.abs(curRow - startRow);
        if (grid.hasExit(side, exitIdx)) {
          return { kind: 'exit', side, toCol: curCol, toRow: curRow, distance };
        }
        if (distance === 0) return { kind: 'invalid', reason: 'blocked' };
        return { kind: 'slide', toCol: curCol, toRow: curRow, distance };
      }

      const occ = grid.getOccupant(nextCol, nextRow);
      if (occ && occ !== block) {
        const distance = Math.abs(curCol - startCol) + Math.abs(curRow - startRow);
        if (distance === 0) return { kind: 'invalid', reason: 'blocked' };
        return { kind: 'slide', toCol: curCol, toRow: curRow, distance };
      }

      curCol = nextCol;
      curRow = nextRow;
    }
  }

  public constraintsOK(block: Block, dir: Direction): boolean {
    if (block.type !== 'constrained') return true;
    return block.direction === dir;
  }

  public depsCleared(block: Block, allBlocks: Block[]): boolean {
    if (block.type !== 'dependent' || !block.dependsOn) return true;
    const dep = allBlocks.find((b) => b.blockId === block.dependsOn);
    if (!dep) return true;
    return dep.removed;
  }

  public anyValidMove(blocks: Block[], grid: Grid): boolean {
    const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    for (const b of blocks) {
      if (b.removed || b.type === 'obstacle') continue;
      for (const d of dirs) {
        const r = this.slide(b, grid, d, blocks);
        if (r.kind === 'exit') return true;
        if (r.kind === 'slide' && r.distance > 0) return true;
      }
    }
    return false;
  }

  public findAnyExit(blocks: Block[], grid: Grid): { block: Block; dir: Direction } | null {
    const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    for (const b of blocks) {
      if (b.removed || b.type === 'obstacle') continue;
      for (const d of dirs) {
        const r = this.slide(b, grid, d, blocks);
        if (r.kind === 'exit') return { block: b, dir: d };
      }
    }
    return null;
  }

  private outOfGrid(col: number, row: number, grid: Grid): boolean {
    return col < 0 || col >= grid.cols || row < 0 || row >= grid.rows;
  }
}
