import Phaser from 'phaser';
import { SCENE_KEYS, HUD_HEIGHT, COLORS, FONT_HEADER } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { getLevel } from '../config/Levels';
import { Grid } from '../entities/Grid';
import { Block } from '../entities/Block';
import { InputManager } from '../managers/InputManager';
import { MovementSystem } from '../systems/MovementSystem';
import { Direction, MoveHistoryEntry } from '../types/Game';
import { AudioManager } from '../managers/AudioManager';
import { Analytics } from '../managers/AnalyticsManager';
import { SDKManager } from '../managers/SDKManager';
import { AdManager } from '../managers/AdManager';
import { burstParticles, fadeIn, fadeOutAndStart } from '../utils/Effects';

export class GameScene extends Phaser.Scene {
  private grid!: Grid;
  private blocks: Block[] = [];
  private input2!: InputManager;
  private movement!: MovementSystem;
  private history: MoveHistoryEntry[] = [];
  private optimalMoves = 1;

  private movesText!: Phaser.GameObjects.Text;
  private hintBtn!: Phaser.GameObjects.Text;
  private undoBtn!: Phaser.GameObjects.Text;
  private deadEndShown = false;

  private hintBusy = false;
  private hovered: Block | null = null;

  constructor() {
    super({ key: SCENE_KEYS.Game });
  }

