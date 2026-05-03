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

export type MoveResult =
  | { kind: 'exit'; side: ExitSide }
  | { kind: 'slide'; nextCol: number; nextRow: number }
  | { kind: 'invalid'; reason: 'blocked' | 'no_exit' | 'exit_disallowed' };

export class MovementSystem {
  public attempt(block: Block, grid: Grid, dir: Direction): MoveResult {
    const [x, y] = block.gridPos;
    const [w, h] = block.size;
    const [dx, dy] = DELTA[dir];
    const nx = x + dx;
    const ny = y + dy;

    // Check exit: block at edge, direction goes off-grid
    const wantsToExit =
      (dir === 'LEFT' && x === 0) ||
      (dir === 'UP' && y === 0) ||
      (dir === 'RIGHT' && x + w - 1 === grid.cols - 1) ||
      (dir === 'DOWN' && y + h - 1 === grid.rows - 1);

    if (wantsToExit) {
      const side = DIR_TO_SIDE[dir];
      if (!block.allowedExits.includes(side)) {
        return { kind: 'invalid', reason: 'exit_disallowed' };
      }
      const exitIdx = side === 'LEFT' || side === 'RIGHT' ? y : x;
      const span = side === 'LEFT' || side === 'RIGHT' ? h : w;
      for (let s = 0; s < span; s++) {
        if (!grid.hasExit(side, exitIdx + s)) {
          return { kind: 'invalid', reason: 'no_exit' };
        }
      }
      return { kind: 'exit', side };
    }

    // Try slide 1 cell
    if (this.canSlide(block, grid, dir)) {
      return { kind: 'slide', nextCol: nx, nextRow: ny };
    }
    return { kind: 'invalid', reason: 'blocked' };
  }

  private canSlide(block: Block, grid: Grid, dir: Direction): boolean {
    const [x, y] = block.gridPos;
    const [w, h] = block.size;
    const [dx, dy] = DELTA[dir];

    // Cells the block will newly occupy
    if (dir === 'LEFT' || dir === 'RIGHT') {
      const checkX = dir === 'LEFT' ? x - 1 : x + w;
      if (checkX < 0 || checkX >= grid.cols) return false;
      for (let row = y; row < y + h; row++) {
        const occ = grid.getOccupant(checkX, row);
        if (occ && occ !== block) return false;
      }
      return true;
    }
    const checkY = dir === 'UP' ? y - 1 : y + h;
    if (checkY < 0 || checkY >= grid.rows) return false;
    for (let col = x; col < x + w; col++) {
      const occ = grid.getOccupant(col, checkY);
      if (occ && occ !== block) return false;
    }
    return true;
  }

  public anyValidMove(blocks: Block[], grid: Grid): boolean {
    const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    for (const b of blocks) {
      if (b.removed || b.type !== 'simple') continue;
      for (const d of dirs) {
        const r = this.attempt(b, grid, d);
        if (r.kind !== 'invalid') return true;
      }
    }
    return false;
  }

  public findAnyExit(blocks: Block[], grid: Grid): { block: Block; dir: Direction } | null {
    const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    for (const b of blocks) {
      if (b.removed || b.type !== 'simple') continue;
      for (const d of dirs) {
        const r = this.attempt(b, grid, d);
        if (r.kind === 'exit') return { block: b, dir: d };
      }
    }
    return null;
  }
}
