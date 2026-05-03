import Phaser from 'phaser';
import { gameConfig } from './config/GameConfig';
import { SDKManager } from './managers/SDKManager';
import { Analytics } from './managers/AnalyticsManager';

async function waitForFonts(): Promise<void> {
  if (!('fonts' in document)) return;
  try {
    await document.fonts.load('700 32px "Bungee"');
    await document.fonts.ready;
  } catch (e) {
    console.warn('[font] Bungee load failed', e);
  }
}

window.addEventListener('load', async () => {
  await Promise.all([SDKManager.init(), waitForFonts()]);
  Analytics.log('session_start', { platform: SDKManager.getPlatform() });
  new Phaser.Game(gameConfig);
});
