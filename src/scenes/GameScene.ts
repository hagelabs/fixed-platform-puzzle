import Phaser from 'phaser';
import { SCENE_KEYS, HUD_HEIGHT, COLORS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { getLevel, getSolution, MAX_LEVEL_COLS, MAX_LEVEL_ROWS, SolutionMove } from '../config/Levels';
import { Grid } from '../entities/Grid';
import { Block } from '../entities/Block';
import { InputManager } from '../managers/InputManager';
import { MovementSystem } from '../systems/MovementSystem';
import { Direction, MoveHistoryEntry } from '../types/Game';
import { AudioManager } from '../managers/AudioManager';
import { Analytics } from '../managers/AnalyticsManager';
import { SDKManager } from '../managers/SDKManager';
import { AdManager } from '../managers/AdManager';
import {
  burstParticles,
  fadeIn,
  fadeOutAndStart,
  screenshake,
  dustPuff,
  removalBloom,
  deadEndPulse,
  portalSuck,
} from '../utils/Effects';
import {
  TOKENS,
  FONT_NEO,
  neoButton,
  neoPill,
  dottedBackground,
  NeoButtonHandle,
} from '../ui/Theme';
import { LevelTutorial, LEVEL_TUTORIALS } from '../ui/LevelTutorial';

export class GameScene extends Phaser.Scene {
  private grid!: Grid;
  private blocks: Block[] = [];
  private input2!: InputManager;
  private movement!: MovementSystem;
  private history: MoveHistoryEntry[] = [];

  private movesText!: Phaser.GameObjects.Text;
  private undoBtn!: NeoButtonHandle;
  private watchBtn!: NeoButtonHandle;
  private restartBtn!: NeoButtonHandle;
  private deadEndShown = false;

  private hovered: Block | null = null;
  private busy = false;
  private watchPlaying = false;
  private autoplayActive = false;
  private autoplayToken = 0;
  private lastRemovalAt = 0;
  private comboCount = 0;
  private prevLocked = new Map<string, boolean>();
  private tutorial?: LevelTutorial;

  constructor() {
    super({ key: SCENE_KEYS.Game });
  }

  async create(): Promise<void> {
    fadeIn(this);
    const store = useGameStore.getState();
    store.resetMoves();
    this.history = [];
    this.deadEndShown = false;
    this.busy = false;
    this.watchPlaying = false;
    this.autoplayActive = false;
    this.comboCount = 0;
    this.lastRemovalAt = 0;
    this.autoplayToken++;
    Analytics.log('level_started', { level: store.currentLevel });

    await AdManager.preLevelInterstitial();
    SDKManager.gameplayStart();

    dottedBackground(this);
    this.input.topOnly = true;
    this.hovered = null;
    this.input.on('pointermove', this.refreshHover, this);
    this.events.on('block:settled', this.refreshHover, this);
    this.movement = new MovementSystem();

    const levelData = getLevel(store.currentLevel);
    this.grid = new Grid(this, levelData.cols, levelData.rows, levelData.exits, {
      cols: MAX_LEVEL_COLS,
      rows: MAX_LEVEL_ROWS,
    });

    this.blocks = [];
    this.input2 = new InputManager(this, (block, dir) => this.handleSwipe(block, dir));

    levelData.blocks.forEach((bd) => {
      const block = new Block(this, bd, this.grid);
      this.grid.place(block);
      this.blocks.push(block);
    });

    this.input2.setBlocks(this.blocks);

    // Snapshot initial locked state for unlockChime detection
    this.prevLocked.clear();
    for (const b of this.blocks) {
      if (b.type === 'dependent') this.prevLocked.set(b.blockId, b.isLocked());
    }

    this.drawHud();
    AudioManager.startAmbient();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.autoplayToken++;
      SDKManager.gameplayStop();
      this.input.off('pointermove', this.refreshHover, this);
      this.events.off('block:settled', this.refreshHover, this);
      this.events.off('tutorial:moved', this.dismissTutorial, this);
      this.tutorial?.destroy();
      this.tutorial = undefined;
      this.hovered = null;
      AudioManager.stopAmbient();
    });

    const willAutoplay = !!this.registry.get('autoplaySolution');
    if (willAutoplay) {
      this.registry.remove('autoplaySolution');
      this.time.delayedCall(400, () => this.runAutoplay());
    } else {
      this.maybeShowTutorial();
    }
  }

  private maybeShowTutorial(): void {
    const store = useGameStore.getState();
    const level = store.currentLevel;
    const cfg = LEVEL_TUTORIALS[level];
    if (!cfg) return;
    if (store.hasSeenTutorial(level)) return;
    this.tutorial = new LevelTutorial(this);
    this.tutorial.show(cfg, this.blocks, this.grid);
    this.events.on('tutorial:moved', this.dismissTutorial, this);
  }

  private dismissTutorial(): void {
    if (!this.tutorial) return;
    const level = useGameStore.getState().currentLevel;
    useGameStore.getState().markTutorialSeen(level);
    this.tutorial.dismiss();
    this.tutorial = undefined;
    this.events.off('tutorial:moved', this.dismissTutorial, this);
  }

  private refreshHover(): void {
    const p = this.input.activePointer;
    let next: Block | null = null;
    for (const b of this.blocks) {
      if (b.removed || b.type === 'obstacle') continue;
      if (b.type === 'dependent' && b.isLocked()) continue;
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

  private drawHud(): void {
    const { width } = this.scale;
    const store = useGameStore.getState();

    const headerY = 64;
    this.drawHudLabel(116, headerY, 172, 86, `LV ${store.currentLevel}`, TOKENS.mint);

    this.movesText = this.add
      .text(width / 2, headerY, `MOVES: 0`, {
        fontFamily: FONT_NEO,
        fontSize: '32px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5);

    neoPill(
      this,
      width - 64,
      headerY,
      'II',
      () => {
        AudioManager.pauseSwoosh();
        this.scene.launch(SCENE_KEYS.Pause);
        this.scene.pause();
      },
      { w: 100, h: 86, fill: TOKENS.white, textSize: 32 },
    );

    const bottomY = this.scale.height - 55;
    const btnW = 220;
    const btnSpacing = 240;
    this.undoBtn = neoButton(
      this,
      width / 2 - btnSpacing,
      bottomY,
      btnW,
      86,
      'UNDO',
      TOKENS.yellow,
      () => this.undo(),
      { textSize: 34 },
    );
    this.watchBtn = neoButton(
      this,
      width / 2,
      bottomY,
      btnW,
      86,
      'WATCH',
      TOKENS.mint,
      () => this.requestWatch(),
      { textSize: 28 },
    );
    this.refreshWatchLabel();
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.refreshWatchLabel(),
    });
    this.restartBtn = neoButton(
      this,
      width / 2 + btnSpacing,
      bottomY,
      btnW,
      86,
      'RESTART',
      TOKENS.danger,
      () => {
        if (this.watchPlaying) return;
        this.scene.restart();
      },
      { textSize: 34 },
    );
  }

  private refreshWatchLabel(): void {
    const store = useGameStore.getState();
    if (SDKManager.hasRewardedAds()) {
      this.watchBtn.setLabel('WATCH AD');
      this.watchBtn.setEnabled(!this.watchPlaying);
      return;
    }
    const sec = store.getWatchCooldownSecondsLeft();
    if (sec <= 0) {
      this.watchBtn.setLabel('WATCH');
      this.watchBtn.setEnabled(!this.watchPlaying);
    } else {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      this.watchBtn.setLabel(`${m}:${String(s).padStart(2, '0')}`);
      this.watchBtn.setEnabled(false);
      if (sec > 0 && sec <= 3) AudioManager.tick();
    }
  }

  private async requestWatch(): Promise<void> {
    if (this.watchPlaying || this.busy) return;
    AudioManager.uiTap();

    if (SDKManager.hasRewardedAds()) {
      this.watchBtn.setEnabled(false);
      const ok = await AdManager.showRewarded('hint');
      if (!ok) {
        AudioManager.thud();
        this.refreshWatchLabel();
        return;
      }
    } else {
      const store = useGameStore.getState();
      if (store.isWatchOnCooldown()) {
        AudioManager.thud();
        this.refreshWatchLabel();
        return;
      }
      store.startWatchCooldown();
    }

    Analytics.log('hint_used', { type: 'watch_solution' });
    this.refreshWatchLabel();

    this.registry.set('autoplaySolution', true);
    this.scene.restart();
  }

  private async runAutoplay(): Promise<void> {
    const token = this.autoplayToken;
    const store = useGameStore.getState();
    const moves: SolutionMove[] = getSolution(store.currentLevel);
    if (moves.length === 0) {
      this.watchPlaying = false;
      this.refreshWatchLabel();
      return;
    }
    this.watchPlaying = true;
    this.undoBtn.setEnabled(false);
    this.watchBtn.setEnabled(false);
    this.restartBtn.setEnabled(false);
    this.refreshWatchLabel();

    for (const mv of moves) {
      // wait for any in-flight animation
      await this.waitUntilIdle();
      if (token !== this.autoplayToken) return;
      const block = this.blocks.find((b) => b.blockId === mv.blockId);
      if (!block || block.removed) continue;
      this.autoplayActive = true;
      AudioManager.aiStep();
      this.handleSwipe(block, mv.dir);
      this.autoplayActive = false;
      // small visual gap between moves
      await this.delay(120);
      if (token !== this.autoplayToken) return;
    }
    await this.waitUntilIdle();
    if (token !== this.autoplayToken) return;
    this.watchPlaying = false;
    this.undoBtn.setEnabled(true);
    this.restartBtn.setEnabled(true);
    this.refreshWatchLabel();
  }

  private waitUntilIdle(): Promise<void> {
    return new Promise((resolve) => {
      const tick = () => {
        if (!this.busy) resolve();
        else this.time.delayedCall(40, tick);
      };
      tick();
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => this.time.delayedCall(ms, () => resolve()));
  }

  private drawHudLabel(
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    fill: number,
  ): void {
    const g = this.add.graphics();
    const cornerR = TOKENS.cornerR;
    const shadow = TOKENS.shadowOffset;
    const border = TOKENS.borderPx;
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(-w / 2 + shadow, -h / 2 + shadow, w, h, cornerR);
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, cornerR);
    g.fillStyle(fill, 1);
    g.fillRoundedRect(-w / 2 + border, -h / 2 + border, w - border * 2, h - border * 2, cornerR - 4);
    const txt = this.add
      .text(0, 0, label, {
        fontFamily: FONT_NEO,
        fontSize: '32px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5);
    this.add.container(x, y, [g, txt]);
  }

  private undo(): void {
    if (this.busy) return;
    while (this.history.length > 0) {
      const entry = this.history.pop()!;
      if (entry.removed) {
        AudioManager.thud();
        continue;
      }
      const block = this.blocks.find((b) => b.blockId === entry.blockId);
      if (!block || block.removed) continue;

      this.grid.clear(block);
      block.gridPos = entry.prevPos;
      this.grid.place(block);
      block.moveToCell(this.grid, entry.prevPos[0], entry.prevPos[1], true, 1);
      AudioManager.uiTap();
      Analytics.log('hint_used', { type: 'undo' });
      this.deadEndShown = false;
      return;
    }
    AudioManager.thud();
  }

  private handleSwipe(block: Block, dir: Direction): void {
    if (this.busy) {
      AudioManager.bump();
      return;
    }
    if (this.watchPlaying && !this.autoplayActive) return;
    if (block.removed || block.type === 'obstacle') return;

    const result = this.movement.slide(block, this.grid, dir, this.blocks);

    if (result.kind === 'invalid') {
      if (result.reason === 'wrong_dir') AudioManager.constraintReject();
      else if (result.reason === 'locked') AudioManager.thud();
      else AudioManager.bump();
      this.shake(block);
      Analytics.log('hint_used', { invalid: result.reason });
      return;
    }

    const pan = this.computePan(block.gridPos[0]);

    Analytics.log('block_moved', { dir, color: block.color, kind: result.kind });
    const store = useGameStore.getState();
    store.incMoves();
    this.movesText.setText(`MOVES: ${useGameStore.getState().movesThisLevel}`);

    if (result.kind === 'slide') {
      this.history.push({
        blockId: block.blockId,
        prevPos: [...block.gridPos] as [number, number],
        removed: false,
      });
      this.grid.clear(block);
      block.gridPos = [result.toCol, result.toRow];
      this.grid.place(block);
      this.busy = true;
      AudioManager.slideStart(result.distance, pan);
      block.moveToCell(this.grid, result.toCol, result.toRow, true, result.distance);
      this.time.delayedCall(Math.min(360, 90 + result.distance * 38), () => {
        block.squash(dir);
        dustPuff(this, block.x, block.y, dir);
        screenshake(this, 0.003, 80);
        AudioManager.slideEnd(result.distance, this.computePan(result.toCol));
        this.busy = false;
        this.events.emit('tutorial:moved');
        this.checkDeadEnd();
      });
      return;
    }

    // exit
    this.history.push({
      blockId: block.blockId,
      prevPos: [...block.gridPos] as [number, number],
      removed: true,
    });
    this.grid.clear(block);
    const startCol = block.gridPos[0];
    const startRow = block.gridPos[1];
    block.gridPos = [result.toCol, result.toRow];
    this.busy = true;
    AudioManager.slideStart(result.distance, pan);

    const lastInCol =
      dir === 'RIGHT' ? result.toCol - 1
      : dir === 'LEFT' ? result.toCol + 1
      : result.toCol;
    const lastInRow =
      dir === 'DOWN' ? result.toRow - 1
      : dir === 'UP' ? result.toRow + 1
      : result.toRow;
    const slideDist =
      Math.abs(lastInCol - startCol) + Math.abs(lastInRow - startRow);
    const exitColor = COLORS[block.color];

    block.exitTo(
      this.grid,
      lastInCol,
      lastInRow,
      dir,
      slideDist,
      () => {
        const portalX = this.grid.worldX(lastInCol);
        const portalY = this.grid.worldY(lastInRow);
        AudioManager.pop(this.computePan(result.toCol));
        this.handleCombo();
        removalBloom(this, portalX, portalY, exitColor);
        burstParticles(this, portalX, portalY, exitColor, 12);
        portalSuck(this, portalX, portalY, dir);
        screenshake(this, 0.005, 110);
      },
      () => {
        this.refreshDependents();
        this.afterRemove();
        this.busy = false;
      },
    );
    this.events.emit('tutorial:moved');
  }

  private refreshDependents(): void {
    let unlockedAny = false;
    for (const b of this.blocks) {
      if (b.removed) continue;
      if (b.type !== 'dependent') continue;
      b.refreshDependency(this.blocks);
      const wasLocked = this.prevLocked.get(b.blockId) ?? true;
      const nowLocked = b.isLocked();
      if (wasLocked && !nowLocked) unlockedAny = true;
      this.prevLocked.set(b.blockId, nowLocked);
    }
    if (unlockedAny) AudioManager.unlockChime();
  }

  private computePan(col: number): number {
    const cols = this.grid?.cols ?? 1;
    if (cols <= 1) return 0;
    const norm = (col / (cols - 1)) * 2 - 1;
    return Math.max(-0.7, Math.min(0.7, norm));
  }

  private handleCombo(): void {
    const now = performance.now();
    if (now - this.lastRemovalAt <= 800) {
      this.comboCount++;
      if (this.comboCount >= 2) AudioManager.combo(this.comboCount);
    } else {
      this.comboCount = 1;
    }
    this.lastRemovalAt = now;
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
      this.endLevel('WIN');
      return;
    }
    this.checkDeadEnd();
  }

  private checkDeadEnd(): void {
    if (this.deadEndShown) return;
    const remaining = this.blocks.filter((b) => !b.removed && b.type !== 'obstacle');
    if (remaining.length === 0) return;
    if (!this.movement.anyValidMove(this.blocks, this.grid)) {
      this.deadEndShown = true;
      Analytics.log('level_failed', {
        reason: 'dead_end',
        moves: useGameStore.getState().movesThisLevel,
      });
      AudioManager.deadEnd();
      deadEndPulse(this);
      remaining.forEach((b) => b.pulseRed());
      this.time.delayedCall(900, () => this.endLevel('STUCK'));
    }
  }

  private endLevel(result: 'WIN' | 'STUCK'): void {
    const store = useGameStore.getState();
    if (result === 'WIN') {
      AudioManager.win();
      store.unlockNext();
      SDKManager.happytime();
      Analytics.log('level_completed', {
        level: store.currentLevel,
        moves: store.movesThisLevel,
      });
    } else {
      AudioManager.levelFail();
    }
    AudioManager.stopAmbient();
    SDKManager.gameplayStop();
    this.time.delayedCall(500, () => {
      fadeOutAndStart(this, SCENE_KEYS.GameOver, { result });
    });
  }
}
