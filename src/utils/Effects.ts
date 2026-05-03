import Phaser from 'phaser';

export function burstParticles(
  scene: Phaser.Scene,
  x: number,
  y: number,
  color: number,
  count = 14
): void {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const speed = 120 + Math.random() * 180;
    const size = 6 + Math.random() * 8;
    const p = scene.add.rectangle(x, y, size, size, color);
    p.setAlpha(0.95);
    scene.tweens.add({
      targets: p,
      x: x + Math.cos(angle) * speed,
      y: y + Math.sin(angle) * speed,
      alpha: 0,
      angle: Math.random() * 360,
      scale: 0.3,
      duration: 500 + Math.random() * 250,
      ease: 'Cubic.easeOut',
      onComplete: () => p.destroy(),
    });
  }
}

const CONFETTI_COLORS = [0xff5555, 0x4488ff, 0x55cc55, 0xffcc44, 0xaa55ff, 0xff8844];

export function confetti(scene: Phaser.Scene, durationMs = 1800): void {
  const { width, height } = scene.scale;
  const launches = 60;
  for (let i = 0; i < launches; i++) {
    const delay = (durationMs * i) / launches;
    scene.time.delayedCall(delay, () => {
      const x = Math.random() * width;
      const c = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const w = 8 + Math.random() * 8;
      const h = 14 + Math.random() * 10;
      const p = scene.add.rectangle(x, -20, w, h, c).setAngle(Math.random() * 360);
      scene.tweens.add({
        targets: p,
        y: height + 40,
        x: x + (Math.random() - 0.5) * 200,
        angle: p.angle + 360 * (Math.random() > 0.5 ? 1 : -1),
        duration: 1400 + Math.random() * 1100,
        ease: 'Sine.easeIn',
        onComplete: () => p.destroy(),
      });
    });
  }
}

export function fadeIn(scene: Phaser.Scene, ms = 250): void {
  scene.cameras.main.fadeIn(ms, 0, 0, 0);
}

export function fadeOutAndStart(
  scene: Phaser.Scene,
  nextKey: string,
  data?: object,
  ms = 250
): void {
  scene.cameras.main.fadeOut(ms, 0, 0, 0);
  scene.cameras.main.once('camerafadeoutcomplete', () => {
    scene.scene.start(nextKey, data);
  });
}
