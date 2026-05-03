import Phaser from 'phaser';
import { SCENE_KEYS, FONT_HEADER } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { AudioManager } from '../managers/AudioManager';
import { fadeIn, fadeOutAndStart } from '../utils/Effects';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.Menu });
  }

  create(): void {
    fadeIn(this);
    const { width, height } = this.scale;
    const cx = width / 2;

    this.cameras.main.setBackgroundColor('#0d1117');

    this.add
      .text(cx, 90, 'Fixed Platform Puzzle', {
        fontFamily: FONT_HEADER,
        fontSize: '40px',
        color: '#ffcc44',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 130, 'Drag blocks off the board', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#9ca3af',
      })
      .setOrigin(0.5);

    const store = useGameStore.getState();

    this.makeButton(cx, 240, 'PLAY', () => {
      useGameStore.getState().setCurrentLevel(store.unlockedLevel);
      fadeOutAndStart(this, SCENE_KEYS.Game);
    });

    this.makeButton(cx, 320, 'LEVEL SELECT', () => {
      fadeOutAndStart(this, SCENE_KEYS.LevelSelect);
    });

    this.makeButton(cx, 400, store.tutorialDone ? 'REPLAY TUTORIAL' : 'HOW TO PLAY', () => {
      useGameStore.getState().setTutorialDone(false);
      useGameStore.getState().setCurrentLevel(1);
      fadeOutAndStart(this, SCENE_KEYS.Game);
    });

    if (store.unlockedLevel > 1) {
      this.makeButton(cx, 480, 'RESET', () => {
        useGameStore.getState().resetProgress();
        this.scene.restart();
      });
    }

    const audioLabel = () =>
      `🔊 ${useGameStore.getState().audioEnabled ? 'ON' : 'OFF'}`;
    const muteTxt = this.add
      .text(width - 16, 16, audioLabel(), {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#cccccc',
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });
    muteTxt.on('pointerup', () => {
      useGameStore.getState().toggleAudio();
      muteTxt.setText(audioLabel());
      AudioManager.uiTap();
    });

    this.add
      .text(cx, height - 24, `Unlocked: Level ${store.unlockedLevel} · Score ${store.totalScore}`, {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#6b7280',
      })
      .setOrigin(0.5);
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void): void {
    const w = 280;
    const h = 56;
    const bg = this.add.rectangle(x, y, w, h, 0x4488ff).setStrokeStyle(2, 0xffffff, 0.6);
    const txt = this.add
      .text(x, y, label, {
        fontFamily: 'Arial',
        fontSize: '20px',
        fontStyle: 'bold',
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
      AudioManager.uiTap();
      onClick();
    });
  }
}
