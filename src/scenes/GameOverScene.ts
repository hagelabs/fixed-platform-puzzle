import Phaser from 'phaser';
import { SCENE_KEYS, TOTAL_LEVELS, FONT_HEADER } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { AudioManager } from '../managers/AudioManager';
import { AdManager } from '../managers/AdManager';
import { confetti, fadeIn, fadeOutAndStart } from '../utils/Effects';

interface GameOverData {
  result: 'WIN' | 'STUCK';
  stars?: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GameOver });
  }

  create(data: GameOverData): void {
    fadeIn(this);
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;
    const win = data.result === 'WIN';
    const stars = data.stars ?? 0;
    const store = useGameStore.getState();

    this.cameras.main.setBackgroundColor('#0d1117');
    if (win) confetti(this);

    this.add.rectangle(cx, cy, width, height, 0x000000, 0.55);

    this.add
      .text(cx, cy - 200, win ? 'LEVEL COMPLETE!' : 'STUCK!', {
        fontFamily: FONT_HEADER,
        fontSize: '38px',
        color: win ? '#55cc55' : '#ff5555',
      })
      .setOrigin(0.5);

    if (win) {
      this.drawStars(cx, cy - 130, stars);
    } else {
      this.add
        .text(cx, cy - 130, 'No more moves available', {
          fontFamily: 'Arial',
          fontSize: '14px',
          color: '#aaaaaa',
        })
        .setOrigin(0.5);
    }

    this.add
      .text(cx, cy - 70, `Level ${store.currentLevel} · Moves ${store.movesThisLevel}`, {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#cccccc',
      })
      .setOrigin(0.5);

    if (win && store.currentLevel < TOTAL_LEVELS) {
      this.makeButton(cx, cy - 10, 'NEXT LEVEL', () => {
        useGameStore.getState().setCurrentLevel(store.currentLevel + 1);
        fadeOutAndStart(this, SCENE_KEYS.Game);
      });
    } else if (win) {
      this.add
        .text(cx, cy - 10, '🏆 ALL LEVELS DONE 🏆', {
          fontFamily: FONT_HEADER,
          fontSize: '20px',
          color: '#ffcc44',
        })
        .setOrigin(0.5);
    } else {
      let busy = false;
      this.makeButton(cx, cy - 10, '▶ CONTINUE (AD)', async () => {
        if (busy) return;
        busy = true;
        try {
          const ok = await AdManager.showRewarded('continue');
          if (ok) fadeOutAndStart(this, SCENE_KEYS.Game);
        } finally {
          busy = false;
        }
      });
    }

    this.makeButton(cx, cy + 54, 'RETRY', () => {
      fadeOutAndStart(this, SCENE_KEYS.Game);
    });

    this.makeButton(cx, cy + 118, 'MAIN MENU', () => {
      fadeOutAndStart(this, SCENE_KEYS.Menu);
    });
  }

  private drawStars(x: number, y: number, count: number): void {
    const gap = 50;
    for (let i = 0; i < 3; i++) {
      const filled = i < count;
      this.add
        .text(x - gap + i * gap, y, '★', {
          fontFamily: 'Arial',
          fontSize: '40px',
          color: filled ? '#ffcc44' : '#444444',
        })
        .setOrigin(0.5);
    }
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void): void {
    const bg = this.add.rectangle(x, y, 260, 48, 0x4488ff).setStrokeStyle(2, 0xffffff, 0.6);
    this.add
      .text(x, y, label, {
        fontFamily: 'Arial',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => bg.setFillStyle(0x55a0ff));
    bg.on('pointerout', () => bg.setFillStyle(0x4488ff));
    bg.on('pointerup', () => {
      AudioManager.uiTap();
      onClick();
    });
  }
}
