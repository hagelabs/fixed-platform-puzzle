import Phaser from 'phaser';
import { SCENE_KEYS, HUD_HEIGHT, COLORS } from '../config/Constants';
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
import {
  burstParticles,
  fadeIn,
  fadeOutAndStart,
  screenshake,
  dustPuff,
  removalBloom,
  deadEndPulse,
} from '../utils/Effects';
import {
  TOKENS,
  FONT_NEO,
  neoButton,
  neoPill,
  dottedBackground,
  NeoButtonHandle,
} from '../ui/Theme';

export class GameScene extends Phaser.Scene {
  private grid!: Grid;
  private blocks: Block[] = [];
  private input2!: InputManager;
  private movement!: MovementSystem;
  private history: MoveHistoryEntry[] = [];

  private movesText!: Phaser.GameObjects.Text;
  private hintBtn!: NeoButtonHandle;
  private undoBtn!: NeoButtonHandle;
  private deadEndShown = false;

  private hintBusy = false;
  private hovered: Block | null = null;
  private busy = false;

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
    this.grid = new Grid(this, levelData.cols, levelData.rows, levelData.exits);

    this.blocks = [];
    this.input2 = new InputManager(this, (block, dir) => this.handleSwipe(block, dir));

    levelData.blocks.forEach((bd) => {
      const block = new Block(this, bd, this.grid);
      this.grid.place(block);
      this.blocks.push(block);
    });

    this.input2.setBlocks(this.blocks);

    this.drawHud();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      SDKManager.gameplayStop();
      this.input.off('pointermove', this.refreshHover, this);
      this.events.off('block:settled', this.refreshHover, this);
      this.hovered = null;
    });
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
        AudioManager.uiTap();
        this.scene.launch(SCENE_KEYS.Pause);
        this.scene.pause();
      },
      { w: 100, h: 86, fill: TOKENS.white, textSize: 32 },
    );

    const bottomY = this.scale.height - 100;
    this.undoBtn = neoButton(
      this,
      width / 2 - 300,
      bottomY,
      200,
      86,
      'UNDO',
      TOKENS.yellow,
      () => this.undo(),
      { textSize: 36 },
    );
    this.hintBtn = neoButton(
      this,
      width / 2,
      bottomY,
      200,
      86,
      'HINT',
      TOKENS.sky,
      () => this.requestHint(),
      { textSize: 36 },
    );
    neoButton(
      this,
      width / 2 + 300,
      bottomY,
      200,
      86,
      'RESTART',
      TOKENS.danger,
      () => this.scene.restart(),
      { textSize: 36 },
    );
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

  private async requestHint(): Promise<void> {
    if (this.hintBusy) return;
    this.hintBusy = true;
    this.hintBtn.setEnabled(false);

    AudioManager.uiTap();
    Analytics.log('hint_used');
    try {
      const ok = await AdManager.showRewarded('hint');
      if (!ok) return;

      const exitMove = this.movement.findAnyExit(this.blocks, this.grid);
      const target = exitMove?.block ?? this.findFirstMovable();
      if (!target) return;

      this.tweens.add({
        targets: target,
        scale: 1.15,
        duration: 200,
        yoyo: true,
        repeat: 2,
        onComplete: () => target.setScale(1),
      });
    } finally {
      this.hintBusy = false;
      this.hintBtn.setEnabled(true);
    }
  }

  private findFirstMovable(): Block | null {
    const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    return (
      this.blocks.find(
        (b) =>
          !b.removed &&
          b.type !== 'obstacle' &&
          dirs.some((d) => {
            const r = this.movement.slide(b, this.grid, d, this.blocks);
            return r.kind === 'exit' || (r.kind === 'slide' && r.distance > 0);
          }),
      ) ?? null
    );
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
    if (this.busy) return;
    if (block.removed || block.type === 'obstacle') return;

    const result = this.movement.slide(block, this.grid, dir, this.blocks);

    if (result.kind === 'invalid') {
      AudioManager.thud();
      this.shake(block);
      Analytics.log('hint_used', { invalid: result.reason });
      return;
    }

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
      block.moveToCell(this.grid, result.toCol, result.toRow, true, result.distance);
      this.time.delayedCall(Math.min(360, 90 + result.distance * 38), () => {
        block.squash(dir);
        dustPuff(this, block.x, block.y, dir);
        screenshake(this, 0.003, 80);
        AudioManager.click();
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
    block.gridPos = [result.toCol, result.toRow];
    this.busy = true;
    AudioManager.pop();
    removalBloom(this, block.x, block.y, COLORS[block.color]);
    burstParticles(this, block.x, block.y, COLORS[block.color], 10);
    screenshake(this, 0.004, 100);
    block.flyOff(dir, () => {
      this.refreshDependents();
      this.afterRemove();
      this.busy = false;
    });
    this.events.emit('tutorial:moved');
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
      AudioManager.thud();
    }
    SDKManager.gameplayStop();
    this.time.delayedCall(500, () => {
      fadeOutAndStart(this, SCENE_KEYS.GameOver, { result });
    });
  }
}
