import Phaser from 'phaser';
import { SCENE_KEYS, TOTAL_LEVELS } from '../config/Constants';
import { useGameStore } from '../managers/GameStateManager';
import { AdManager } from '../managers/AdManager';
import { confetti, fadeIn, fadeOutAndStart } from '../utils/Effects';
import { TOKENS, FONT_NEO, neoButton, dottedBackground } from '../ui/Theme';

interface GameOverData {
  result: 'WIN' | 'STUCK';
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GameOver });
  }

  create(data: GameOverData): void {
    fadeIn(this);
    dottedBackground(this);
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;
    const win = data.result === 'WIN';
    const store = useGameStore.getState();

    if (win) confetti(this);

    this.add
      .text(cx, cy - 180, win ? 'CLEARED!' : 'STUCK!', {
        fontFamily: FONT_NEO,
        fontSize: '52px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5);

    this.add
      .text(
        cx,
        cy - 120,
        win ? 'Nice work.' : 'No more moves available',
        {
          fontFamily: FONT_NEO,
          fontSize: '14px',
          color: TOKENS.inkHex,
        },
      )
      .setOrigin(0.5)
      .setAlpha(0.65);

    this.add
      .text(cx, cy - 70, `LEVEL ${store.currentLevel} · ${store.movesThisLevel} MOVES`, {
        fontFamily: FONT_NEO,
        fontSize: '18px',
        color: TOKENS.inkHex,
      })
      .setOrigin(0.5);

    if (win && store.currentLevel < TOTAL_LEVELS) {
      neoButton(this, cx, cy + 10, 280, 60, 'NEXT LEVEL', TOKENS.mint, () => {
        useGameStore.getState().setCurrentLevel(store.currentLevel + 1);
        fadeOutAndStart(this, SCENE_KEYS.Game);
      });
    } else if (win) {
      this.add
        .text(cx, cy + 10, 'ALL LEVELS DONE', {
          fontFamily: FONT_NEO,
          fontSize: '24px',
          color: TOKENS.inkHex,
        })
        .setOrigin(0.5);
    } else {
      let busy = false;
      neoButton(this, cx, cy + 10, 280, 60, 'CONTINUE (AD)', TOKENS.sky, async () => {
        if (busy) return;
        busy = true;
        try {
          const ok = await AdManager.showRewarded('continue');
          if (ok) fadeOutAndStart(this, SCENE_KEYS.Game);
        } finally {
          busy = false;
        }
      });
    }

    neoButton(this, cx, cy + 86, 280, 60, 'RETRY', TOKENS.yellow, () => {
      fadeOutAndStart(this, SCENE_KEYS.Game);
    });

    neoButton(this, cx, cy + 162, 280, 60, 'MAIN MENU', TOKENS.danger, () => {
      fadeOutAndStart(this, SCENE_KEYS.Menu);
    });
  }
}
