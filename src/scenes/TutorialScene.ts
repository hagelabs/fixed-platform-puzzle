import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { Block } from '../entities/Block';
import { Grid } from '../entities/Grid';
import { MovementSystem } from '../systems/MovementSystem';
import { BlockData, Direction, ExitZone } from '../types/Game';
import { InputManager } from '../managers/InputManager';
import { AudioManager } from '../managers/AudioManager';
import { COLORS } from '../config/Constants';
import {
  TOKENS,
  FONT_NEO,
  neoButton,
  neoPill,
  dottedBackground,
} from '../ui/Theme';
import {
  fadeIn,
  fadeOutAndStart,
  dustPuff,
  removalBloom,
  burstParticles,
  screenshake,
} from '../utils/Effects';

interface TutorialStep {
  cols: number;
  rows: number;
  blocks: BlockData[];
  exits: ExitZone[];
  title: string;
  message: string;
  highlightId: string;
  hintDir?: Direction;
}

const STEPS: TutorialStep[] = [
  {
    cols: 5,
    rows: 3,
    blocks: [{ id: 'r', color: 'red', position: [0, 1], size: [1, 1], type: 'simple' }],
    exits: [{ side: 'RIGHT', index: 1 }],
    title: 'STEP 1 — SLIDE',
    message: 'SWIPE THE RED BLOCK TOWARD THE EXIT.',
    highlightId: 'r',
    hintDir: 'RIGHT',
  },
  {
    cols: 5,
    rows: 3,
    blocks: [
      { id: 'r1', color: 'red', position: [0, 1], size: [1, 1], type: 'simple' },
      { id: 'r2', color: 'red', position: [4, 1], size: [1, 1], type: 'simple' },
    ],
    exits: [{ side: 'LEFT', index: 1 }],
    title: 'STEP 2 — ORDER',
    message: 'BLOCKS STOP WHEN THEY HIT EACH OTHER. CLEAR THE LEFT BLOCK FIRST.',
    highlightId: 'r1',
    hintDir: 'LEFT',
  },
  {
    cols: 5,
    rows: 3,
    blocks: [
      { id: 'y', color: 'yellow', position: [2, 1], size: [1, 1], type: 'constrained', direction: 'RIGHT' },
    ],
    exits: [{ side: 'RIGHT', index: 1 }, { side: 'LEFT', index: 1 }],
    title: 'STEP 3 — CONSTRAINED',
    message: 'YELLOW BLOCKS ONLY EXIT IN THE ARROW DIRECTION. SWIPE THAT WAY.',
    highlightId: 'y',
    hintDir: 'RIGHT',
  },
  {
    cols: 5,
    rows: 3,
    blocks: [
      { id: 'r', color: 'red', position: [0, 1], size: [1, 1], type: 'simple' },
      { id: 'b', color: 'blue', position: [4, 1], size: [1, 1], type: 'dependent', dependsOn: 'r' },
    ],
    exits: [{ side: 'LEFT', index: 1 }, { side: 'RIGHT', index: 1 }],
    title: 'STEP 4 — DEPENDENCY',
    message: 'BLUE UNLOCKS AFTER ITS PARTNER LEAVES. SLIDE RED OUT FIRST.',
    highlightId: 'r',
    hintDir: 'LEFT',
  },
];

export class TutorialScene extends Phaser.Scene {
  private stepIndex = 0;
  private grid?: Grid;
  private blocks: Block[] = [];
  private input2?: InputManager;
  private movement = new MovementSystem();

  private bubble?: Phaser.GameObjects.Container;
  private bubbleTitle?: Phaser.GameObjects.Text;
  private bubbleText?: Phaser.GameObjects.Text;
  private highlight?: Phaser.GameObjects.Graphics;
  private ghostArrow?: Phaser.GameObjects.Container;
  private stepIndicator?: Phaser.GameObjects.Text;
  private busy = false;
  private boardLayer?: Phaser.GameObjects.Container;

  constructor() {
    super({ key: SCENE_KEYS.Tutorial });
  }

  create(): void {
    fadeIn(this);
    dottedBackground(this);
    this.stepIndex = 0;

    this.bubble = this.makeBubble();
    this.stepIndicator = this.add
      .text(this.scale.width / 2, 64, '', {
        fontFamily: FONT_NEO,
        fontSize: '26px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5)
      .setAlpha(0.6);

    neoPill(this, 120, 100, '<', () => this.exit(false), {
      w: 140,
      h: 100,
      fill: TOKENS.white,
      textSize: 46,
    });

    neoButton(
      this,
      this.scale.width - 140,
      100,
      180,
      72,
      'SKIP',
      TOKENS.danger,
      () => this.exit(true),
      { textSize: 32 },
    );

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.teardownStep();
    });

    this.loadStep();
  }

