import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/Constants';
import { SDKManager } from '../managers/SDKManager';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.Boot });
  }

  create(): void {
    SDKManager.loadingFinished();
    this.cameras.main.fadeOut(200, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENE_KEYS.Menu);
    });
  }
}
