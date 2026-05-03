import Phaser from 'phaser';
import { SCENE_KEYS, HUD_HEIGHT, COLORS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { getLevel } from '../config/Levels';
import { Grid } from '../entities/Grid';
import { Block } from '../entities/Block';
import { InputManager } from '../managers/InputManager';
import { MovementSystem } from '../systems/MovementSystem';
import { Direction } from '../types/Game';
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

  private movesText!: Phaser.GameObjects.Text;
  private hintBtn!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENE_KEYS.Game });
  }

  create(): void {
    fadeIn(this);
    const store = useGameStore.getState();
    store.resetMoves();
    Analytics.log('level_started', { level: store.currentLevel });
    SDKManager.gameplayStart();

    this.cameras.main.setBackgroundColor('#1a1a1a');
    this.movement = new MovementSystem();

    const levelData = getLevel(store.currentLevel);
    this.grid = new Grid(this, levelData.cols, levelData.rows);

    this.blocks = [];
    this.input2 = new InputManager(this, (block, dir) => this.handleDrag(block, dir));

    levelData.blocks.forEach((bd) => {
      const block = new Block(this, bd, this.grid);
      this.grid.place(block);
      this.input2.attach(block);
      this.blocks.push(block);
    });

    this.drawHud();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      SDKManager.gameplayStop();
    });
  }

  private drawHud(): void {
    const { width } = this.scale;
    const store = useGameStore.getState();

    this.add.rectangle(width / 2, HUD_HEIGHT / 2, width, HUD_HEIGHT, 0x111418);

    this.add
      .text(40, HUD_HEIGHT / 2, `Level ${store.currentLevel}`, {
        fontFamily: 'Arial',
        fontSize: '36px',
        color: '#ffffff',
      })
      .setOrigin(0, 0.5);

    this.movesText = this.add
      .text(width / 2, HUD_HEIGHT / 2, `Moves: 0`, {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#cccccc',
      })
      .setOrigin(0.5);

    const pauseBtn = this.add
      .text(width - 40, HUD_HEIGHT / 2, '⏸', {
        fontFamily: 'Arial',
        fontSize: '40px',
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
      .text(width - 120, HUD_HEIGHT / 2, '💡', {
        fontFamily: 'Arial',
        fontSize: '36px',
        color: '#ffffff',
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });
    this.hintBtn.on('pointerup', () => this.requestHint());
  }

  private async requestHint(): Promise<void> {
    AudioManager.uiTap();
    Analytics.log('hint_used');
    const ok = await AdManager.showRewarded('hint');
    if (!ok) return;
    const hintBlock = this.findHintBlock();
    if (!hintBlock) return;
    const ox = hintBlock.x;
    const oy = hintBlock.y;
    this.tweens.add({
      targets: hintBlock,
      scale: 1.15,
      duration: 200,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        hintBlock.setScale(1);
        hintBlock.x = ox;
        hintBlock.y = oy;
      },
    });
  }

  private findHintBlock(): Block | null {
    const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    return (
      this.blocks.find(
        (b) => !b.removed && dirs.some((d) => this.movement.canExit(b, this.grid, d))
      ) ?? null
    );
  }

  private handleDrag(block: Block, dir: Direction): void {
    if (block.removed) return;
    if (!this.movement.canExit(block, this.grid, dir)) {
      AudioManager.thud();
      this.shake(block);
      return;
    }

    Analytics.log('block_moved', { dir, color: block.color });
    this.grid.clear(block);
    AudioManager.pop();
    burstParticles(this, block.x, block.y, COLORS[block.color]);
    block.flyOff(dir, () => this.afterRemove());

    const store = useGameStore.getState();
    store.incMoves();
    store.addScore(10);
    this.movesText.setText(`Moves: ${useGameStore.getState().movesThisLevel}`);
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
    const remaining = this.blocks.filter((b) => !b.removed);
    if (remaining.length === 0) {
      this.endLevel('WIN');
      return;
    }
    if (!this.movement.anyExitAvailable(remaining, this.grid)) {
      this.endLevel('STUCK');
    }
  }

  private endLevel(result: 'WIN' | 'STUCK'): void {
    const store = useGameStore.getState();
    if (result === 'WIN') {
      AudioManager.win();
      store.unlockNext();
      store.addScore(100);
      SDKManager.happytime();
      Analytics.log('level_completed', { level: store.currentLevel, moves: store.movesThisLevel });
    } else {
      AudioManager.thud();
      Analytics.log('level_failed', { level: store.currentLevel });
    }
    SDKManager.gameplayStop();
    this.time.delayedCall(500, () => {
      fadeOutAndStart(this, SCENE_KEYS.GameOver, { result });
    });
  }
}
