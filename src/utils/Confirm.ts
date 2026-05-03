import Phaser from 'phaser';
import { FONT_HEADER } from '../config/Constants';
import { AudioManager } from '../managers/AudioManager';

export interface ConfirmOptions {
  title: string;
  body: string;
  yesLabel?: string;
  noLabel?: string;
  yesColor?: number;
  onYes: () => void;
  onNo?: () => void;
}

export function showConfirm(scene: Phaser.Scene, opts: ConfirmOptions): void {
  const { width, height } = scene.scale;
  const cx = width / 2;
  const cy = height / 2;

  const layer = scene.add.container(0, 0).setDepth(1000);

  const dim = scene.add.rectangle(cx, cy, width, height, 0x000000, 0.7);
  dim.setInteractive();
  layer.add(dim);

  const dialogW = 420;
  const dialogH = 220;
  const panel = scene.add.rectangle(cx, cy, dialogW, dialogH, 0x1a1f2e);
  panel.setStrokeStyle(2, 0xffcc44, 0.9);
  layer.add(panel);

  const titleTxt = scene.add
    .text(cx, cy - 70, opts.title, {
      fontFamily: FONT_HEADER,
      fontSize: '24px',
      color: '#ffcc44',
    })
    .setOrigin(0.5);
  layer.add(titleTxt);

  const bodyTxt = scene.add
    .text(cx, cy - 20, opts.body, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#cccccc',
      align: 'center',
      wordWrap: { width: dialogW - 32 },
    })
    .setOrigin(0.5);
  layer.add(bodyTxt);

  const close = (run?: () => void) => {
    layer.destroy();
    run?.();
  };

  const yesBg = scene.add.rectangle(cx - 100, cy + 60, 160, 48, opts.yesColor ?? 0xff5555);
  yesBg.setStrokeStyle(2, 0xffffff, 0.6);
  const yesTxt = scene.add
    .text(cx - 100, cy + 60, opts.yesLabel ?? 'YES', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    })
    .setOrigin(0.5);
  yesBg.setInteractive({ useHandCursor: true });
  yesBg.on('pointerover', () => yesBg.setFillStyle((opts.yesColor ?? 0xff5555) + 0x101010));
  yesBg.on('pointerout', () => yesBg.setFillStyle(opts.yesColor ?? 0xff5555));
  yesBg.on('pointerup', () => {
    AudioManager.uiTap();
    close(opts.onYes);
  });
  layer.add([yesBg, yesTxt]);

  const noBg = scene.add.rectangle(cx + 100, cy + 60, 160, 48, 0x4488ff);
  noBg.setStrokeStyle(2, 0xffffff, 0.6);
  const noTxt = scene.add
    .text(cx + 100, cy + 60, opts.noLabel ?? 'CANCEL', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    })
    .setOrigin(0.5);
  noBg.setInteractive({ useHandCursor: true });
  noBg.on('pointerover', () => noBg.setFillStyle(0x55a0ff));
  noBg.on('pointerout', () => noBg.setFillStyle(0x4488ff));
  noBg.on('pointerup', () => {
    AudioManager.uiTap();
    close(opts.onNo);
  });
  layer.add([noBg, noTxt]);
}
