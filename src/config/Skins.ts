import Phaser from 'phaser';
import { useGameStore } from '../managers/GameStateManager';
import { PACKS } from './Levels';

export type SkinId = 'default' | 'gradient' | 'outline' | 'glow' | 'striped';

export interface Skin {
  id: SkinId;
  name: string;
  description: string;
  unlock: { tag: 'pack-clear' | 'streak' | 'always'; packId?: string; streak?: number };
}

export const SKINS: Skin[] = [
  { id: 'default',  name: 'Classic',  description: 'Solid color.',           unlock: { tag: 'always' } },
  { id: 'gradient', name: 'Sunset',   description: 'Radial highlight.',      unlock: { tag: 'pack-clear', packId: 'tutorial' } },
  { id: 'outline',  name: 'Bold',     description: 'Thick black border.',    unlock: { tag: 'pack-clear', packId: 'gears' } },
  { id: 'glow',     name: 'Glow',     description: 'Outer halo on blocks.',  unlock: { tag: 'pack-clear', packId: 'stones' } },
  { id: 'striped',  name: 'Sport',    description: 'Diagonal stripes.',      unlock: { tag: 'streak', streak: 7 } },
];

export function getSkin(id: SkinId): Skin {
  return SKINS.find((s) => s.id === id) ?? SKINS[0];
}

export function isSkinUnlocked(id: SkinId): boolean {
  const skin = getSkin(id);
  const store = useGameStore.getState();
  if (skin.unlock.tag === 'always') return true;
  if (skin.unlock.tag === 'streak') return store.streak >= (skin.unlock.streak ?? 999);
  if (skin.unlock.tag === 'pack-clear' && skin.unlock.packId) {
    const pack = PACKS.find((p) => p.id === skin.unlock.packId);
    if (!pack) return false;
    return pack.levelIds.every((lvl) => store.starsFor(lvl) > 0);
  }
  return false;
}

export function unlockProgress(id: SkinId): { current: number; total: number } | null {
  const skin = getSkin(id);
  const store = useGameStore.getState();
  if (skin.unlock.tag === 'always') return null;
  if (skin.unlock.tag === 'streak') return { current: Math.min(store.streak, skin.unlock.streak ?? 0), total: skin.unlock.streak ?? 0 };
  if (skin.unlock.tag === 'pack-clear' && skin.unlock.packId) {
    const pack = PACKS.find((p) => p.id === skin.unlock.packId);
    if (!pack) return null;
    const cleared = pack.levelIds.filter((lvl) => store.starsFor(lvl) > 0).length;
    return { current: cleared, total: pack.levelIds.length };
  }
  return null;
}

// Render skin layer on top of body fill. Called by Block.applySkin().
// (x,y,w,h) is the colored inner rect (already filled with base color).
export function drawSkinOverlay(
  g: Phaser.GameObjects.Graphics,
  id: SkinId,
  w: number,
  h: number,
  cornerR: number,
  baseColor: number,
): void {
  if (id === 'default') return;
  if (id === 'gradient') {
    const cx = -w * 0.18;
    const cy = -h * 0.18;
    const r = Math.max(w, h) * 0.55;
    g.fillStyle(0xFFFFFF, 0.32);
    g.fillCircle(cx, cy, r * 0.6);
    g.fillStyle(0xFFFFFF, 0.16);
    g.fillCircle(cx, cy, r);
    return;
  }
  if (id === 'outline') {
    g.lineStyle(8, 0x222222, 1);
    g.strokeRoundedRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, Math.max(0, cornerR - 2));
    return;
  }
  if (id === 'glow') {
    for (let i = 6; i > 0; i--) {
      g.fillStyle(baseColor, 0.08);
      const inset = -i * 3;
      g.fillRoundedRect(-w / 2 + inset, -h / 2 + inset, w - inset * 2, h - inset * 2, cornerR);
    }
    return;
  }
  if (id === 'striped') {
    g.lineStyle(4, 0xFFFFFF, 0.45);
    const span = Math.max(w, h);
    for (let off = -span; off <= span; off += 14) {
      const x1 = -w / 2 + off;
      const y1 = -h / 2;
      const x2 = x1 + h;
      const y2 = h / 2;
      const cx1 = Math.max(-w / 2 + 4, Math.min(w / 2 - 4, x1));
      const cy1 = -h / 2 + (cx1 - x1);
      const cx2 = Math.max(-w / 2 + 4, Math.min(w / 2 - 4, x2));
      const cy2 = -h / 2 + (cx2 - x1);
      g.beginPath();
      g.moveTo(cx1, cy1);
      g.lineTo(cx2, cy2);
      g.strokePath();
    }
    return;
  }
}
