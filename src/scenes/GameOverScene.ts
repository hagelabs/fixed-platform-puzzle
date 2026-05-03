import Phaser from 'phaser';
import { SCENE_KEYS, TOTAL_LEVELS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { AudioManager } from '../managers/AudioManager';
import { AdManager } from '../managers/AdManager';
import { confetti, fadeIn, fadeOutAndStart } from '../utils/Effects';

interface GameOverData {
  result: 'WIN' | 'STUCK';
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
    const store = useGameStore.getState();

    this.cameras.main.setBackgroundColor('#0d1117');
    if (win) confetti(this);

    this.add.rectangle(cx, cy, width, height, 0x000000, 0.55);

    this.add
      .text(cx, cy - 160, win ? 'LEVEL COMPLETE!' : 'STUCK!', {
        fontFamily: 'Arial',
        fontSize: '40px',
        fontStyle: 'bold',
        color: win ? '#55cc55' : '#ff5555',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy - 110, `Level ${store.currentLevel} · Moves ${store.movesThisLevel}`, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#cccccc',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy - 80, `Total Score: ${store.totalScore}`, {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#888888',
      })
      .setOrigin(0.5);

    if (win && store.currentLevel < TOTAL_LEVELS) {
      this.makeButton(cx, cy - 20, 'NEXT LEVEL', () => {
        useGameStore.getState().setCurrentLevel(store.currentLevel + 1);
        fadeOutAndStart(this, SCENE_KEYS.Game);
      });
    } else if (win) {
      this.add
        .text(cx, cy - 20, '🏆 ALL LEVELS DONE 🏆', {
          fontFamily: 'Arial',
          fontSize: '20px',
          fontStyle: 'bold',
          color: '#ffcc44',
        })
        .setOrigin(0.5);
    } else {
      this.makeButton(cx, cy - 20, '▶ CONTINUE (AD)', async () => {
        const ok = await AdManager.showRewarded('continue');
        if (ok) fadeOutAndStart(this, SCENE_KEYS.Game);
      });
    }

    this.makeButton(cx, cy + 44, 'RETRY', () => {
      fadeOutAndStart(this, SCENE_KEYS.Game);
    });

    this.makeButton(cx, cy + 108, 'MAIN MENU', () => {
      fadeOutAndStart(this, SCENE_KEYS.Menu);
    });
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void): void {
    const bg = this.add.rectangle(x, y, 260, 50, 0x4488ff).setStrokeStyle(2, 0xffffff, 0.6);
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
