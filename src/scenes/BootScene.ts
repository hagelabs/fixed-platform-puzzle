import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/Constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.Boot });
  }

  create(): void {
    this.scene.start(SCENE_KEYS.Menu);
  }
}
