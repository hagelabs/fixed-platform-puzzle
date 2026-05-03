import Phaser from 'phaser';
import { SCENE_KEYS, TOTAL_LEVELS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.LevelSelect });
  }

  create(): void {
    const { width, height } = this.scale;
    const cx = width / 2;

    this.cameras.main.setBackgroundColor('#1a1a1a');

    this.add
      .text(cx, 80, 'SELECT LEVEL', {
        fontFamily: 'Arial',
        fontSize: '48px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const store = useGameStore.getState();
    const cols = 5;
    const tileSize = 130;
    const gap = 20;
    const gridW = cols * tileSize + (cols - 1) * gap;
    const startX = (width - gridW) / 2 + tileSize / 2;
    const startY = 200;

    for (let i = 0; i < TOTAL_LEVELS; i++) {
      const lvl = i + 1;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (tileSize + gap);
      const y = startY + row * (tileSize + gap);
      const locked = lvl > store.unlockedLevel;

      const bg = this.add.rectangle(
        x,
        y,
        tileSize,
        tileSize,
        locked ? 0x333333 : lvl === store.currentLevel ? 0x55cc55 : 0x4488ff
      );
      bg.setStrokeStyle(2, 0xffffff, locked ? 0.2 : 0.6);
      this.add
        .text(x, y, locked ? '🔒' : `${lvl}`, {
          fontFamily: 'Arial',
          fontSize: '36px',
          color: '#ffffff',
        })
        .setOrigin(0.5);

      if (!locked) {
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerup', () => {
          useGameStore.getState().setCurrentLevel(lvl);
          this.scene.start(SCENE_KEYS.Game);
        });
      }
    }

    const back = this.add
      .text(cx, height - 60, '< BACK', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#aaaaaa',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    back.on('pointerup', () => this.scene.start(SCENE_KEYS.Menu));
  }
}
