import { LevelData, BlockData, Color } from '../types/Game';
import { TOTAL_LEVELS } from './Constants';

const COLOR_POOL: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

function rng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function generateLevel(id: number): LevelData {
  const rand = rng(id * 9301 + 49297);
  const cols = id <= 15 ? 5 : id <= 35 ? 6 : 7;
  const rows = cols;

  const targetBlocks = Math.min(cols * rows - 4, 4 + Math.floor(id * 0.35));
  const occupied: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );
  const blocks: BlockData[] = [];

  let attempts = 0;
  while (blocks.length < targetBlocks && attempts < 200) {
    attempts++;
    const horiz = rand() > 0.55;
    const long = id > 10 && rand() > 0.65;
    const w = horiz ? (long ? 2 : 1) : 1;
    const h = !horiz ? (long ? 2 : 1) : 1;

    const x = Math.floor(rand() * (cols - w + 1));
    const y = Math.floor(rand() * (rows - h + 1));

    let clear = true;
    for (let dx = 0; dx < w && clear; dx++) {
      for (let dy = 0; dy < h && clear; dy++) {
        if (occupied[y + dy][x + dx]) clear = false;
      }
    }
    if (!clear) continue;

    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        occupied[y + dy][x + dx] = true;
      }
    }

    const colorCount = id <= 5 ? 2 : id <= 20 ? 3 : id <= 40 ? 4 : 6;
    const color = COLOR_POOL[Math.floor(rand() * colorCount)];

    blocks.push({
      id: `b${blocks.length}`,
      color,
      position: [x, y],
      size: [w, h],
    });
  }

  return { id, cols, rows, blocks };
}

export const LEVELS: LevelData[] = Array.from({ length: TOTAL_LEVELS }, (_, i) =>
  generateLevel(i + 1)
);

export function getLevel(id: number): LevelData {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, id - 1))];
}
