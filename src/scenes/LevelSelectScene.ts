import Phaser from 'phaser';
import { SCENE_KEYS, TOTAL_LEVELS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { AudioManager } from '../managers/AudioManager';
import { fadeIn, fadeOutAndStart } from '../utils/Effects';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.LevelSelect });
  }

  create(): void {
    fadeIn(this);
    const { width, height } = this.scale;
    const cx = width / 2;

    this.cameras.main.setBackgroundColor('#0d1117');

    this.add
      .text(cx, 36, 'SELECT LEVEL', {
        fontFamily: 'Arial',
        fontSize: '28px',
        fontStyle: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const store = useGameStore.getState();
    const cols = 10;
    const rows = Math.ceil(TOTAL_LEVELS / cols);
    const tileSize = 44;
    const gap = 8;
    const gridW = cols * tileSize + (cols - 1) * gap;
    const gridH = rows * tileSize + (rows - 1) * gap;
    const startX = (width - gridW) / 2 + tileSize / 2;
    const startY = 90 + tileSize / 2;

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
        locked ? 0x2a2a2a : lvl === store.currentLevel ? 0x55cc55 : 0x4488ff,
        1
      );
      bg.setStrokeStyle(1, 0xffffff, locked ? 0.15 : 0.5);
      this.add
        .text(x, y, locked ? '🔒' : `${lvl}`, {
          fontFamily: 'Arial',
          fontSize: locked ? '16px' : '16px',
          fontStyle: 'bold',
          color: '#ffffff',
        })
        .setOrigin(0.5);

      if (!locked) {
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerover', () => bg.setFillStyle(lvl === store.currentLevel ? 0x66dd66 : 0x55a0ff));
        bg.on('pointerout', () =>
          bg.setFillStyle(lvl === store.currentLevel ? 0x55cc55 : 0x4488ff)
        );
        bg.on('pointerup', () => {
          AudioManager.uiTap();
          useGameStore.getState().setCurrentLevel(lvl);
          fadeOutAndStart(this, SCENE_KEYS.Game);
        });
      }
    }

    const backY = startY + gridH + 30;
    const back = this.add
      .text(cx, Math.min(backY, height - 30), '< BACK', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#aaaaaa',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    back.on('pointerover', () => back.setColor('#ffffff'));
    back.on('pointerout', () => back.setColor('#aaaaaa'));
    back.on('pointerup', () => {
      AudioManager.uiTap();
      fadeOutAndStart(this, SCENE_KEYS.Menu);
    });
  }
}
