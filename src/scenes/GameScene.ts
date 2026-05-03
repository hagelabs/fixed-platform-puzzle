import Phaser from 'phaser';
import { SCENE_KEYS, HUD_HEIGHT } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { getLevel } from '../config/Levels';
import { Grid } from '../entities/Grid';
import { Block } from '../entities/Block';
import { InputManager } from '../managers/InputManager';
import { MovementSystem } from '../systems/MovementSystem';
import { Direction } from '../types/Game';

export class GameScene extends Phaser.Scene {
  private grid!: Grid;
  private blocks: Block[] = [];
  private input2!: InputManager;
  private movement!: MovementSystem;

  private levelText!: Phaser.GameObjects.Text;
  private movesText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENE_KEYS.Game });
  }

  create(): void {
    const store = useGameStore.getState();
    store.resetMoves();

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
  }

  private drawHud(): void {
    const { width } = this.scale;
    const store = useGameStore.getState();

    const hud = this.add.rectangle(width / 2, HUD_HEIGHT / 2, width, HUD_HEIGHT, 0x111418);
    hud.setStrokeStyle(0);

    this.levelText = this.add
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
      this.scene.launch(SCENE_KEYS.Pause);
      this.scene.pause();
    });
  }

  private handleDrag(block: Block, dir: Direction): void {
    if (block.removed) return;
    if (!this.movement.canExit(block, this.grid, dir)) {
      this.shake(block);
      return;
    }

    this.grid.clear(block);
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
    if (result === 'WIN') {
      useGameStore.getState().unlockNext();
      useGameStore.getState().addScore(100);
    }
    this.time.delayedCall(400, () => {
      this.scene.start(SCENE_KEYS.GameOver, { result });
    });
  }
}
