import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/Constants';
import { useGameStore, todayISO } from '../managers/GameStateManager';
import { AudioManager } from '../managers/AudioManager';
import { fadeIn, fadeOutAndStart, dustPuff } from '../utils/Effects';
import { showConfirm } from '../utils/Confirm';
import { pickDailyLevel } from '../utils/Daily';
import { Analytics } from '../managers/AnalyticsManager';
import {
  TOKENS,
  FONT_NEO,
  neoButton,
  neoPill,
  dottedBackground,
  floatingDecor,
  popIn,
  slideUpIn,
  idlePulse,
} from '../ui/Theme';
import { Direction } from '../types/Game';

interface DemoBlock {
  container: Phaser.GameObjects.Container;
  col: number;
  row: number;
}

export class MenuScene extends Phaser.Scene {
  private demoBlocks: DemoBlock[] = [];
  private demoTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: SCENE_KEYS.Menu });
  }

  create(): void {
    fadeIn(this);
    dottedBackground(this);
    AudioManager.menuOpen();
    this.demoBlocks = [];

    this.spawnAmbientDecor();

    const { width, height } = this.scale;
    const cx = width / 2;
    const titleY = 200;

    const titleTxt = this.add
      .text(cx, titleY, 'KINETIC PUZZLE', {
        fontFamily: FONT_NEO,
        fontSize: '80px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5);
    popIn(this, titleTxt, 80);
    this.tweens.add({
      targets: titleTxt,
      scale: 1.04,
      duration: 1400,
      delay: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const subTxt = this.add
      .text(cx, titleY + 76, 'SLIDE · STACK · ESCAPE', {
        fontFamily: FONT_NEO,
        fontSize: '26px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5)
      .setAlpha(0.55);
    popIn(this, subTxt, 200);

    const store = useGameStore.getState();

    const playBtn = neoButton(this, cx, 460, 500, 116, 'PLAY', TOKENS.mint, () => {
      AudioManager.uiTap();
      useGameStore.getState().setCurrentLevel(store.unlockedLevel);
      this.cleanupDemo();
      fadeOutAndStart(this, SCENE_KEYS.Game);
    });
    slideUpIn(this, playBtn.container, 280);

    const lsBtn = neoButton(this, cx, 600, 500, 116, 'LEVEL SELECT', TOKENS.sky, () => {
      AudioManager.uiTap();
      this.cleanupDemo();
      fadeOutAndStart(this, SCENE_KEYS.LevelSelect);
    });
    slideUpIn(this, lsBtn.container, 360);

    const dailyDone = store.isDailyDoneToday();
    const dailyLabel = dailyDone ? 'DAILY · DONE' : 'DAILY CHALLENGE';
    const dailyBtn = neoButton(
      this,
      cx,
      740,
      500,
      96,
      dailyLabel,
      dailyDone ? TOKENS.lockGray : TOKENS.yellow,
      () => {
        if (useGameStore.getState().isDailyDoneToday()) return;
        AudioManager.uiTap();
        const date = todayISO();
        const levelId = pickDailyLevel(date);
        Analytics.track('daily_started', { date, levelId });
        useGameStore.getState().startDaily(levelId);
        this.cleanupDemo();
        fadeOutAndStart(this, SCENE_KEYS.Game);
      },
      { textSize: 30 },
    );
    if (dailyDone) dailyBtn.setEnabled(false);
    slideUpIn(this, dailyBtn.container, 420);

    this.drawStreakBadge(140, 70, store.streak);

    const skinsBtn = neoPill(
      this,
      width - 430,
      70,
      'SKINS',
      () => {
        AudioManager.uiTap();
        this.cleanupDemo();
        fadeOutAndStart(this, SCENE_KEYS.Cosmetics);
      },
      { w: 200, h: 72, fill: TOKENS.white, textSize: 26 },
    );
    slideUpIn(this, skinsBtn.container, 140, -30);

    if (store.unlockedLevel > 1) {
      const resetBtn = neoButton(
        this,
        cx,
        860,
        360,
        86,
        'RESET',
        TOKENS.danger,
        () => {
          AudioManager.uiTap();
          showConfirm(this, {
            title: 'RESET PROGRESS?',
            body: 'All unlocked levels will be erased. This cannot be undone.',
            yesLabel: 'RESET',
            noLabel: 'CANCEL',
            onYes: () => {
              useGameStore.getState().resetProgress();
              this.scene.restart();
            },
          });
        },
        { textSize: 32 },
      );
      slideUpIn(this, resetBtn.container, 500);
    }

    const audioLabel = () =>
      `SOUND: ${useGameStore.getState().sfxEnabled ? 'ON' : 'OFF'}`;
    const audioBtn = neoPill(
      this,
      width - 150,
      70,
      audioLabel(),
      () => {
        useGameStore.getState().toggleAudio();
        audioBtn.setLabel(audioLabel());
        AudioManager.uiTap();
      },
      { w: 250, h: 72, fill: TOKENS.white, textSize: 26 },
    );
    slideUpIn(this, audioBtn.container, 100, -30);

    this.add
      .text(cx, height - 44, `LEVELS UNLOCKED: ${store.unlockedLevel}`, {
        fontFamily: FONT_NEO,
        fontSize: '22px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5)
      .setAlpha(0.55);

    this.input.on('pointerdown', this.onPointerDown, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off('pointerdown', this.onPointerDown, this);
      this.cleanupDemo();
    });
  }

  private drawStreakBadge(x: number, y: number, streak: number): void {
    if (streak <= 0) return;
    const c = this.add.container(x, y);
    const w = 180;
    const h = 84;
    const shadow = this.add.graphics();
    shadow.fillStyle(TOKENS.ink, 1);
    shadow.fillRoundedRect(-w / 2 + 4, -h / 2 + 4, w, h, 14);
    const pill = this.add.graphics();
    pill.fillStyle(TOKENS.ink, 1);
    pill.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
    pill.fillStyle(0xFF9F1C, 1);
    pill.fillRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 12);
    const flame = this.add
      .text(-w / 2 + 22, 0, '🔥', { fontFamily: FONT_NEO, fontSize: '42px' })
      .setOrigin(0, 0.5);
    const num = this.add
      .text(w / 2 - 18, 0, `${streak}`, { fontFamily: FONT_NEO, fontSize: '40px', color: TOKENS.inkHex })
      .setOrigin(1, 0.5);
    c.add([shadow, pill, flame, num]);
    c.setAlpha(0);
    this.tweens.add({ targets: c, alpha: 1, duration: 320, delay: 160, ease: 'Sine.easeOut' });
    this.tweens.add({
      targets: flame,
      scale: { from: 1, to: 1.12 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 600,
    });
  }

  private spawnAmbientDecor(): void {
    const { width, height } = this.scale;

    const corners: Array<{
      x: number; y: number; size: number; fill: number;
      icon?: 'chevron' | 'chain' | 'cross'; iconDir?: Direction;
    }> = [
      { x: 144, y: 360, size: 90, fill: TOKENS.red },
      { x: width - 144, y: 414, size: 100, fill: TOKENS.yellow, icon: 'chevron', iconDir: 'RIGHT' },
      { x: 108, y: 684, size: 76, fill: TOKENS.blue, icon: 'chain' },
      { x: width - 126, y: 738, size: 86, fill: TOKENS.mint },
      { x: 234, y: 918, size: 68, fill: TOKENS.sky },
      { x: width - 234, y: 936, size: 80, fill: TOKENS.obstacleGray, icon: 'cross' },
      { x: 72, y: height - 108, size: 58, fill: TOKENS.yellow, icon: 'chevron', iconDir: 'UP' },
      { x: width - 72, y: height - 126, size: 64, fill: TOKENS.red },
    ];
    corners.forEach((c, i) => {
      const decor = floatingDecor(this, c.x, c.y, c.size, c.fill, {
        icon: c.icon,
        iconDir: c.iconDir,
        bobAmt: 5 + Math.random() * 5,
        bobDur: 1700 + Math.random() * 900,
      });
      decor.container.setAlpha(0);
      this.tweens.add({
        targets: decor.container,
        alpha: 1,
        duration: 380,
        delay: 60 * i,
        ease: 'Sine.easeOut',
      });
    });

    this.spawnDemoMiniBoard(width - 250, 200);
  }

  private spawnDemoMiniBoard(cx: number, cy: number): void {
    const cols = 3;
    const rows = 1;
    const cell = 50;
    const boardW = cols * cell;
    const boardH = rows * cell;
    const ox = cx - boardW / 2;
    const oy = cy - boardH / 2;

    const g = this.add.graphics();
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(ox - 6 + 3, oy - 6 + 3, boardW + 12, boardH + 12, 8);
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(ox - 6, oy - 6, boardW + 12, boardH + 12, 8);
    g.fillStyle(TOKENS.white, 1);
    g.fillRoundedRect(ox - 4, oy - 4, boardW + 8, boardH + 8, 6);

    const portal = this.add.graphics();
    portal.fillStyle(TOKENS.ink, 1);
    portal.fillRoundedRect(ox + boardW + 2, oy + 4, 6, cell - 8, 2);
    portal.fillStyle(TOKENS.exitGlow, 1);
    portal.fillRoundedRect(ox + boardW + 4, oy + 6, 2, cell - 12, 1);
    this.tweens.add({
      targets: portal,
      alpha: { from: 1, to: 0.6 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    const block = this.makeMiniBlock(ox + cell / 2, oy + cell / 2, cell - 6);
    this.demoBlocks.push({ container: block, col: 0, row: 0 });

    const runDemoCycle = () => {
      block.x = ox + cell / 2;
      block.setAlpha(1);
      block.setScale(1);
      this.tweens.add({
        targets: block,
        x: ox + boardW - cell / 2,
        duration: 700,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          this.tweens.add({
            targets: block,
            scaleX: 1.2,
            scaleY: 0.8,
            duration: 80,
            yoyo: true,
            ease: 'Sine.easeOut',
            onComplete: () => {
              this.tweens.add({
                targets: block,
                x: block.x + 144,
                alpha: 0,
                scale: 0.4,
                duration: 280,
                ease: 'Cubic.easeIn',
              });
            },
          });
        },
      });
    };

    runDemoCycle();
    this.demoTimer = this.time.addEvent({
      delay: 1800,
      loop: true,
      callback: runDemoCycle,
    });
  }

  private makeMiniBlock(x: number, y: number, size: number): Phaser.GameObjects.Container {
    const g = this.add.graphics();
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(-size / 2 + 2, -size / 2 + 2, size, size, 4);
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(-size / 2, -size / 2, size, size, 4);
    g.fillStyle(TOKENS.red, 1);
    g.fillRoundedRect(-size / 2 + 2, -size / 2 + 2, size - 4, size - 4, 3);
    return this.add.container(x, y, [g]);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (pointer.y < 144 || pointer.y > this.scale.height - 90) return;
    dustPuff(this, pointer.x, pointer.y, 'UP', 4);
  }

  private cleanupDemo(): void {
    this.demoTimer?.remove(false);
    this.demoTimer = undefined;
    this.demoBlocks.forEach((b) => b.container.destroy());
    this.demoBlocks = [];
  }

  // suppress unused warning when idlePulse not invoked (kept for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _keepIdlePulse = idlePulse;
}
