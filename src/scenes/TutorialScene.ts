import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { Block } from '../entities/Block';
import { Grid } from '../entities/Grid';
import { MovementSystem } from '../systems/MovementSystem';
import { Direction } from '../types/Game';

interface TutorialData {
  blocks: Block[];
  grid: Grid;
}

interface Step {
  text: string;
  showArrow: boolean;
  waitFor: 'move' | 'tap';
}

const STEPS: Step[] = [
  {
    text: 'Welcome! Drag a block toward an edge to remove it.',
    showArrow: true,
    waitFor: 'move',
  },
  {
    text: 'Nice! Plan the order — wrong moves trap you.',
    showArrow: true,
    waitFor: 'move',
  },
  {
    text: 'Tap 💡 for a hint or ⏸ to pause anytime. Have fun!',
    showArrow: false,
    waitFor: 'tap',
  },
];

export class TutorialScene extends Phaser.Scene {
  private stepIndex = 0;
  private bubble!: Phaser.GameObjects.Container;
  private bubbleText!: Phaser.GameObjects.Text;
  private arrow: Phaser.GameObjects.Container | null = null;
  private blocks: Block[] = [];
  private grid!: Grid;
  private movement = new MovementSystem();
  private gameSceneRef!: Phaser.Scene;

  constructor() {
    super({ key: SCENE_KEYS.Tutorial });
  }

  create(data: TutorialData): void {
    this.blocks = data.blocks;
    this.grid = data.grid;
    this.gameSceneRef = this.scene.get(SCENE_KEYS.Game);
    this.stepIndex = 0;

    this.bubble = this.makeBubble();
    this.add.existing(this.bubble);

    const skip = this.add
      .text(this.scale.width - 14, 14, 'SKIP', {
        fontFamily: 'Arial',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ffcc44',
        backgroundColor: '#0008',
        padding: { x: 8, y: 4 },
      })
      .setOrigin(1, 0)
      .setDepth(100)
      .setInteractive({ useHandCursor: true });
    skip.on('pointerup', () => this.finish());

    this.gameSceneRef.events.on('tutorial:moved', this.onMove, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.gameSceneRef.events.off('tutorial:moved', this.onMove, this);
    });

    this.showStep();
  }

  private makeBubble(): Phaser.GameObjects.Container {
    const w = 600;
    const h = 60;
    const bg = this.add.rectangle(0, 0, w, h, 0x000000, 0.85).setStrokeStyle(2, 0xffcc44, 0.9);
    this.bubbleText = this.add
      .text(0, 0, '', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: w - 24 },
      })
      .setOrigin(0.5);
    const c = this.add.container(this.scale.width / 2, this.scale.height - 50, [bg, this.bubbleText]);
    c.setDepth(100);
    return c;
  }

  private showStep(): void {
    const step = STEPS[this.stepIndex];
    this.bubbleText.setText(step.text);
    this.tweens.add({
      targets: this.bubble,
      alpha: { from: 0, to: 1 },
      y: { from: this.scale.height - 30, to: this.scale.height - 50 },
      duration: 250,
    });

    this.clearArrow();
    if (step.showArrow) {
      this.drawArrowOnRemovable();
    }
    if (step.waitFor === 'tap') {
      this.bubble.setInteractive(
        new Phaser.Geom.Rectangle(-300, -30, 600, 60),
        Phaser.Geom.Rectangle.Contains
      );
      this.bubble.once('pointerup', () => this.finish());
    }
  }

  private drawArrowOnRemovable(): void {
    const dirs: Direction[] = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
    let target: Block | null = null;
    let targetDir: Direction = 'LEFT';
    for (const b of this.blocks) {
      if (b.removed) continue;
      for (const d of dirs) {
        if (this.movement.canExit(b, this.grid, d)) {
          target = b;
          targetDir = d;
          break;
        }
      }
      if (target) break;
    }
    if (!target) return;

    const arrowLen = 50;
    const dx = targetDir === 'RIGHT' ? arrowLen : targetDir === 'LEFT' ? -arrowLen : 0;
    const dy = targetDir === 'DOWN' ? arrowLen : targetDir === 'UP' ? -arrowLen : 0;

    const line = this.add.rectangle(target.x, target.y, Math.abs(dx) || 6, Math.abs(dy) || 6, 0xffcc44);
    if (dx !== 0) line.setOrigin(dx > 0 ? 0 : 1, 0.5);
    else line.setOrigin(0.5, dy > 0 ? 0 : 1);

    const head = this.add.triangle(
      target.x + dx,
      target.y + dy,
      0,
      -10,
      0,
      10,
      14,
      0,
      0xffcc44
    );
    if (targetDir === 'LEFT') head.setAngle(180);
    else if (targetDir === 'UP') head.setAngle(-90);
    else if (targetDir === 'DOWN') head.setAngle(90);

    this.arrow = this.add.container(0, 0, [line, head]).setDepth(99);

    this.tweens.add({
      targets: this.arrow,
      alpha: { from: 0.4, to: 1 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  private clearArrow(): void {
    if (this.arrow) {
      this.arrow.destroy();
      this.arrow = null;
    }
  }

  private onMove(): void {
    if (STEPS[this.stepIndex].waitFor !== 'move') return;
    this.stepIndex++;
    this.clearArrow();
    if (this.stepIndex >= STEPS.length) {
      this.finish();
      return;
    }
    this.tweens.add({
      targets: this.bubble,
      alpha: 0,
      duration: 200,
      onComplete: () => this.showStep(),
    });
  }

  private finish(): void {
    useGameStore.getState().setTutorialDone(true);
    this.clearArrow();
    this.tweens.add({
      targets: this.bubble,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.scene.stop();
      },
    });
  }
}
