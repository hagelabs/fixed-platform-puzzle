import Phaser from 'phaser';
import { SCENE_KEYS, COLORS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { AudioManager } from '../managers/AudioManager';
import { fadeIn, fadeOutAndStart } from '../utils/Effects';
import { SKINS, isSkinUnlocked, unlockProgress, drawSkinOverlay, SkinId } from '../config/Skins';
import { Analytics } from '../managers/AnalyticsManager';
import { TOKENS, FONT_NEO, neoButton, neoPill, dottedBackground, popIn, slideUpIn } from '../ui/Theme';

export class CosmeticsScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.Cosmetics });
  }

  create(): void {
    fadeIn(this);
    dottedBackground(this);
    AudioManager.menuOpen();

    const { width } = this.scale;

    const back = neoPill(this, 120, 100, '<', () => {
      AudioManager.uiTap();
      fadeOutAndStart(this, SCENE_KEYS.Menu);
    }, { w: 140, h: 100, fill: TOKENS.white, textSize: 46 });
    slideUpIn(this, back.container, 60, -20);

    const header = this.add
      .text(width / 2 + 36, 100, 'BLOCK SKINS', {
        fontFamily: FONT_NEO,
        fontSize: '54px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5);
    popIn(this, header, 100);

    const tile = 280;
    const gap = 60;
    const cols = SKINS.length;
    const totalW = cols * tile + (cols - 1) * gap;
    const startX = (width - totalW) / 2 + tile / 2;
    const y = 480;

    SKINS.forEach((skin, i) => {
      const x = startX + i * (tile + gap);
      const unlocked = isSkinUnlocked(skin.id);
      const equipped = useGameStore.getState().equippedSkin === skin.id;

      const card = this.add.container(x, y);

      const cardShadow = this.add.graphics();
      cardShadow.fillStyle(TOKENS.ink, 1);
      cardShadow.fillRoundedRect(-tile / 2 + 6, -tile / 2 + 6, tile, tile, 18);
      const cardBg = this.add.graphics();
      cardBg.fillStyle(TOKENS.ink, 1);
      cardBg.fillRoundedRect(-tile / 2, -tile / 2, tile, tile, 18);
      cardBg.fillStyle(unlocked ? (equipped ? TOKENS.sky : TOKENS.white) : TOKENS.lockGray, 1);
      cardBg.fillRoundedRect(-tile / 2 + 6, -tile / 2 + 6, tile - 12, tile - 12, 16);
      card.add([cardShadow, cardBg]);

      // preview block (uses red as sample color)
      const blockSize = 120;
      const blockG = this.add.graphics();
      const baseColor = COLORS.red;
      const cornerR = 12;
      // base body
      blockG.fillStyle(TOKENS.ink, 1);
      blockG.fillRoundedRect(-blockSize / 2 + 4, -blockSize / 2 + 4, blockSize, blockSize, cornerR);
      blockG.fillStyle(TOKENS.ink, 1);
      blockG.fillRoundedRect(-blockSize / 2, -blockSize / 2, blockSize, blockSize, cornerR);
      blockG.fillStyle(baseColor, 1);
      blockG.fillRoundedRect(-blockSize / 2 + 6, -blockSize / 2 + 6, blockSize - 12, blockSize - 12, cornerR - 2);
      drawSkinOverlay(blockG, skin.id as SkinId, blockSize - 12, blockSize - 12, cornerR - 2, baseColor);
      blockG.setPosition(0, -30);
      if (!unlocked) blockG.setAlpha(0.35);
      card.add(blockG);

      const nameTxt = this.add
        .text(0, 70, skin.name.toUpperCase(), {
          fontFamily: FONT_NEO,
          fontSize: '32px',
          color: TOKENS.inkHex,
        })
        .setOrigin(0.5);
      card.add(nameTxt);

      let footLabel: string;
      if (!unlocked) {
        const prog = unlockProgress(skin.id);
        if (prog) {
          footLabel = `LOCKED · ${prog.current}/${prog.total}`;
        } else {
          footLabel = 'LOCKED';
        }
      } else if (equipped) {
        footLabel = 'EQUIPPED';
      } else {
        footLabel = 'TAP TO EQUIP';
      }
      const footTxt = this.add
        .text(0, 110, footLabel, {
          fontFamily: FONT_NEO,
          fontSize: '22px',
          color: TOKENS.inkHex,
        })
        .setOrigin(0.5)
        .setAlpha(0.75);
      card.add(footTxt);

      card.setSize(tile, tile);
      if (unlocked && !equipped) {
        card.setInteractive(new Phaser.Geom.Rectangle(-tile / 2, -tile / 2, tile, tile), Phaser.Geom.Rectangle.Contains);
        card.on('pointerdown', () => {
          AudioManager.uiTap();
          useGameStore.getState().setEquippedSkin(skin.id);
          Analytics.track('skin_equipped', { skinId: skin.id });
          this.scene.restart();
        });
      }

      card.setScale(0);
      this.tweens.add({
        targets: card,
        scale: 1,
        duration: 320,
        delay: 200 + i * 80,
        ease: 'Back.easeOut',
      });
    });

    const descText = this.add
      .text(width / 2, 760, 'CLEAR PACKS + KEEP YOUR STREAK TO UNLOCK MORE.', {
        fontFamily: FONT_NEO,
        fontSize: '24px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5)
      .setAlpha(0.6);
    this.tweens.add({ targets: descText, alpha: 0.6, duration: 400, delay: 600 });
  }
}
