import Phaser from 'phaser';
import { gameConfig } from './config/GameConfig';
import { SDKManager } from './managers/SDKManager';
import { Analytics } from './managers/AnalyticsManager';

window.addEventListener('load', async () => {
  await SDKManager.init();
  Analytics.log('session_start', { platform: SDKManager.getPlatform() });
  new Phaser.Game(gameConfig);
});
