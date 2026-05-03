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

function patchTextResolution(): void {
  const dpr = window.devicePixelRatio || 1;
  // Phaser Text rasterizes glyphs to its own texture at resolution=1 by default.
  // When parent canvas is upscaled, text becomes blurry. Override factory to
  // set high resolution on every text object created via scene.add.text().
  const factoryProto = (Phaser.GameObjects as unknown as {
    GameObjectFactory: { prototype: Record<string, unknown> };
  }).GameObjectFactory?.prototype;
  if (!factoryProto) return;
  const origText = factoryProto.text as unknown as (
    x: number,
    y: number,
    text: string | string[],
    style?: object
  ) => Phaser.GameObjects.Text;
  if (!origText) return;
  const targetRes = Math.min(4, dpr * 2);
  factoryProto.text = function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    text: string | string[],
    style?: object
  ): Phaser.GameObjects.Text {
    const t = origText.call(this, x, y, text, style);
    t.setResolution(targetRes);
    return t;
  } as typeof factoryProto.text;
}

window.addEventListener('load', async () => {
  patchTextResolution();
  await Promise.all([SDKManager.init(), waitForFonts()]);
  Analytics.log('session_start', { platform: SDKManager.getPlatform() });
  new Phaser.Game(gameConfig);
});
