import Phaser from 'phaser';
import { BlockData, Color, BlockType, ExitSide } from '../types/Game';
import { COLORS } from '../config/Constants';
import { Grid } from './Grid';

export class Block extends Phaser.GameObjects.Container {
  public readonly blockId: string;
  public readonly color: Color;
  public gridPos: [number, number];
  public readonly size: [number, number];
  public readonly type: BlockType;
  public readonly allowedExits: ExitSide[];
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
    this.type = data.type ?? 'simple';
    this.allowedExits = data.allowedExits ?? ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'];

    const pxW = w * grid.cellSize - 6;
    const pxH = h * grid.cellSize - 6;

    if (this.type === 'obstacle') {
      this.rect = scene.add.rectangle(0, 0, pxW, pxH, 0x404858);
      this.rect.setStrokeStyle(2, 0x6b7280, 0.6);
      const cross = scene.add.graphics();
      cross.lineStyle(3, 0x6b7280, 0.9);
      const m = Math.min(pxW, pxH) / 2 - 8;
      cross.beginPath();
      cross.moveTo(-m, -m);
      cross.lineTo(m, m);
      cross.moveTo(-m, m);
      cross.lineTo(m, -m);
      cross.strokePath();
      this.add([this.rect, cross]);
    } else {
      this.rect = scene.add.rectangle(0, 0, pxW, pxH, COLORS[data.color]);
      this.rect.setStrokeStyle(2, 0xffffff, 0.4);
      this.add(this.rect);

      if (data.allowedExits && data.allowedExits.length < 4) {
        for (const side of data.allowedExits) {
          this.add(this.makeExitMarker(side, pxW, pxH));
        }
      }
    }

    this.setSize(pxW, pxH);
    if (this.type === 'simple') this.setInteractive({ useHandCursor: true });
    scene.add.existing(this);
  }

  private makeExitMarker(side: ExitSide, w: number, h: number): Phaser.GameObjects.Graphics {
    const g = this.scene.add.graphics();
    g.fillStyle(0xffffff, 0.85);

    const inset = 10;
    const half = 6;
    const len = 12;
    const baseOff = len / 3;
    const tipOff = (2 * len) / 3;

    let cx = 0;
    let cy = 0;
    if (side === 'TOP') {
      cx = 0;
      cy = -h / 2 + inset;
      g.fillTriangle(cx - half, cy + baseOff, cx + half, cy + baseOff, cx, cy - tipOff);
    } else if (side === 'BOTTOM') {
      cx = 0;
      cy = h / 2 - inset;
      g.fillTriangle(cx - half, cy - baseOff, cx + half, cy - baseOff, cx, cy + tipOff);
    } else if (side === 'LEFT') {
      cx = -w / 2 + inset;
      cy = 0;
      g.fillTriangle(cx + baseOff, cy - half, cx + baseOff, cy + half, cx - tipOff, cy);
    } else {
      cx = w / 2 - inset;
      cy = 0;
      g.fillTriangle(cx - baseOff, cy - half, cx - baseOff, cy + half, cx + tipOff, cy);
    }
    return g;
  }

  public moveToCell(grid: Grid, col: number, row: number, animate = true): void {
    this.gridPos = [col, row];
    const [w, h] = this.size;
    const tx = grid.worldX(col) + ((w - 1) * grid.cellSize) / 2;
    const ty = grid.worldY(row) + ((h - 1) * grid.cellSize) / 2;
    if (animate) {
      this.scene.tweens.add({
        targets: this,
        x: tx,
        y: ty,
        duration: 140,
        ease: 'Cubic.easeOut',
      });
    } else {
      this.x = tx;
      this.y = ty;
    }
  }

  public flyOff(direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT', onDone: () => void): void {
    this.disableInteractive();
    const dist = 320;
    const dx = direction === 'LEFT' ? -dist : direction === 'RIGHT' ? dist : 0;
    const dy = direction === 'UP' ? -dist : direction === 'DOWN' ? dist : 0;
    this.scene.tweens.add({
      targets: this,
      x: this.x + dx,
      y: this.y + dy,
      alpha: 0,
      duration: 240,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.removed = true;
        onDone();
        this.destroy();
      },
    });
  }

  public pulseRed(): void {
    this.scene.tweens.add({
      targets: this.rect,
      alpha: { from: 0.4, to: 1 },
      duration: 250,
      yoyo: true,
      repeat: 2,
    });
  }
}
