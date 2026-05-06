import Phaser from 'phaser';
import { gameConfig } from './config/GameConfig';
import { SDKManager } from './managers/SDKManager';
import { Analytics } from './managers/AnalyticsManager';
import { AudioManager } from './managers/AudioManager';

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

function emitProgress(pct: number, status: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('fpp:progress', { detail: { pct, status } }));
}

function emitReady(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('fpp:ready'));
}

function installAudioUnlock(): void {
  const unlock = (): void => {
    AudioManager.unlock();
  };
  ['pointerdown', 'touchstart', 'keydown'].forEach((ev) => {
    document.addEventListener(ev, unlock, { capture: true, passive: true });
  });
  // Also unlock on visibility-restore so a backgrounded ctx wakes immediately on next gesture.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) AudioManager.unlock();
  });
  (window as unknown as { AudioManager?: typeof AudioManager }).AudioManager = AudioManager;
}

window.addEventListener('load', async () => {
  emitProgress(20, 'Initializing...');
  patchTextResolution();
  installAudioUnlock();

  emitProgress(35, 'Connecting SDK...');
  const sdkPromise = SDKManager.init().then(() => emitProgress(60, 'Loading fonts...'));
  const fontPromise = waitForFonts().then(() => emitProgress(75, 'Preparing assets...'));
  await Promise.all([sdkPromise, fontPromise]);

  emitProgress(90, 'Starting game...');
  Analytics.log('session_start', { platform: SDKManager.getPlatform() });
  const game = new Phaser.Game(gameConfig);

  game.events.once('ready', () => emitReady());
  // Fallback: emit ready when first scene becomes active.
  game.events.once(Phaser.Core.Events.STEP, () => emitReady());
});
