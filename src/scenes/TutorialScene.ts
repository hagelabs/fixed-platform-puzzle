import Phaser from 'phaser';
import { SCENE_KEYS, FONT_HEADER } from '../config/Constants';
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
  { text: 'Drag a block toward an edge to slide or remove it.', showArrow: true, waitFor: 'move' },
  { text: 'Yellow notches on edges = exit zones. Reach them to remove blocks.', showArrow: true, waitFor: 'move' },
  { text: 'Tap ↶ to undo, 💡 for a hint, ⏸ to pause. Have fun!', showArrow: false, waitFor: 'tap' },
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
        fontFamily: FONT_HEADER,
        fontSize: '12px',
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
    const h = 56;
    const bg = this.add.rectangle(0, 0, w, h, 0x000000, 0.85).setStrokeStyle(2, 0xffcc44, 0.9);
    this.bubbleText = this.add
      .text(0, 0, '', {
        fontFamily: 'Arial',
        fontSize: '14px',
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
        new Phaser.Geom.Rectangle(-300, -28, 600, 56),
        Phaser.Geom.Rectangle.Contains
      );
      this.bubble.once('pointerup', () => this.finish());
    }
  }

  private drawArrowOnRemovable(): void {
    const dirs: Direction[] = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
    let target: Block | null = null;
    let targetDir: Direction = 'LEFT';
    // Prefer exit move first
    for (const b of this.blocks) {
      if (b.removed || b.type !== 'simple') continue;
      for (const d of dirs) {
        const r = this.movement.attempt(b, this.grid, d);
        if (r.kind === 'exit') {
          target = b;
          targetDir = d;
          break;
        }
      }
      if (target) break;
    }
    // Fallback to slide
    if (!target) {
      for (const b of this.blocks) {
        if (b.removed || b.type !== 'simple') continue;
        for (const d of dirs) {
          const r = this.movement.attempt(b, this.grid, d);
          if (r.kind === 'slide') {
            target = b;
            targetDir = d;
            break;
          }
        }
        if (target) break;
      }
    }
    if (!target) return;

    const arrowLen = 50;
    const headLen = 14;
    const dx = targetDir === 'RIGHT' ? arrowLen : targetDir === 'LEFT' ? -arrowLen : 0;
    const dy = targetDir === 'DOWN' ? arrowLen : targetDir === 'UP' ? -arrowLen : 0;

    const sx = target.x;
    const sy = target.y;
    const ex = sx + dx;
    const ey = sy + dy;

    const g = this.add.graphics();
    g.lineStyle(4, 0xffcc44, 1);
    g.beginPath();
    g.moveTo(sx, sy);
    g.lineTo(ex, ey);
    g.strokePath();

    g.fillStyle(0xffcc44, 1);
    let p1x = 0, p1y = 0, p2x = 0, p2y = 0, p3x = 0, p3y = 0;
    if (targetDir === 'RIGHT') {
      p1x = ex; p1y = ey - 8; p2x = ex; p2y = ey + 8; p3x = ex + headLen; p3y = ey;
    } else if (targetDir === 'LEFT') {
      p1x = ex; p1y = ey - 8; p2x = ex; p2y = ey + 8; p3x = ex - headLen; p3y = ey;
    } else if (targetDir === 'UP') {
      p1x = ex - 8; p1y = ey; p2x = ex + 8; p2y = ey; p3x = ex; p3y = ey - headLen;
    } else {
      p1x = ex - 8; p1y = ey; p2x = ex + 8; p2y = ey; p3x = ex; p3y = ey + headLen;
    }
    g.fillTriangle(p1x, p1y, p2x, p2y, p3x, p3y);

    this.arrow = this.add.container(0, 0, [g]).setDepth(99);

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
