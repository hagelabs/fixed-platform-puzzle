import Phaser from 'phaser';
import { Block } from '../entities/Block';
import { Direction } from '../types/Game';
import { DRAG_THRESHOLD } from '../config/Constants';

export type DragAttempt = (block: Block, direction: Direction) => void;

export class InputManager {
  private dragStart: { x: number; y: number } | null = null;
  private dragBlock: Block | null = null;
  private blocks: Block[] = [];

  constructor(private scene: Phaser.Scene, private onDrag: DragAttempt) {
    scene.input.on('pointerdown', this.onPointerDown, this);
    scene.input.on('pointerup', this.onPointerUp, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.input.off('pointerdown', this.onPointerDown, this);
      scene.input.off('pointerup', this.onPointerUp, this);
    });
  }

  public setBlocks(blocks: Block[]): void {
    this.blocks = blocks;
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    for (const b of this.blocks) {
      if (b.removed || b.type !== 'simple') continue;
      if (b.containsPointer(pointer.worldX, pointer.worldY)) {
        this.dragStart = { x: pointer.x, y: pointer.y };
        this.dragBlock = b;
        return;
      }
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
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
  }
}
