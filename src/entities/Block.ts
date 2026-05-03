import Phaser from 'phaser';
import { BlockData, Color } from '../types/Game';
import { COLORS } from '../config/Constants';
import { Grid } from './Grid';

export class Block extends Phaser.GameObjects.Container {
  public readonly blockId: string;
  public readonly color: Color;
  public gridPos: [number, number];
  public readonly size: [number, number];
  public removed = false;

  private rect: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, data: BlockData, grid: Grid) {
    const [c, r] = data.position;
    const [w, h] = data.size;
    const px = grid.worldX(c) + ((w - 1) * grid.cellSize) / 2;
    const py = grid.worldY(r) + ((h - 1) * grid.cellSize) / 2;
    super(scene, px, py);

    this.blockId = data.id;
    this.color = data.color;
    this.gridPos = [c, r];
    this.size = [w, h];

    const pxW = w * grid.cellSize - 8;
    const pxH = h * grid.cellSize - 8;
    this.rect = scene.add.rectangle(0, 0, pxW, pxH, COLORS[data.color]);
    this.rect.setStrokeStyle(3, 0xffffff, 0.35);
    this.add(this.rect);

    this.setSize(pxW, pxH);
    this.setInteractive({ useHandCursor: true });
    scene.add.existing(this);
  }

  public moveToCell(grid: Grid, col: number, row: number): void {
    this.gridPos = [col, row];
    const [w, h] = this.size;
    this.x = grid.worldX(col) + ((w - 1) * grid.cellSize) / 2;
    this.y = grid.worldY(row) + ((h - 1) * grid.cellSize) / 2;
  }

  public flyOff(direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT', onDone: () => void): void {
    this.disableInteractive();
    const dist = 400;
    const dx = direction === 'LEFT' ? -dist : direction === 'RIGHT' ? dist : 0;
    const dy = direction === 'UP' ? -dist : direction === 'DOWN' ? dist : 0;
    this.scene.tweens.add({
      targets: this,
      x: this.x + dx,
      y: this.y + dy,
      alpha: 0,
      duration: 280,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.removed = true;
        onDone();
        this.destroy();
      },
    });
  }
}
