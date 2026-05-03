import Phaser from 'phaser';
import { Block } from '../entities/Block';
import { Direction } from '../types/Game';
import { DRAG_THRESHOLD } from '../config/Constants';

export type DragAttempt = (block: Block, direction: Direction) => void;

export class InputManager {
  private dragStart: { x: number; y: number } | null = null;
  private dragBlock: Block | null = null;

  constructor(private scene: Phaser.Scene, private onDrag: DragAttempt) {}

  public attach(block: Block): void {
    block.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.dragStart = { x: pointer.x, y: pointer.y };
      this.dragBlock = block;
    });

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (!this.dragStart || !this.dragBlock) return;
      const dx = pointer.x - this.dragStart.x;
      const dy = pointer.y - this.dragStart.y;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);

      if (Math.max(adx, ady) >= DRAG_THRESHOLD) {
        let dir: Direction;
        if (adx > ady) dir = dx > 0 ? 'RIGHT' : 'LEFT';
        else dir = dy > 0 ? 'DOWN' : 'UP';
        this.onDrag(this.dragBlock, dir);
      }

      this.dragStart = null;
      this.dragBlock = null;
    });
  }
}
