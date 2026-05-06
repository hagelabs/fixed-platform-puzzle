import Phaser from 'phaser';
import { SCENE_KEYS, TOTAL_LEVELS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { AudioManager } from '../managers/AudioManager';
import { AdManager } from '../managers/AdManager';
import { SDKManager } from '../managers/SDKManager';
import { fadeIn, fadeOutAndStart } from '../utils/Effects';
import {
  TOKENS,
  FONT_NEO,
  neoButton,
  neoPill,
  dottedBackground,
  drawLockIcon,
  floatingDecor,
  popIn,
  slideUpIn,
  idlePulse,
} from '../ui/Theme';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.LevelSelect });
  }

  create(): void {
    fadeIn(this);
    dottedBackground(this);
    AudioManager.menuOpen();
    this.spawnAmbientDecor();

    const { width, height } = this.scale;

    const back = neoPill(this, 120, 100, '<', () => {
      AudioManager.uiTap();
      fadeOutAndStart(this, SCENE_KEYS.Menu);
    }, { w: 140, h: 100, fill: TOKENS.white, textSize: 46 });
    slideUpIn(this, back.container, 60, -20);

    const allUnlocked = useGameStore.getState().unlockedLevel >= TOTAL_LEVELS;
    if (!allUnlocked && SDKManager.hasRewardedAds()) {
      const unlockBtn = neoButton(
        this,
        width - 260,
        100,
        420,
        86,
        'UNLOCK ALL (AD)',
        TOKENS.yellow,
        async () => {
          AudioManager.uiTap();
          unlockBtn.setEnabled(false);
          unlockBtn.setLabel('LOADING...');
          const ok = await AdManager.showRewarded('unlock_all');
          if (ok) {
            useGameStore.getState().unlockAll();
            this.scene.restart();
          } else {
            unlockBtn.setEnabled(true);
            unlockBtn.setLabel('UNLOCK ALL (AD)');
          }
        },
        { textSize: 28 },
      );
      slideUpIn(this, unlockBtn.container, 100, -20);
    }

    const header = this.add
      .text(width / 2 + 36, 100, 'SELECT LEVEL', {
        fontFamily: FONT_NEO,
        fontSize: '54px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5);
    popIn(this, header, 100);
    this.tweens.add({
      targets: header,
      scale: 1.04,
      duration: 1600,
      delay: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const store = useGameStore.getState();
    const cols = 10;
    const rows = Math.ceil(TOTAL_LEVELS / cols);
    const tile = 100;
    const gapX = 26;
    const gapY = 32;
    const gridW = cols * tile + (cols - 1) * gapX;
    const gridH = rows * tile + (rows - 1) * gapY;
    const startX = (width - gridW) / 2 + tile / 2;
    const startY = 234 + tile / 2;
    const usableY = height - 180;
    const adjStartY = startY + gridH > usableY ? usableY - gridH + tile / 2 : startY;

    for (let i = 0; i < TOTAL_LEVELS; i++) {
      const lvl = i + 1;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (tile + gapX);
      const y = adjStartY + row * (tile + gapY);
      const locked = lvl > store.unlockedLevel;
      const isCurrent = lvl === store.currentLevel;

      const fill = locked ? TOKENS.lockGray : isCurrent ? TOKENS.sky : TOKENS.mint;

      const btn = neoButton(
        this,
        x,
        y,
        tile,
        tile,
        locked ? '' : `${lvl}`,
        fill,
        () => {
          if (locked) return;
          AudioManager.uiTap();
          useGameStore.getState().setCurrentLevel(lvl);
          fadeOutAndStart(this, SCENE_KEYS.Game);
        },
        { textSize: 40, textColor: TOKENS.inkHex },
      );

      btn.container.setScale(0);
      this.tweens.add({
        targets: btn.container,
        scale: 1,
        duration: 320,
        delay: 140 + i * 18,
        ease: 'Back.easeOut',
      });

      if (locked) {
        btn.setEnabled(false);
        btn.container.setAlpha(0.85);
        const lock = drawLockIcon(this, 0, 0, 22, 0x9a9a9a);
        btn.container.add(lock);
      }

      if (isCurrent && !locked) {
        this.time.delayedCall(140 + i * 18 + 320, () => {
          idlePulse(this, btn.container, 1.08, 900);
          const halo = this.add.graphics();
          halo.lineStyle(6, TOKENS.ink, 1);
          halo.strokeCircle(0, 0, tile * 0.85);
          halo.setAlpha(0);
          btn.container.add(halo);
          this.tweens.add({
            targets: halo,
            scale: { from: 0.7, to: 1.4 },
            alpha: { from: 0.55, to: 0 },
            duration: 1100,
            repeat: -1,
            ease: 'Sine.easeOut',
          });
        });
      }

      if (!locked) {
        btn.container.on('pointerover', () => {
          this.tweens.add({
            targets: btn.container,
            angle: { from: -3, to: 3 },
            duration: 120,
            yoyo: true,
            ease: 'Sine.easeInOut',
            onComplete: () => btn.container.setAngle(0),
          });
        });
      }
    }
  }

  private spawnAmbientDecor(): void {
    const { width, height } = this.scale;
    const decor: Array<{
      x: number; y: number; size: number; fill: number;
      icon?: 'chevron' | 'chain' | 'cross';
      iconDir?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
    }> = [
      { x: 54, y: height - 54, size: 50, fill: TOKENS.red },
      { x: width - 54, y: height - 72, size: 58, fill: TOKENS.yellow, icon: 'chevron', iconDir: 'LEFT' },
      { x: 64, y: 200, size: 44, fill: TOKENS.blue, icon: 'chain' },
      { x: width - 64, y: 200, size: 46, fill: TOKENS.mint },
    ];
    decor.forEach((d, i) => {
      const node = floatingDecor(this, d.x, d.y, d.size, d.fill, {
        icon: d.icon,
        iconDir: d.iconDir,
        bobAmt: 4 + Math.random() * 3,
        bobDur: 1900 + Math.random() * 700,
      });
      node.container.setAlpha(0);
      this.tweens.add({
        targets: node.container,
        alpha: 0.85,
        duration: 400,
        delay: 80 * i,
        ease: 'Sine.easeOut',
      });
    });
  }
}
