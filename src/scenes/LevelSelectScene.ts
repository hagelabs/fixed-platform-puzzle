import Phaser from 'phaser';
import { SCENE_KEYS, TOTAL_LEVELS, FONT_HEADER } from '../config/Constants';
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
      .text(cx, 26, 'SELECT LEVEL', {
        fontFamily: FONT_HEADER,
        fontSize: '22px',
        color: '#ffcc44',
      })
      .setOrigin(0.5);

    const store = useGameStore.getState();
    this.add
      .text(cx, 50, `★ ${store.totalStars()} / ${TOTAL_LEVELS * 3}`, {
        fontFamily: 'Arial',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ffcc44',
      })
      .setOrigin(0.5);

    const cols = 10;
    const rows = Math.ceil(TOTAL_LEVELS / cols);
    const tileSize = 60;
    const starRowH = 20;
    const cellH = tileSize + starRowH;
    const gapX = 8;
    const gapY = 12;
    const gridW = cols * tileSize + (cols - 1) * gapX;
    const gridH = rows * cellH + (rows - 1) * gapY;
    const startX = (width - gridW) / 2 + tileSize / 2;
    const startY = 80 + tileSize / 2;

    for (let i = 0; i < TOTAL_LEVELS; i++) {
      const lvl = i + 1;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (tileSize + gapX);
      const ty = startY + row * (cellH + gapY);
      const sy = ty + tileSize / 2 + 12;
      const locked = lvl > store.unlockedLevel;
      const stars = store.starsByLevel[lvl] ?? 0;

      const bg = this.add.rectangle(
        x,
        ty,
        tileSize,
        tileSize,
        locked ? 0x2a2a2a : lvl === store.currentLevel ? 0x55cc55 : 0x4488ff,
        1
      );
      bg.setStrokeStyle(2, 0xffffff, locked ? 0.15 : 0.5);
      this.add
        .text(x, ty, locked ? '🔒' : `${lvl}`, {
          fontFamily: 'Arial',
          fontSize: locked ? '20px' : '22px',
          fontStyle: 'bold',
          color: '#ffffff',
        })
        .setOrigin(0.5);

      if (!locked) {
        const starGap = 14;
        for (let s = 0; s < 3; s++) {
          const filled = s < stars;
          this.add
            .text(x - starGap + s * starGap, sy, '★', {
              fontFamily: 'Arial',
              fontSize: '16px',
              color: filled ? '#ffcc44' : '#3a3a3a',
            })
            .setOrigin(0.5);
        }
      }

      if (!locked) {
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerover', () =>
          bg.setFillStyle(lvl === store.currentLevel ? 0x66dd66 : 0x55a0ff)
        );
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

    const backY = Math.min(80 + gridH + 24, height - 18);
    const back = this.add
      .text(cx, backY, '< BACK', {
        fontFamily: 'Arial',
        fontSize: '18px',
        fontStyle: 'bold',
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
