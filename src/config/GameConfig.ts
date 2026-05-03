import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './Constants';
import { BootScene } from '../scenes/BootScene';
import { MenuScene } from '../scenes/MenuScene';
import { LevelSelectScene } from '../scenes/LevelSelectScene';
import { GameScene } from '../scenes/GameScene';
import { PauseScene } from '../scenes/PauseScene';
import { GameOverScene } from '../scenes/GameOverScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#1a1a1a',
  render: {
    pixelArt: false,
    antialias: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    min: { width: 240, height: 300 },
    max: { width: 1920, height: 2400 },
  },
  scene: [BootScene, MenuScene, LevelSelectScene, GameScene, PauseScene, GameOverScene],
};
