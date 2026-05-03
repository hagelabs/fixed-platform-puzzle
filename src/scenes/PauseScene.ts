import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { AudioManager } from '../managers/AudioManager';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.Pause });
  }

  create(): void {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this.add.rectangle(cx, cy, width, height, 0x000000, 0.65);

    this.add
      .text(cx, cy - 240, 'PAUSED', {
        fontFamily: 'Arial',
        fontSize: '64px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.makeButton(cx, cy - 80, 'RESUME', () => {
      this.scene.resume(SCENE_KEYS.Game);
      this.scene.stop();
    });

    const audioLabel = () =>
      `AUDIO: ${useGameStore.getState().audioEnabled ? 'ON' : 'OFF'}`;
    const muteBtn = this.makeButton(cx, cy + 20, audioLabel(), () => {
      useGameStore.getState().toggleAudio();
      muteBtn.setText(audioLabel());
    });

    this.makeButton(cx, cy + 120, 'RESTART LEVEL', () => {
      this.scene.stop(SCENE_KEYS.Game);
      this.scene.stop();
      this.scene.start(SCENE_KEYS.Game);
    });

    this.makeButton(cx, cy + 220, 'MAIN MENU', () => {
      this.scene.stop(SCENE_KEYS.Game);
      this.scene.stop();
      this.scene.start(SCENE_KEYS.Menu);
    });
  }

  private makeButton(
    x: number,
    y: number,
    label: string,
    onClick: () => void
  ): Phaser.GameObjects.Text {
    const bg = this.add.rectangle(x, y, 360, 70, 0x4488ff).setStrokeStyle(3, 0xffffff, 0.6);
    const txt = this.add
      .text(x, y, label, {
        fontFamily: 'Arial',
        fontSize: '28px',
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
    return txt;
  }
}
