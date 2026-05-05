import Phaser from 'phaser';
import { CELL_SIZE, HUD_HEIGHT } from '../config/Constants';
import { Block } from './Block';
import { ExitZone } from '../types/Game';
import { TOKENS } from '../ui/Theme';

export class Grid {
  public readonly cols: number;
  public readonly rows: number;
  public readonly originX: number;
  public readonly originY: number;
  public readonly cellSize: number;

  private occupancy: (Block | null)[][];
  private exits: ExitZone[] = [];
  private createdObjects: Phaser.GameObjects.GameObject[] = [];
  private timers: Phaser.Time.TimerEvent[] = [];

  constructor(scene: Phaser.Scene, cols: number, rows: number, exits: ExitZone[] = []) {
    this.cols = cols;
    this.rows = rows;
    this.exits = exits;

    const screenW = scene.scale.width;
    const screenH = scene.scale.height;
    const maxByW = (screenW - 80) / cols;
    const maxByH = (screenH - HUD_HEIGHT - 120) / rows;
    this.cellSize = Math.min(CELL_SIZE, maxByW, maxByH);

    const boardW = this.cellSize * cols;
    const boardH = this.cellSize * rows;
    this.originX = (screenW - boardW) / 2;
    this.originY = HUD_HEIGHT + 30 + (screenH - HUD_HEIGHT - 30 - 60 - boardH) / 2;

    this.occupancy = Array.from({ length: rows }, () => Array(cols).fill(null));
    this.drawBoard(scene);
    this.drawExits(scene);
  }

  private drawBoard(scene: Phaser.Scene): void {
    const w = this.cellSize * this.cols;
    const h = this.cellSize * this.rows;
    const pad = 12;
    const bx = this.originX - pad;
    const by = this.originY - pad;
    const bw = w + pad * 2;
    const bh = h + pad * 2;
    const cornerR = 14;
    const shadowOffset = 3;
    const borderPx = 3;

    const g = scene.add.graphics();
    this.createdObjects.push(g);
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(bx + shadowOffset, by + shadowOffset, bw, bh, cornerR);
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(bx, by, bw, bh, cornerR);
    g.fillStyle(TOKENS.white, 1);
    g.fillRoundedRect(bx + borderPx, by + borderPx, bw - borderPx * 2, bh - borderPx * 2, cornerR - 2);

    const dots = scene.add.graphics();
    this.createdObjects.push(dots);
    dots.fillStyle(TOKENS.ink, 0.14);
    const dotStep = Math.max(16, this.cellSize / 4);
    for (let dy = this.originY + dotStep / 2; dy < this.originY + h; dy += dotStep) {
      for (let dx = this.originX + dotStep / 2; dx < this.originX + w; dx += dotStep) {
        dots.fillCircle(dx, dy, 1);
      }
    }
  }

