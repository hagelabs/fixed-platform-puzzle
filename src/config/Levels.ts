import { LevelData, BlockData, Color, ExitZone, ExitSide } from '../types/Game';
import { TOTAL_LEVELS } from './Constants';

const COLOR_POOL: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const ALL_SIDES: ExitSide[] = ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'];

function rng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function exitTargetCell(e: ExitZone, cols: number, rows: number): [number, number] {
  if (e.side === 'TOP') return [e.index, 0];
  if (e.side === 'BOTTOM') return [e.index, rows - 1];
  if (e.side === 'LEFT') return [0, e.index];
  return [cols - 1, e.index];
}

function estimateOptimal(
  blocks: BlockData[],
  exits: ExitZone[],
  cols: number,
  rows: number,
  obstacleCount: number
): number {
  let sum = 0;
  const simple = blocks.filter((b) => (b.type ?? 'simple') === 'simple');
  for (const b of simple) {
    const allowed = b.allowedExits ?? ALL_SIDES;
    let min = Infinity;
    for (const e of exits) {
      if (!allowed.includes(e.side)) continue;
      const [tx, ty] = exitTargetCell(e, cols, rows);
      const d = Math.abs(b.position[0] - tx) + Math.abs(b.position[1] - ty) + 1;
      if (d < min) min = d;
    }
    if (min === Infinity) min = cols + rows;
    sum += min;
  }
  return Math.max(1, Math.ceil(sum * 1.15) + Math.floor(obstacleCount * 0.6));
}

function generateLevel(id: number): LevelData {
  const rand = rng(id * 9301 + 49297);
  const cols = id <= 10 ? 5 : id <= 25 ? 6 : 7;
  const rows = cols;

  const targetSimple = Math.min(cols * rows - 6, 3 + Math.floor(id * 0.3));
  const targetObstacles =
    id <= 10
      ? 0
      : id <= 20
        ? Math.min(2, 1 + Math.floor((id - 10) * 0.3))
        : Math.min(6, 2 + Math.floor((id - 20) * 0.2));

  const occupied: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const blocks: BlockData[] = [];

  for (let i = 0; i < targetObstacles; i++) {
    let attempts = 0;
    while (attempts++ < 50) {
      const x = 1 + Math.floor(rand() * (cols - 2));
      const y = 1 + Math.floor(rand() * (rows - 2));
      if (occupied[y][x]) continue;
      occupied[y][x] = true;
      blocks.push({
        id: `obs${i}`,
        color: 'red',
        position: [x, y],
        size: [1, 1],
        type: 'obstacle',
      });
      break;
    }
  }

  let simpleCount = 0;
  let attempts = 0;
  while (simpleCount < targetSimple && attempts < 200) {
    attempts++;
    const x = Math.floor(rand() * cols);
    const y = Math.floor(rand() * rows);
    if (occupied[y][x]) continue;

    occupied[y][x] = true;

    const colorCount = id <= 5 ? 2 : id <= 20 ? 3 : id <= 40 ? 4 : 6;
    const color = COLOR_POOL[Math.floor(rand() * colorCount)];

    let allowedExits: ExitSide[] | undefined;
    if (id >= 16 && rand() < 0.3) {
      const set = new Set<ExitSide>();
      while (set.size < 2) set.add(pick(rand, ALL_SIDES));
      allowedExits = Array.from(set);
    }

    blocks.push({
      id: `b${simpleCount}`,
      color,
      position: [x, y],
      size: [1, 1],
      type: 'simple',
      allowedExits,
    });
    simpleCount++;
  }

  const exits: ExitZone[] = [];
  if (id <= 10) {
    for (let i = 0; i < cols; i++) {
      exits.push({ side: 'TOP', index: i });
      exits.push({ side: 'BOTTOM', index: i });
    }
    for (let i = 0; i < rows; i++) {
      exits.push({ side: 'LEFT', index: i });
      exits.push({ side: 'RIGHT', index: i });
    }
  } else {
    const exitCount = id <= 25 ? 3 : 2;
    for (const side of ALL_SIDES) {
      const max = side === 'TOP' || side === 'BOTTOM' ? cols : rows;
      const used = new Set<number>();
      while (used.size < Math.min(exitCount, max)) {
        used.add(Math.floor(rand() * max));
      }
      used.forEach((idx) => exits.push({ side, index: idx }));
    }
  }

  const optimalMoves = estimateOptimal(blocks, exits, cols, rows, targetObstacles);

  return { id, cols, rows, blocks, exits, optimalMoves };
}

export const LEVELS: LevelData[] = Array.from({ length: TOTAL_LEVELS }, (_, i) =>
  generateLevel(i + 1)
);

export function getLevel(id: number): LevelData {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, id - 1))];
}
