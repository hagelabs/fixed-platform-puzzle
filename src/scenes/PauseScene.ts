import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { showConfirm } from '../utils/Confirm';
import { TOKENS, FONT_NEO, neoButton } from '../ui/Theme';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.Pause });
  }

  create(): void {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this.add.rectangle(cx, cy, width, height, TOKENS.cream, 0.92);

    this.add
      .text(cx, cy - 160, 'PAUSED', {
        fontFamily: FONT_NEO,
        fontSize: '40px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5);

    neoButton(this, cx, cy - 70, 280, 60, 'RESUME', TOKENS.mint, () => {
      this.scene.resume(SCENE_KEYS.Game);
      this.scene.stop();
    });

    const audioLabel = () =>
      `SOUND: ${useGameStore.getState().audioEnabled ? 'ON' : 'OFF'}`;
    const muteBtn = neoButton(this, cx, cy + 6, 280, 60, audioLabel(), TOKENS.sky, () => {
      useGameStore.getState().toggleAudio();
      muteBtn.setLabel(audioLabel());
    });

    neoButton(this, cx, cy + 82, 280, 60, 'RESTART', TOKENS.yellow, () => {
      showConfirm(this, {
        title: 'RESTART LEVEL?',
        body: 'Your moves on this level will be lost.',
        yesLabel: 'RESTART',
        noLabel: 'CANCEL',
        onYes: () => {
          this.scene.stop(SCENE_KEYS.Game);
          this.scene.stop();
          this.scene.start(SCENE_KEYS.Game);
        },
      });
    });

    neoButton(this, cx, cy + 158, 280, 60, 'MAIN MENU', TOKENS.danger, () => {
      this.scene.stop(SCENE_KEYS.Game);
      this.scene.stop();
      this.scene.start(SCENE_KEYS.Menu);
    });
  }
}
