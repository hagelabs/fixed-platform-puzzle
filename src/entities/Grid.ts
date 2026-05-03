import Phaser from 'phaser';
import { CELL_SIZE } from '../config/Constants';
import { Block } from './Block';

export class Grid {
  public readonly cols: number;
  public readonly rows: number;
  public readonly originX: number;
  public readonly originY: number;
  public readonly cellSize: number;

  private occupancy: (Block | null)[][];

  constructor(scene: Phaser.Scene, cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;

    const screenW = scene.scale.width;
    const screenH = scene.scale.height;
    const maxByW = (screenW - 60) / cols;
    const maxByH = (screenH - 120) / rows;
    this.cellSize = Math.min(CELL_SIZE, maxByW, maxByH);

    const boardW = this.cellSize * cols;
    const boardH = this.cellSize * rows;
    this.originX = (screenW - boardW) / 2;
    this.originY = 80 + ((screenH - 80 - boardH) / 2);

    this.occupancy = Array.from({ length: rows }, () => Array(cols).fill(null));
    this.drawBoard(scene);
  }

  private drawBoard(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    g.fillStyle(0x1a1f2e, 1);
    g.fillRoundedRect(
      this.originX - 8,
      this.originY - 8,
      this.cellSize * this.cols + 16,
      this.cellSize * this.rows + 16,
      10
    );
    g.lineStyle(1, 0x2d3548, 1);
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        g.strokeRect(
          this.originX + c * this.cellSize,
          this.originY + r * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      }
    }
  }

  public worldX(col: number): number {
    return this.originX + col * this.cellSize + this.cellSize / 2;
  }

  public worldY(row: number): number {
    return this.originY + row * this.cellSize + this.cellSize / 2;
  }

  public place(block: Block): void {
    const [x, y] = block.gridPos;
    const [w, h] = block.size;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        this.occupancy[y + dy][x + dx] = block;
      }
    }
  }

  public clear(block: Block): void {
    const [x, y] = block.gridPos;
    const [w, h] = block.size;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        this.occupancy[y + dy][x + dx] = null;
      }
    }
  }

  public getOccupant(col: number, row: number): Block | null {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return null;
    return this.occupancy[row][col];
  }

  public isEmpty(col: number, row: number): boolean {
    return this.getOccupant(col, row) === null;
  }
}