  private drawExits(scene: Phaser.Scene): void {
    const thickness = 10;
    const inset = 6;
    for (const e of this.exits) {
      const exitCenter = this.exitCenter(e);
      const isHoriz = e.side === 'LEFT' || e.side === 'RIGHT';
      const len = this.cellSize - inset * 2;

      const portal = scene.add.graphics();
      this.createdObjects.push(portal);
      portal.fillStyle(TOKENS.ink, 1);
      if (e.side === 'TOP') {
        portal.fillRoundedRect(
          exitCenter.x - len / 2,
          this.originY - thickness - 2,
          len,
          thickness,
          4,
        );
        portal.fillStyle(TOKENS.exitGlow, 1);
        portal.fillRoundedRect(
          exitCenter.x - len / 2 + 2,
          this.originY - thickness,
          len - 4,
          thickness - 4,
          3,
        );
      } else if (e.side === 'BOTTOM') {
        portal.fillRoundedRect(
          exitCenter.x - len / 2,
          this.originY + this.rows * this.cellSize + 2,
          len,
          thickness,
          4,
        );
        portal.fillStyle(TOKENS.exitGlow, 1);
        portal.fillRoundedRect(
          exitCenter.x - len / 2 + 2,
          this.originY + this.rows * this.cellSize + 4,
          len - 4,
          thickness - 4,
          3,
        );
      } else if (e.side === 'LEFT') {
        portal.fillRoundedRect(
          this.originX - thickness - 2,
          exitCenter.y - len / 2,
          thickness,
          len,
          4,
        );
        portal.fillStyle(TOKENS.exitGlow, 1);
        portal.fillRoundedRect(
          this.originX - thickness,
          exitCenter.y - len / 2 + 2,
          thickness - 4,
          len - 4,
          3,
        );
      } else {
        portal.fillRoundedRect(
          this.originX + this.cols * this.cellSize + 2,
          exitCenter.y - len / 2,
          thickness,
          len,
          4,
        );
        portal.fillStyle(TOKENS.exitGlow, 1);
        portal.fillRoundedRect(
          this.originX + this.cols * this.cellSize + 4,
          exitCenter.y - len / 2 + 2,
          thickness - 4,
          len - 4,
          3,
        );
      }

      scene.tweens.add({
        targets: portal,
        alpha: { from: 1, to: 0.6 },
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.spawnExitParticles(scene, e, exitCenter, isHoriz);
    }
  }

  private exitCenter(e: ExitZone): { x: number; y: number } {
    if (e.side === 'TOP') {
      return {
        x: this.originX + e.index * this.cellSize + this.cellSize / 2,
        y: this.originY - 6,
      };
    }
    if (e.side === 'BOTTOM') {
      return {
        x: this.originX + e.index * this.cellSize + this.cellSize / 2,
        y: this.originY + this.rows * this.cellSize + 6,
      };
    }
    if (e.side === 'LEFT') {
      return {
        x: this.originX - 6,
        y: this.originY + e.index * this.cellSize + this.cellSize / 2,
      };
    }
    return {
      x: this.originX + this.cols * this.cellSize + 6,
      y: this.originY + e.index * this.cellSize + this.cellSize / 2,
    };
  }

  private spawnExitParticles(
    scene: Phaser.Scene,
    e: ExitZone,
    center: { x: number; y: number },
    isHoriz: boolean,
  ): void {
    const outward: { dx: number; dy: number } =
      e.side === 'TOP'
        ? { dx: 0, dy: -1 }
        : e.side === 'BOTTOM'
        ? { dx: 0, dy: 1 }
        : e.side === 'LEFT'
        ? { dx: -1, dy: 0 }
        : { dx: 1, dy: 0 };

    const emit = () => {
      for (let i = 0; i < 2; i++) {
        const jitter = (Math.random() - 0.5) * (this.cellSize * 0.6);
        const sx = center.x + (isHoriz ? 0 : jitter);
        const sy = center.y + (isHoriz ? jitter : 0);
        const size = 3 + Math.random() * 3;
        const color = Math.random() < 0.5 ? TOKENS.exitGlow : TOKENS.exitGlowAccent;
        const p = scene.add.rectangle(sx, sy, size, size, color);
        p.setStrokeStyle(1.2, TOKENS.ink, 1);
        const dist = 10 + Math.random() * 18;
        scene.tweens.add({
          targets: p,
          x: sx + outward.dx * dist,
          y: sy + outward.dy * dist,
          alpha: { from: 1, to: 0 },
          scale: { from: 1, to: 0.4 },
          duration: 600 + Math.random() * 300,
          ease: 'Cubic.easeOut',
          onComplete: () => p.destroy(),
        });
      }
    };

    const timer = scene.time.addEvent({
      delay: 380,
      loop: true,
      callback: emit,
    });
    this.timers.push(timer);
    emit();
  }

  public destroy(): void {
    this.timers.forEach((t) => t.remove(false));
    this.timers = [];
    this.createdObjects.forEach((o) => o.destroy());
    this.createdObjects = [];
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
