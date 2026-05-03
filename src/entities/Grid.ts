import Phaser from 'phaser';
import { CELL_SIZE } from '../config/Constants';
import { Block } from './Block';
import { ExitZone } from '../types/Game';

export class Grid {
  public readonly cols: number;
  public readonly rows: number;
  public readonly originX: number;
  public readonly originY: number;
  public readonly cellSize: number;

  private occupancy: (Block | null)[][];
  private exits: ExitZone[] = [];

  constructor(scene: Phaser.Scene, cols: number, rows: number, exits: ExitZone[] = []) {
    this.cols = cols;
    this.rows = rows;
    this.exits = exits;

    const screenW = scene.scale.width;
    const screenH = scene.scale.height;
    const maxByW = (screenW - 60) / cols;
    const maxByH = (screenH - 120) / rows;
    this.cellSize = Math.min(CELL_SIZE, maxByW, maxByH);

    const boardW = this.cellSize * cols;
    const boardH = this.cellSize * rows;
    this.originX = (screenW - boardW) / 2;
    this.originY = 80 + (screenH - 80 - boardH) / 2;

    this.occupancy = Array.from({ length: rows }, () => Array(cols).fill(null));
    this.drawBoard(scene);
    this.drawExits(scene);
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

  private drawExits(scene: Phaser.Scene): void {
    const thickness = 4;
    const g = scene.add.graphics();
    g.fillStyle(0xffcc44, 0.6);

    for (const e of this.exits) {
      if (e.side === 'TOP') {
        g.fillRect(
          this.originX + e.index * this.cellSize + 4,
          this.originY - thickness,
          this.cellSize - 8,
          thickness
        );
      } else if (e.side === 'BOTTOM') {
        g.fillRect(
          this.originX + e.index * this.cellSize + 4,
          this.originY + this.rows * this.cellSize,
          this.cellSize - 8,
          thickness
        );
      } else if (e.side === 'LEFT') {
        g.fillRect(
          this.originX - thickness,
          this.originY + e.index * this.cellSize + 4,
          thickness,
          this.cellSize - 8
        );
      } else {
        g.fillRect(
          this.originX + this.cols * this.cellSize,
          this.originY + e.index * this.cellSize + 4,
          thickness,
          this.cellSize - 8
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

  public hasExit(side: 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT', index: number): boolean {
    return this.exits.some((e) => e.side === side && e.index === index);
  }
}
