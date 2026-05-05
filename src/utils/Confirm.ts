import Phaser from 'phaser';
import { TOKENS, FONT_NEO, neoButton } from '../ui/Theme';

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

  const dim = scene.add.rectangle(cx, cy, width, height, TOKENS.ink, 0.45);
  dim.setInteractive();
  layer.add(dim);

  const dialogW = 440;
  const dialogH = 240;
  const cornerR = TOKENS.cornerR;
  const shadow = TOKENS.shadowOffset;
  const border = TOKENS.borderPx;

  const g = scene.add.graphics();
  g.fillStyle(TOKENS.ink, 1);
  g.fillRoundedRect(cx - dialogW / 2 + shadow, cy - dialogH / 2 + shadow, dialogW, dialogH, cornerR);
  g.fillStyle(TOKENS.ink, 1);
  g.fillRoundedRect(cx - dialogW / 2, cy - dialogH / 2, dialogW, dialogH, cornerR);
  g.fillStyle(TOKENS.cream, 1);
  g.fillRoundedRect(
    cx - dialogW / 2 + border,
    cy - dialogH / 2 + border,
    dialogW - border * 2,
    dialogH - border * 2,
    cornerR - 2,
  );
  layer.add(g);

  const titleTxt = scene.add
    .text(cx, cy - 70, opts.title, {
      fontFamily: FONT_NEO,
      fontSize: '24px',
      color: TOKENS.inkHex,
    })
    .setOrigin(0.5);
  layer.add(titleTxt);

  const bodyTxt = scene.add
    .text(cx, cy - 16, opts.body, {
      fontFamily: FONT_NEO,
      fontSize: '13px',
      color: TOKENS.inkHex,
      align: 'center',
      wordWrap: { width: dialogW - 36 },
    })
    .setOrigin(0.5)
    .setAlpha(0.7);
  layer.add(bodyTxt);

  const close = (run?: () => void) => {
    layer.destroy();
    run?.();
  };

  const yes = neoButton(
    scene,
    cx - 100,
    cy + 64,
    160,
    50,
    opts.yesLabel ?? 'YES',
    opts.yesColor ?? TOKENS.danger,
    () => close(opts.onYes),
    { textSize: 16 },
  );
  layer.add(yes.container);

  const no = neoButton(
    scene,
    cx + 100,
    cy + 64,
    160,
    50,
    opts.noLabel ?? 'CANCEL',
    TOKENS.sky,
    () => close(opts.onNo),
    { textSize: 16 },
  );
  layer.add(no.container);
}
