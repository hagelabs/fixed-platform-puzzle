import Phaser from 'phaser';
import { SCENE_KEYS, TOTAL_LEVELS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';

interface GameOverData {
  result: 'WIN' | 'STUCK';
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GameOver });
  }

  create(data: GameOverData): void {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;
    const win = data.result === 'WIN';
    const store = useGameStore.getState();

    this.cameras.main.setBackgroundColor('#1a1a1a');

    this.add.rectangle(cx, cy, width, height, 0x000000, 0.5);

    this.add
      .text(cx, cy - 240, win ? 'LEVEL COMPLETE!' : 'STUCK!', {
        fontFamily: 'Arial',
        fontSize: '64px',
        color: win ? '#55cc55' : '#ff5555',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy - 140, `Level ${store.currentLevel} · Moves ${store.movesThisLevel}`, {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#cccccc',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy - 90, `Total Score: ${store.totalScore}`, {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#888888',
      })
      .setOrigin(0.5);

    if (win && store.currentLevel < TOTAL_LEVELS) {
      this.makeButton(cx, cy + 20, 'NEXT LEVEL', () => {
        useGameStore.getState().setCurrentLevel(store.currentLevel + 1);
        this.scene.start(SCENE_KEYS.Game);
      });
    } else if (win) {
      this.add
        .text(cx, cy + 20, '🏆 ALL LEVELS DONE 🏆', {
          fontFamily: 'Arial',
          fontSize: '32px',
          color: '#ffcc44',
        })
        .setOrigin(0.5);
    }

    this.makeButton(cx, cy + 120, 'RETRY', () => {
      this.scene.start(SCENE_KEYS.Game);
    });

    this.makeButton(cx, cy + 220, 'MAIN MENU', () => {
      this.scene.start(SCENE_KEYS.Menu);
    });
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void): void {
    const bg = this.add.rectangle(x, y, 360, 70, 0x4488ff).setStrokeStyle(3, 0xffffff, 0.6);
    this.add
      .text(x, y, label, {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => bg.setFillStyle(0x55a0ff));
    bg.on('pointerout', () => bg.setFillStyle(0x4488ff));
    bg.on('pointerup', onClick);
  }
}
