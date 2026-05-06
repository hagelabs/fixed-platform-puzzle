import { LevelData, BlockData, ExitZone, Direction } from '../types/Game';

const S = (id: string, c: number, r: number): BlockData => ({
  id, color: 'red', position: [c, r], size: [1, 1], type: 'simple',
});
const O = (id: string, c: number, r: number): BlockData => ({
  id, color: 'red', position: [c, r], size: [1, 1], type: 'obstacle',
});
const C = (id: string, c: number, r: number, dir: Direction): BlockData => ({
  id, color: 'yellow', position: [c, r], size: [1, 1], type: 'constrained', direction: dir,
});
const D = (id: string, c: number, r: number, dep: string): BlockData => ({
  id, color: 'blue', position: [c, r], size: [1, 1], type: 'dependent', dependsOn: dep,
});
const E = (
  side: 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT',
  index: number,
): ExitZone => ({ side, index });
const L = (
  id: number, cols: number, rows: number, blocks: BlockData[], exits: ExitZone[],
): LevelData => ({ id, cols, rows, blocks, exits });

// Single-gate puzzles. L1-5: each block requires ≥2 moves (corner detour).
// Slide rule: drag direction must match exit side direction for slide-to-exit.

export const LEVELS: LevelData[] = [
  // L1 (6x6, RIGHT@5). a(0,0): down→(0,5), right→(5,5)→exit. 2 moves.
  L(1, 6, 6, [S('a', 0, 0)], [E('RIGHT', 5)]),

  // L2 (6x6, BOTTOM@5). a(0,0): right→(5,0), down→(5,5)→exit. 2 moves.
  L(2, 6, 6, [S('a', 0, 0)], [E('BOTTOM', 5)]),

  // L3 (6x6, LEFT@5, yellow LEFT). y(5,0): down→(5,5), left→(0,5)→exit. 2 moves.
  L(3, 6, 6, [C('y', 5, 0, 'LEFT')], [E('LEFT', 5)]),

  // L4 (7x7, TOP@6, yellow UP). y(0,6): right→(6,6), up→(6,0)→exit. 2 moves.
  L(4, 7, 7, [C('y', 0, 6, 'UP'), O('o', 3, 3)], [E('TOP', 6)]),

  // L5 (7x7, BOTTOM@6, red+blue dep). r(0,0): right→(6,0), down→(6,6)→exit.
  // b(0,6) unlocked: right→(6,6), down→exit. Each block 2 moves.
  L(5, 7, 7,
    [S('r', 0, 0), D('b', 0, 6, 'r'), O('o', 3, 3)],
    [E('BOTTOM', 6)],
  ),

  // L6 (7x7, BOTTOM@6). 3-block column queue.
  // r3,r2,r1 each swipe down→(6,6)→exit.
  L(6, 7, 7,
    [S('r1', 6, 0), S('r2', 6, 2), S('r3', 6, 4), O('o', 3, 3)],
    [E('BOTTOM', 6)],
  ),

  // L7 (7x7, RIGHT@3). Row 3 queue with yellow RIGHT.
  L(7, 7, 7,
    [C('y', 0, 3, 'RIGHT'), S('r1', 2, 3), S('r2', 4, 3), O('o', 3, 5)],
    [E('RIGHT', 3)],
  ),

  // L8 (7x7, BOTTOM@3). r at row 5, b dep r at row 0.
  // r down→(3,6) exit. b unlocked, down→exit.
  L(8, 7, 7,
    [S('r', 3, 5), D('b', 3, 0, 'r'), O('o1', 0, 0), O('o2', 6, 6)],
    [E('BOTTOM', 3)],
  ),

  // L9 (8x8, RIGHT@3). 4-block row 3 queue.
  L(9, 8, 8,
    [
      S('r1', 0, 3), S('r2', 2, 3), S('r3', 4, 3), S('r4', 6, 3),
      O('o', 3, 0),
    ],
    [E('RIGHT', 3)],
  ),

  // L10 (8x8, BOTTOM@3). yellow DOWN + dep chain depth 1.
  // r(3,6) down→exit. b(3,4) dep r→down→exit. y(3,0) down→exit.
  L(10, 8, 8,
    [
      C('y', 3, 0, 'DOWN'), D('b', 3, 4, 'r'), S('r', 3, 6),
      O('o1', 0, 0), O('o2', 7, 7),
    ],
    [E('BOTTOM', 3)],
  ),

  // L11 (8x8, RIGHT@4). 2 reds row 4. Decorative obstacles.
  L(11, 8, 8,
    [
      S('r1', 0, 4), S('r2', 4, 4),
      O('o1', 0, 0), O('o2', 7, 7), O('o3', 3, 6),
    ],
    [E('RIGHT', 4)],
  ),

  // L12 (8x8, BOTTOM@4). col 4 mixed: r1, y DOWN, r2.
  L(12, 8, 8,
    [
      S('r1', 4, 0), C('y', 4, 2, 'DOWN'), S('r2', 4, 5),
      O('o1', 0, 7), O('o2', 7, 0),
    ],
    [E('BOTTOM', 4)],
  ),

  // L13 (8x8, TOP@4). yellow UP + 2-deep blue chain.
  // y(4,2) up→exit. b1(4,5) unlock→up→exit. b2(4,7) unlock→up→exit.
  L(13, 8, 8,
    [
      C('y', 4, 2, 'UP'), D('b1', 4, 5, 'y'), D('b2', 4, 7, 'b1'),
      O('o1', 0, 0), O('o2', 7, 7),
    ],
    [E('TOP', 4)],
  ),

  // L14 (8x8, LEFT@4). row 4 left-queue.
  L(14, 8, 8,
    [
      S('r1', 3, 4), S('r2', 1, 4), C('y', 5, 4, 'LEFT'),
      O('o1', 7, 0), O('o2', 7, 7),
    ],
    [E('LEFT', 4)],
  ),

  // L15 (9x9, RIGHT@4). row 4 4-block queue.
  L(15, 9, 9,
    [
      C('y', 0, 4, 'RIGHT'), S('r1', 2, 4), S('r2', 4, 4), S('r3', 6, 4),
      O('o1', 0, 0), O('o2', 8, 8),
    ],
    [E('RIGHT', 4)],
  ),

  // L16 (9x9, BOTTOM@4). col 4 long queue.
  L(16, 9, 9,
    [
      C('y', 4, 0, 'DOWN'), S('r1', 4, 2), S('r2', 4, 4), S('r3', 4, 6),
      O('o1', 0, 0), O('o2', 8, 8),
    ],
    [E('BOTTOM', 4)],
  ),

  // L17 (9x9, TOP@4). col 4 chain depth 3.
  // y(4,2) up→exit. b1(4,4) unlock→up→exit. b2(4,6) unlock→up→exit. b3(4,8) unlock→up→exit.
  L(17, 9, 9,
    [
      C('y', 4, 2, 'UP'), D('b1', 4, 4, 'y'), D('b2', 4, 6, 'b1'), D('b3', 4, 8, 'b2'),
      O('o1', 0, 0), O('o2', 8, 8),
    ],
    [E('TOP', 4)],
  ),

  // L18 (9x9, LEFT@4). row 4 reverse queue.
  L(18, 9, 9,
    [
      C('y', 8, 4, 'LEFT'), S('r1', 6, 4), S('r2', 4, 4), S('r3', 2, 4),
      O('o1', 0, 0), O('o2', 8, 8),
    ],
    [E('LEFT', 4)],
  ),

  // L19 (9x9, RIGHT@4). Long detour around obstacle wall.
  // r(0,4): right→(3,4) [blocked by o1]. up→(3,0). right→(8,0). down→(8,4) [blocked by o4].
  // right→exit. 5 moves.
  L(19, 9, 9,
    [
      S('r', 0, 4),
      O('o1', 4, 4), O('o2', 4, 5), O('o3', 4, 6), O('o4', 8, 5),
    ],
    [E('RIGHT', 4)],
  ),

  // L20 (9x9, BOTTOM@4). col 4 dep chain.
  // r(4,7) down→exit. b(4,5) unlock→down→exit. y(4,0) down→exit.
  L(20, 9, 9,
    [
      C('y', 4, 0, 'DOWN'), D('b', 4, 5, 'r'), S('r', 4, 7),
      O('o1', 0, 0), O('o2', 8, 8),
    ],
    [E('BOTTOM', 4)],
  ),

  // L21 (10x10, RIGHT@5). row 5 5-block queue.
  L(21, 10, 10,
    [
      C('y', 0, 5, 'RIGHT'), S('r1', 2, 5), S('r2', 4, 5), S('r3', 6, 5), S('r4', 8, 5),
      O('o1', 0, 0), O('o2', 9, 9),
    ],
    [E('RIGHT', 5)],
  ),

  // L22 (10x10, BOTTOM@5). col 5 5-block queue.
  L(22, 10, 10,
    [
      C('y', 5, 0, 'DOWN'), S('r1', 5, 2), S('r2', 5, 4), S('r3', 5, 6), S('r4', 5, 8),
      O('o1', 0, 0), O('o2', 9, 9),
    ],
    [E('BOTTOM', 5)],
  ),

  // L23 (10x10, TOP@5). col 5 chain depth 3.
  L(23, 10, 10,
    [
      C('y', 5, 2, 'UP'), D('b1', 5, 4, 'y'), D('b2', 5, 6, 'b1'), D('b3', 5, 8, 'b2'),
      O('o1', 0, 0), O('o2', 9, 9),
    ],
    [E('TOP', 5)],
  ),

  // L24 (10x10, LEFT@5). row 5 reverse queue 5 blocks.
  L(24, 10, 10,
    [
      C('y', 9, 5, 'LEFT'), S('r1', 7, 5), S('r2', 5, 5), S('r3', 3, 5), S('r4', 1, 5),
      O('o1', 0, 0), O('o2', 9, 9),
    ],
    [E('LEFT', 5)],
  ),

  // L25 (10x10, RIGHT@5). Branching deps from single root.
  // r(8,5) right→exit. b1(6,5) unlock→right→exit. b2(4,5) unlock→right→exit. y(0,5) right→exit.
  L(25, 10, 10,
    [
      S('r', 8, 5), D('b1', 6, 5, 'r'), D('b2', 4, 5, 'r'), C('y', 0, 5, 'RIGHT'),
      O('o1', 0, 0), O('o2', 9, 9),
    ],
    [E('RIGHT', 5)],
  ),

  // L26 (10x10, BOTTOM@5). col 5 mix: simple+branch+yellow+simple.
  L(26, 10, 10,
    [
      S('r', 5, 8), D('b1', 5, 6, 'r'), D('b2', 5, 4, 'r'), C('y', 5, 2, 'DOWN'), S('s', 5, 0),
      O('o1', 0, 0), O('o2', 9, 9),
    ],
    [E('BOTTOM', 5)],
  ),

  // L27 (10x10, TOP@5). col 5 chain + simple.
  L(27, 10, 10,
    [
      C('y', 5, 2, 'UP'), D('b1', 5, 4, 'y'), D('b2', 5, 6, 'b1'), S('r', 5, 8),
      O('o1', 0, 0), O('o2', 9, 9), O('o3', 0, 5),
    ],
    [E('TOP', 5)],
  ),

  // L28 (10x10, LEFT@5). row 5 left-queue 4 blocks.
  L(28, 10, 10,
    [
      C('y', 9, 5, 'LEFT'), S('r1', 7, 5), S('r2', 5, 5), S('r3', 3, 5),
      O('o1', 0, 0), O('o2', 9, 9),
    ],
    [E('LEFT', 5)],
  ),

  // L29 (10x10, RIGHT@5). Linear chain depth 3 + yellow.
  // r(8,5) right→exit. b1(6,5) dep r → right→exit. b2(4,5) dep b1 → right→exit.
  // y(2,5) right→exit. b3(0,5) dep b2 → right→exit.
  L(29, 10, 10,
    [
      S('r', 8, 5), D('b1', 6, 5, 'r'), D('b2', 4, 5, 'b1'),
      C('y', 2, 5, 'RIGHT'), D('b3', 0, 5, 'b2'),
      O('o1', 0, 0), O('o2', 9, 9),
    ],
    [E('RIGHT', 5)],
  ),

  // L30 (10x10, BOTTOM@5). Master final. col 5 all-mechanic stack.
  // r1(5,8) down→exit. b1(5,6) dep r1 → down→exit.
  // y(5,4) down→exit. b2(5,2) dep y → down→exit. r2(5,0) down→exit.
  L(30, 10, 10,
    [
      S('r1', 5, 8), D('b1', 5, 6, 'r1'),
      C('y', 5, 4, 'DOWN'), D('b2', 5, 2, 'y'), S('r2', 5, 0),
      O('o1', 0, 0), O('o2', 9, 9), O('o3', 0, 9), O('o4', 9, 0),
    ],
    [E('BOTTOM', 5)],
  ),
];

export function getLevel(id: number): LevelData {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, id - 1))];
}

// Worst-case grid dim across all levels — used to compute a single shared cellSize
// so blocks/portal render at the same size in every level.
export const MAX_LEVEL_COLS = LEVELS.reduce((m, l) => Math.max(m, l.cols), 0);
export const MAX_LEVEL_ROWS = LEVELS.reduce((m, l) => Math.max(m, l.rows), 0);
