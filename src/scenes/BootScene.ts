import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, 'Fixed Platform Puzzle', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '48px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 80, 'Phase 0 — Boot OK', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#888888',
      })
      .setOrigin(0.5);
  }
}