  private makeBubble(): Phaser.GameObjects.Container {
    const w = 1152;
    const h = 158;
    const g = this.add.graphics();
    const cornerR = TOKENS.cornerR;
    const shadow = TOKENS.shadowOffset;
    const border = TOKENS.borderPx;
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(-w / 2 + shadow, -h / 2 + shadow, w, h, cornerR);
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, cornerR);
    g.fillStyle(TOKENS.white, 1);
    g.fillRoundedRect(-w / 2 + border, -h / 2 + border, w - border * 2, h - border * 2, cornerR - 2);

    this.bubbleTitle = this.add
      .text(0, -22, '', {
        fontFamily: FONT_NEO,
        fontSize: '28px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5);

    this.bubbleText = this.add
      .text(0, 10, '', {
        fontFamily: FONT_NEO,
        fontSize: '24px',
        color: TOKENS.inkHex,
        align: 'center',
        wordWrap: { width: w - 64 },
      })
      .setOrigin(0.5)
      .setAlpha(0.85);

    const c = this.add.container(this.scale.width / 2, this.scale.height - 162, [
      g,
      this.bubbleTitle,
      this.bubbleText,
    ]);
    c.setDepth(100);
    return c;
  }

  private loadStep(): void {
    this.teardownStep();
    const step = STEPS[this.stepIndex];
    this.stepIndicator?.setText(`${this.stepIndex + 1} / ${STEPS.length}`);

    if (this.bubbleTitle) this.bubbleTitle.setText(step.title);
    if (this.bubbleText) this.bubbleText.setText(step.message);

    this.boardLayer = this.add.container(0, 0);
    this.grid = new Grid(this, step.cols, step.rows, step.exits);

    this.blocks = [];
    step.blocks.forEach((bd) => {
      const block = new Block(this, bd, this.grid!);
      this.grid!.place(block);
      this.blocks.push(block);
    });

    this.input2 = new InputManager(this, (block, dir) => this.handleSwipe(block, dir));
    this.input2.setBlocks(this.blocks);

    this.drawHighlight(step.highlightId);
    if (step.hintDir) this.drawGhostArrow(step.highlightId, step.hintDir);

    this.tweens.add({
      targets: this.bubble,
      alpha: { from: 0, to: 1 },
      duration: 240,
    });
  }

  private drawHighlight(blockId: string): void {
    const block = this.blocks.find((b) => b.blockId === blockId);
    if (!block) return;
    const g = this.add.graphics();
    g.lineStyle(8, TOKENS.exitGlow, 1);
    g.strokeRoundedRect(-block.size[0] * (this.grid!.cellSize / 2) - 6, -block.size[1] * (this.grid!.cellSize / 2) - 6, block.size[0] * this.grid!.cellSize + 12, block.size[1] * this.grid!.cellSize + 12, 14);
    const c = this.add.container(block.x, block.y, [g]);
    c.setDepth(50);
    this.tweens.add({
      targets: c,
      scale: { from: 1, to: 1.1 },
      alpha: { from: 1, to: 0.4 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.highlight = g;
    (this.highlight as unknown as { _container: Phaser.GameObjects.Container })._container = c;
  }

  private drawGhostArrow(blockId: string, dir: Direction): void {
    const block = this.blocks.find((b) => b.blockId === blockId);
    if (!block) return;
    const len = 108;
    const dx = dir === 'RIGHT' ? len : dir === 'LEFT' ? -len : 0;
    const dy = dir === 'DOWN' ? len : dir === 'UP' ? -len : 0;
    const sx = block.x;
    const sy = block.y;
    const ex = sx + dx;
    const ey = sy + dy;

    const g = this.add.graphics();
    g.lineStyle(10, TOKENS.ink, 1);
    g.beginPath();
    g.moveTo(sx, sy);
    g.lineTo(ex, ey);
    g.strokePath();

    g.fillStyle(TOKENS.yellow, 1);
    g.lineStyle(6, TOKENS.ink, 1);
    const headLen = 28;
    let p1x = 0, p1y = 0, p2x = 0, p2y = 0, p3x = 0, p3y = 0;
    if (dir === 'RIGHT') {
      p1x = ex; p1y = ey - 18; p2x = ex; p2y = ey + 18; p3x = ex + headLen; p3y = ey;
    } else if (dir === 'LEFT') {
      p1x = ex; p1y = ey - 18; p2x = ex; p2y = ey + 18; p3x = ex - headLen; p3y = ey;
    } else if (dir === 'UP') {
      p1x = ex - 18; p1y = ey; p2x = ex + 18; p2y = ey; p3x = ex; p3y = ey - headLen;
    } else {
      p1x = ex - 18; p1y = ey; p2x = ex + 18; p2y = ey; p3x = ex; p3y = ey + headLen;
    }
    g.fillTriangle(p1x, p1y, p2x, p2y, p3x, p3y);
    g.beginPath();
    g.moveTo(p1x, p1y);
    g.lineTo(p3x, p3y);
    g.lineTo(p2x, p2y);
    g.strokePath();

    const c = this.add.container(0, 0, [g]);
    c.setDepth(60);
    this.tweens.add({
      targets: c,
      alpha: { from: 0.3, to: 1 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.ghostArrow = c;
  }

  private handleSwipe(block: Block, dir: Direction): void {
    if (this.busy || !this.grid) return;
    const result = this.movement.slide(block, this.grid, dir, this.blocks);

    if (result.kind === 'invalid') {
      AudioManager.thud();
      this.shake(block);
      return;
    }

    if (this.ghostArrow) {
      this.tweens.add({
        targets: this.ghostArrow,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.ghostArrow?.destroy();
          this.ghostArrow = undefined;
        },
      });
    }

    if (result.kind === 'slide') {
      this.grid.clear(block);
      block.gridPos = [result.toCol, result.toRow];
      this.grid.place(block);
      this.busy = true;
      block.moveToCell(this.grid, result.toCol, result.toRow, true, result.distance);
      this.time.delayedCall(Math.min(360, 90 + result.distance * 38), () => {
        block.squash(dir);
        dustPuff(this, block.x, block.y, dir);
        screenshake(this, 0.003, 80);
        AudioManager.click();
        this.busy = false;
      });
      return;
    }

    // exit
    this.grid.clear(block);
    block.gridPos = [result.toCol, result.toRow];
    this.busy = true;
    AudioManager.pop();
    removalBloom(this, block.x, block.y, COLORS[block.color]);
    burstParticles(this, block.x, block.y, COLORS[block.color], 10);
    screenshake(this, 0.004, 100);
    block.flyOff(dir, () => {
      this.refreshDependents();
      this.busy = false;
      this.afterRemove();
    });
  }

  private refreshDependents(): void {
    for (const b of this.blocks) {
      if (b.removed) continue;
      if (b.type === 'dependent') b.refreshDependency(this.blocks);
    }
  }

  private shake(block: Block): void {
    const ox = block.x;
    this.tweens.add({
      targets: block,
      x: ox - 8,
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => (block.x = ox),
    });
  }

  private afterRemove(): void {
    const remaining = this.blocks.filter((b) => !b.removed && b.type !== 'obstacle');
    if (remaining.length === 0) {
      this.time.delayedCall(380, () => this.advance());
    }
  }

  private advance(): void {
    this.stepIndex++;
    if (this.stepIndex >= STEPS.length) {
      useGameStore.getState().setTutorialDone(true);
      this.exit(true);
      return;
    }
    this.tweens.add({
      targets: this.bubble,
      alpha: 0,
      duration: 200,
      onComplete: () => this.loadStep(),
    });
  }

  private exit(done: boolean): void {
    if (done) useGameStore.getState().setTutorialDone(true);
    fadeOutAndStart(this, SCENE_KEYS.Menu);
  }

  private teardownStep(): void {
    this.busy = false;
    if (this.input2) {
      this.input2.setBlocks([]);
    }
    this.blocks.forEach((b) => {
      if (!b.removed) b.destroy();
    });
    this.blocks = [];
    this.boardLayer?.destroy();
    this.boardLayer = undefined;
    if (this.highlight) {
      const c = (this.highlight as unknown as { _container?: Phaser.GameObjects.Container })._container;
      c?.destroy();
      this.highlight = undefined;
    }
    this.ghostArrow?.destroy();
    this.ghostArrow = undefined;
    if (this.grid) {
      this.grid.destroy();
      this.grid = undefined;
    }
  }
}