  async create(): Promise<void> {
    fadeIn(this);
    const store = useGameStore.getState();
    store.resetMoves();
    this.history = [];
    this.deadEndShown = false;
    Analytics.log('level_started', { level: store.currentLevel });

    await AdManager.preLevelInterstitial();
    SDKManager.gameplayStart();

    this.cameras.main.setBackgroundColor('#0d1117');
    this.drawBackground();
    this.input.topOnly = true;
    this.hovered = null;
    this.input.on('pointermove', this.refreshHover, this);
    this.events.on('block:settled', this.refreshHover, this);
    this.movement = new MovementSystem();

    const levelData = getLevel(store.currentLevel);
    this.optimalMoves = levelData.optimalMoves;
    this.grid = new Grid(this, levelData.cols, levelData.rows, levelData.exits);

    this.blocks = [];
    this.input2 = new InputManager(this, (block, dir) => this.handleDrag(block, dir));

    levelData.blocks.forEach((bd) => {
      const block = new Block(this, bd, this.grid);
      this.grid.place(block);
      this.blocks.push(block);
    });

    this.input2.setBlocks(this.blocks);

    this.drawHud();

    if (store.currentLevel === 1 && !store.tutorialDone) {
      this.scene.launch(SCENE_KEYS.Tutorial, { blocks: this.blocks, grid: this.grid });
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      SDKManager.gameplayStop();
      this.input.off('pointermove', this.refreshHover, this);
      this.events.off('block:settled', this.refreshHover, this);
      this.hovered = null;
      if (this.scene.isActive(SCENE_KEYS.Tutorial)) {
        this.scene.stop(SCENE_KEYS.Tutorial);
      }
    });
  }

  private refreshHover(): void {
    const p = this.input.activePointer;
    let next: Block | null = null;
    for (const b of this.blocks) {
      if (b.removed || b.type !== 'simple') continue;
      if (b.containsPointer(p.worldX, p.worldY)) {
        next = b;
        break;
      }
    }
    if (next === this.hovered) return;
    this.hovered?.setHover(false);
    this.hovered = next;
    this.hovered?.setHover(true);
  }

  private drawBackground(): void {
    const { width, height } = this.scale;

    // Diagonal hatch — subtle texture
    const hatch = this.add.graphics();
    hatch.lineStyle(1, 0x2d3548, 0.35);
    const step = 28;
    for (let i = -height; i < width + height; i += step) {
      hatch.beginPath();
      hatch.moveTo(i, 0);
      hatch.lineTo(i + height, height);
      hatch.strokePath();
    }

    // Coarse dot grid — accent depth
    const dots = this.add.graphics();
    dots.fillStyle(0xffcc44, 0.06);
    const dotSpacing = 56;
    for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
      for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
        dots.fillCircle(x, y, 2.5);
      }
    }

    // Soft vignette via 4 edge gradients (alpha rectangles)
    const vignette = this.add.graphics();
    const vsteps = 12;
    const vmax = 0.35;
    for (let i = 0; i < vsteps; i++) {
      const a = vmax * (1 - i / vsteps);
      const inset = i * 4;
      vignette.lineStyle(2, 0x000000, a);
      vignette.strokeRect(inset, inset, width - inset * 2, height - inset * 2);
    }
  }

  private drawHud(): void {
    const { width } = this.scale;
    const store = useGameStore.getState();

    this.add.rectangle(width / 2, HUD_HEIGHT / 2, width, HUD_HEIGHT, 0x111418);

    this.add
      .text(16, HUD_HEIGHT / 2, `Level ${store.currentLevel}`, {
        fontFamily: FONT_HEADER,
        fontSize: '20px',
        color: '#ffcc44',
      })
      .setOrigin(0, 0.5);

    this.movesText = this.add
      .text(width / 2, HUD_HEIGHT / 2, `Moves: 0 / ${this.optimalMoves}`, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#cccccc',
      })
      .setOrigin(0.5);

    const pauseBtn = this.add
      .text(width - 16, HUD_HEIGHT / 2, '⏸', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });
    pauseBtn.on('pointerup', () => {
      AudioManager.uiTap();
      this.scene.launch(SCENE_KEYS.Pause);
      this.scene.pause();
    });

    this.hintBtn = this.add
      .text(width - 56, HUD_HEIGHT / 2, '💡', {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#ffffff',
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });
    this.hintBtn.on('pointerup', () => this.requestHint());

    this.undoBtn = this.add
      .text(width - 96, HUD_HEIGHT / 2, '↶', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#888888',
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });
    this.undoBtn.on('pointerup', () => this.undo());
  }

  private async requestHint(): Promise<void> {
    if (this.hintBusy) return;
    this.hintBusy = true;
    this.hintBtn.setAlpha(0.4);
    this.hintBtn.disableInteractive();

    AudioManager.uiTap();
    Analytics.log('hint_used');
    try {
      const ok = await AdManager.showRewarded('hint');
      if (!ok) return;

      const exitMove = this.movement.findAnyExit(this.blocks, this.grid);
      const target = exitMove?.block ?? this.findFirstMovable();
      if (!target) return;

      const ox = target.x;
      const oy = target.y;
      this.tweens.add({
        targets: target,
        scale: 1.15,
        duration: 200,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          target.setScale(1);
          target.x = ox;
          target.y = oy;
        },
      });
    } finally {
      this.hintBusy = false;
      this.hintBtn.setAlpha(1);
      this.hintBtn.setInteractive({ useHandCursor: true });
    }
  }

  private findFirstMovable(): Block | null {
    const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    return (
      this.blocks.find(
        (b) => !b.removed && b.type === 'simple' && dirs.some((d) => this.movement.attempt(b, this.grid, d).kind !== 'invalid')
      ) ?? null
    );
  }

  private undo(): void {
    if (this.history.length === 0) {
      AudioManager.thud();
      return;
    }
    const entry = this.history.pop()!;
    if (entry.removed) {
      // Cannot undo a removed block (already destroyed). Skip removed entries — find prev slide entry.
      AudioManager.thud();
      return;
    }
    const block = this.blocks.find((b) => b.blockId === entry.blockId);
    if (!block || block.removed) return;

    this.grid.clear(block);
    block.gridPos = entry.prevPos;
    this.grid.place(block);
    block.moveToCell(this.grid, entry.prevPos[0], entry.prevPos[1], true);
    AudioManager.uiTap();
    Analytics.log('hint_used', { type: 'undo' });
  }

  private handleDrag(block: Block, dir: Direction): void {
    if (block.removed || block.type !== 'simple') return;
    const result = this.movement.attempt(block, this.grid, dir);

    if (result.kind === 'invalid') {
      AudioManager.thud();
      this.shake(block);
      Analytics.log('hint_used', { invalid: result.reason });
      return;
    }

    Analytics.log('block_moved', { dir, color: block.color, kind: result.kind });
    const store = useGameStore.getState();
    store.incMoves();
    this.movesText.setText(`Moves: ${useGameStore.getState().movesThisLevel} / ${this.optimalMoves}`);

    if (result.kind === 'slide') {
      this.history.push({
        blockId: block.blockId,
        prevPos: [...block.gridPos] as [number, number],
        removed: false,
      });
      this.grid.clear(block);
      block.gridPos = [result.nextCol, result.nextRow];
      this.grid.place(block);
      block.moveToCell(this.grid, result.nextCol, result.nextRow, true);
      AudioManager.click();
      this.events.emit('tutorial:moved');
      this.checkDeadEnd();
      return;
    }

    // exit
    this.history.push({
      blockId: block.blockId,
      prevPos: [...block.gridPos] as [number, number],
      removed: true,
    });
    this.grid.clear(block);
    AudioManager.pop();
    burstParticles(this, block.x, block.y, COLORS[block.color]);
    block.flyOff(dir, () => this.afterRemove());
    this.events.emit('tutorial:moved');
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
    const remaining = this.blocks.filter((b) => !b.removed && b.type === 'simple');
    if (remaining.length === 0) {
      this.endLevel('WIN');
      return;
    }
    this.checkDeadEnd();
  }

  private checkDeadEnd(): void {
    if (this.deadEndShown) return;
    const remaining = this.blocks.filter((b) => !b.removed && b.type === 'simple');
    if (remaining.length === 0) return;
    if (!this.movement.anyValidMove(remaining, this.grid)) {
      this.deadEndShown = true;
      Analytics.log('level_failed', { reason: 'dead_end', moves: useGameStore.getState().movesThisLevel });
      this.cameras.main.flash(300, 80, 0, 0);
      remaining.forEach((b) => b.pulseRed());
      this.time.delayedCall(700, () => this.endLevel('STUCK'));
    }
  }

  private computeStars(): number {
    const moves = useGameStore.getState().movesThisLevel;
    if (moves <= this.optimalMoves) return 3;
    if (moves <= this.optimalMoves + 2) return 2;
    return 1;
  }

  private endLevel(result: 'WIN' | 'STUCK'): void {
    const store = useGameStore.getState();
    let stars = 0;
    if (result === 'WIN') {
      stars = this.computeStars();
      AudioManager.win();
      store.unlockNext();
      store.recordStars(store.currentLevel, stars);
      SDKManager.happytime();
      Analytics.log('level_completed', {
        level: store.currentLevel,
        moves: store.movesThisLevel,
        stars,
      });
    } else {
      AudioManager.thud();
    }
    SDKManager.gameplayStop();
    this.time.delayedCall(500, () => {
      fadeOutAndStart(this, SCENE_KEYS.GameOver, { result, stars });
    });
  }
}
