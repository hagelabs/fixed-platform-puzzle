import Phaser from 'phaser';
import { TOKENS, FONT_NEO } from './Theme';
import { Direction } from '../types/Game';
import { Block } from '../entities/Block';
import { Grid } from '../entities/Grid';

export interface LevelTutorialConfig {
  title: string;
  message: string;
  highlightBlockId: string;
  hintDir: Direction;
}

export class LevelTutorial {
  private scene: Phaser.Scene;
  private bubble?: Phaser.GameObjects.Container;
  private highlightContainer?: Phaser.GameObjects.Container;
  private arrowContainer?: Phaser.GameObjects.Container;
  private dismissed = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(cfg: LevelTutorialConfig, blocks: Block[], grid: Grid): void {
    this.drawBubble(cfg.title, cfg.message);
    const block = blocks.find((b) => b.blockId === cfg.highlightBlockId);
    if (block) {
      this.drawHighlight(block, grid);
      this.drawGhostArrow(block, cfg.hintDir);
    }
  }

  dismiss(): void {
    if (this.dismissed) return;
    this.dismissed = true;
    const targets = [this.bubble, this.highlightContainer, this.arrowContainer].filter(
      Boolean,
    ) as Phaser.GameObjects.Container[];
    if (targets.length === 0) return;
    this.scene.tweens.add({
      targets,
      alpha: 0,
      duration: 220,
      ease: 'Sine.easeOut',
      onComplete: () => targets.forEach((c) => c.destroy()),
    });
    this.bubble = undefined;
    this.highlightContainer = undefined;
    this.arrowContainer = undefined;
  }

  destroy(): void {
    this.bubble?.destroy();
    this.highlightContainer?.destroy();
    this.arrowContainer?.destroy();
    this.bubble = undefined;
    this.highlightContainer = undefined;
    this.arrowContainer = undefined;
    this.dismissed = true;
  }

  private drawBubble(title: string, message: string): void {
    const w = 1040;
    const h = 138;
    const g = this.scene.add.graphics();
    const cornerR = TOKENS.cornerR;
    const shadow = TOKENS.shadowOffset;
    const border = TOKENS.borderPx;
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(-w / 2 + shadow, -h / 2 + shadow, w, h, cornerR);
    g.fillStyle(TOKENS.ink, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, cornerR);
    g.fillStyle(TOKENS.white, 1);
    g.fillRoundedRect(-w / 2 + border, -h / 2 + border, w - border * 2, h - border * 2, cornerR - 2);

    const titleTxt = this.scene.add
      .text(0, -22, title, {
        fontFamily: FONT_NEO,
        fontSize: '24px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5);

    const bodyTxt = this.scene.add
      .text(0, 14, message, {
        fontFamily: FONT_NEO,
        fontSize: '20px',
        color: TOKENS.inkHex,
        align: 'center',
        wordWrap: { width: w - 64 },
      })
      .setOrigin(0.5)
      .setAlpha(0.85);

    const c = this.scene.add.container(this.scene.scale.width / 2, 200, [g, titleTxt, bodyTxt]);
    c.setDepth(110);
    c.setAlpha(0);
    this.scene.tweens.add({
      targets: c,
      alpha: 1,
      y: 200,
      duration: 260,
      ease: 'Sine.easeOut',
    });
    this.bubble = c;
  }

  private drawHighlight(block: Block, grid: Grid): void {
    const g = this.scene.add.graphics();
    g.lineStyle(8, TOKENS.exitGlow, 1);
    const halfW = block.size[0] * (grid.cellSize / 2);
    const halfH = block.size[1] * (grid.cellSize / 2);
    g.strokeRoundedRect(-halfW - 6, -halfH - 6, halfW * 2 + 12, halfH * 2 + 12, 14);
    const c = this.scene.add.container(block.x, block.y, [g]);
    c.setDepth(50);
    this.scene.tweens.add({
      targets: c,
      scale: { from: 1, to: 1.1 },
      alpha: { from: 1, to: 0.4 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.highlightContainer = c;
  }

  private drawGhostArrow(block: Block, dir: Direction): void {
    const len = 108;
    const dx = dir === 'RIGHT' ? len : dir === 'LEFT' ? -len : 0;
    const dy = dir === 'DOWN' ? len : dir === 'UP' ? -len : 0;
    const sx = block.x;
    const sy = block.y;
    const ex = sx + dx;
    const ey = sy + dy;

    const g = this.scene.add.graphics();
    g.lineStyle(10, TOKENS.ink, 1);
    g.beginPath();
    g.moveTo(sx, sy);
    g.lineTo(ex, ey);
    g.strokePath();

    g.fillStyle(TOKENS.yellow, 1);
    g.lineStyle(6, TOKENS.ink, 1);
    const headLen = 28;
    let p1x = 0, p1y = 0, p2x = 0, p2y = 0, p3x = 0, p3y = 0;
    if (dir === 'RIGHT') {
      p1x = ex; p1y = ey - 18; p2x = ex; p2y = ey + 18; p3x = ex + headLen; p3y = ey;
    } else if (dir === 'LEFT') {
      p1x = ex; p1y = ey - 18; p2x = ex; p2y = ey + 18; p3x = ex - headLen; p3y = ey;
    } else if (dir === 'UP') {
      p1x = ex - 18; p1y = ey; p2x = ex + 18; p2y = ey; p3x = ex; p3y = ey - headLen;
    } else {
      p1x = ex - 18; p1y = ey; p2x = ex + 18; p2y = ey; p3x = ex; p3y = ey + headLen;
    }
    g.fillTriangle(p1x, p1y, p2x, p2y, p3x, p3y);
    g.beginPath();
    g.moveTo(p1x, p1y);
    g.lineTo(p3x, p3y);
    g.lineTo(p2x, p2y);
    g.strokePath();

    const c = this.scene.add.container(0, 0, [g]);
    c.setDepth(60);
    this.scene.tweens.add({
      targets: c,
      alpha: { from: 0.3, to: 1 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.arrowContainer = c;
  }
}

export const LEVEL_TUTORIALS: Record<number, LevelTutorialConfig> = {
  1: {
    title: 'SLIDE',
    message: 'SWIPE THE BLOCK TOWARD THE GLOWING EXIT.',
    highlightBlockId: 'm1',
    hintDir: 'RIGHT',
  },
  3: {
    title: 'CONSTRAINED',
    message: 'YELLOW BLOCKS ONLY EXIT IN THE ARROW DIRECTION. SWIPE THAT WAY.',
    highlightBlockId: 'm1',
    hintDir: 'LEFT',
  },
  5: {
    title: 'DEPENDENCY',
    message: 'BLUE UNLOCKS AFTER ITS PARTNER LEAVES. SLIDE THE RED ONE OUT FIRST.',
    highlightBlockId: 'm1',
    hintDir: 'RIGHT',
  },
};
