import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/Constants';
import { SDKManager } from '../managers/SDKManager';
import { TOKENS } from '../ui/Theme';
import { useGameStore } from '../managers/GameStateManager';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.Boot });
  }

  create(): void {
    SDKManager.loadingFinished();
    this.cameras.main.setBackgroundColor(TOKENS.creamHex);
    this.cameras.main.fadeOut(200, 251, 243, 213);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      const tutorialDone = useGameStore.getState().tutorialDone;
      this.scene.start(tutorialDone ? SCENE_KEYS.Menu : SCENE_KEYS.Tutorial);
    });
  }
}
