import { Direction } from '../types/Game';
import { Block } from '../entities/Block';
import { Grid } from '../entities/Grid';

export class MovementSystem {
  public canExit(block: Block, grid: Grid, dir: Direction): boolean {
    const [x, y] = block.gridPos;
    const [w, h] = block.size;

    if (dir === 'LEFT') {
      for (let row = y; row < y + h; row++) {
        for (let col = x - 1; col >= 0; col--) {
          if (!grid.isEmpty(col, row)) return false;
        }
      }
      return true;
    }
    if (dir === 'RIGHT') {
      for (let row = y; row < y + h; row++) {
        for (let col = x + w; col < grid.cols; col++) {
          if (!grid.isEmpty(col, row)) return false;
        }
      }
      return true;
    }
    if (dir === 'UP') {
      for (let col = x; col < x + w; col++) {
        for (let row = y - 1; row >= 0; row--) {
          if (!grid.isEmpty(col, row)) return false;
        }
      }
      return true;
    }
    for (let col = x; col < x + w; col++) {
      for (let row = y + h; row < grid.rows; row++) {
        if (!grid.isEmpty(col, row)) return false;
      }
    }
    return true;
  }

  public anyExitAvailable(blocks: Block[], grid: Grid): boolean {
    const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    return blocks.some((b) => !b.removed && dirs.some((d) => this.canExit(b, grid, d)));
  }
}
