import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.Menu });
  }

  create(): void {
    const { width, height } = this.scale;
    const cx = width / 2;

    this.cameras.main.setBackgroundColor('#1a1a1a');

    this.add
      .text(cx, height * 0.18, 'Fixed Platform Puzzle', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '64px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, height * 0.25, 'Drag blocks off the board', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#888888',
      })
      .setOrigin(0.5);

    const store = useGameStore.getState();

    this.makeButton(cx, height * 0.45, 'PLAY', () => {
      useGameStore.getState().setCurrentLevel(store.unlockedLevel);
      this.scene.start(SCENE_KEYS.Game);
    });

    this.makeButton(cx, height * 0.55, 'LEVEL SELECT', () => {
      this.scene.start(SCENE_KEYS.LevelSelect);
    });

    if (store.unlockedLevel > 1) {
      this.makeButton(cx, height * 0.65, 'RESET PROGRESS', () => {
        useGameStore.getState().resetProgress();
        this.scene.restart();
      });
    }

    this.add
      .text(cx, height - 60, `Unlocked: Level ${store.unlockedLevel} · Score ${store.totalScore}`, {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#666666',
      })
      .setOrigin(0.5);
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void): void {
    const w = 360;
    const h = 80;
    const bg = this.add.rectangle(x, y, w, h, 0x4488ff).setStrokeStyle(3, 0xffffff, 0.6);
    const txt = this.add
      .text(x, y, label, {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => bg.setFillStyle(0x55a0ff));
    bg.on('pointerout', () => bg.setFillStyle(0x4488ff));
    bg.on('pointerdown', () => {
      txt.setScale(0.95);
      bg.setScale(0.97);
    });
    bg.on('pointerup', () => {
      txt.setScale(1);
      bg.setScale(1);
      onClick();
    });
  }
}
