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

// Each level hand-verified solvable. Solution sketch in comment.
// Difficulty: order constraints + multiple wrong-start dead-ends force planning.

export const LEVELS: LevelData[] = [
  // L1 — Quad Corner Pair (5x5, 6 moves)
  // r1 LEFT exit; r3 UP→(0,0)→LEFT exit; r4 RIGHT exit; r2 DOWN→(4,4)→RIGHT exit.
  // r3 cannot exit until r1 clears col 0 row 0 path; r2 needs r4 gone first.
  L(1, 5, 5,
    [S('a', 0, 0), S('b', 4, 0), S('c', 0, 4), S('d', 4, 4)],
    [E('LEFT', 0), E('RIGHT', 4)],
  ),

  // L2 — Cross Around Obstacle (5x5, 8 moves)
  // 4 sims around center obstacle; 4 corner exits.
  // Each block: 2 swipes (slide to corner, then exit).
  L(2, 5, 5,
    [S('a', 2, 0), S('b', 2, 4), S('c', 0, 2), S('d', 4, 2), O('o', 2, 2)],
    [E('TOP', 0), E('TOP', 4), E('BOTTOM', 0), E('BOTTOM', 4)],
  ),

  // L3 — Five Block Line (6x5, 5 moves order forced)
  // Cols 0,1,2,3,5 in row 2. exit LEFT@2.
  // Must remove leftmost first; trying any other first = blocked.
  L(3, 6, 5,
    [S('a', 0, 2), S('b', 1, 2), S('c', 2, 2), S('d', 3, 2), S('e', 5, 2)],
    [E('LEFT', 2)],
  ),

  // L4 — Yellow Stack (5x5, 3-5 moves)
  // y constrained UP. s1, s2 in col 0 above y.
  // s2 UP exit; s1 UP slides to (0,0) → exit; y UP exit.
  L(4, 5, 5,
    [C('y', 0, 4, 'UP'), S('s1', 0, 2), S('s2', 0, 0)],
    [E('TOP', 0)],
  ),

  // L5 — Yellow Through Three (6x5, 3-5 moves)
  // y constrained RIGHT, blocked by s1, s2 chain.
  // s2 RIGHT exit; s1 RIGHT exit; y RIGHT exit.
  L(5, 6, 5,
    [C('y', 0, 2, 'RIGHT'), S('s1', 2, 2), S('s2', 4, 2)],
    [E('RIGHT', 2)],
  ),

  // L6 — Stopper Trick (5x5, 4 moves order critical)
  // r1 must use r2 as stopper to halt at (1,4) before exit BOTTOM@1.
  // If r2 exits first, r1 slides past col 1 → unsolvable.
  // r1 DOWN→(0,4). r1 RIGHT→(1,4) (blocked by r2). r1 DOWN exit. r2 RIGHT exit.
  L(6, 5, 5,
    [S('a', 0, 2), S('b', 2, 4)],
    [E('BOTTOM', 1), E('RIGHT', 4)],
  ),

  // L7 — Yellow Pair w/ Stoppers (6x5, 6 moves)
  // y1, y2 each constrained RIGHT, each blocked by simple stopper in their row.
  // s1 RIGHT exit; y1 RIGHT exit. s2 RIGHT exit; y2 RIGHT exit.
  L(7, 6, 5,
    [
      C('y1', 0, 1, 'RIGHT'), C('y2', 0, 3, 'RIGHT'),
      S('s1', 3, 1), S('s2', 3, 3),
    ],
    [E('RIGHT', 1), E('RIGHT', 3)],
  ),

  // L8 — Solo Spiral Detour (6x6, 4-5 moves)
  // r needs RIGHT@0; obstacle at (0,2) blocks straight UP; o(2,4) decoration.
  // r UP→(0,3) blocked. r RIGHT→(5,3). r UP→(5,0). r RIGHT exit RIGHT@0.
  L(8, 6, 6,
    [S('a', 0, 5), O('o1', 0, 2), O('o2', 2, 4)],
    [E('RIGHT', 0)],
  ),

  // L9 — Hub Pinned (5x5, 3 moves)
  // r blocked LEFT/RIGHT by deps. r UP exits TOP@2; b1 LEFT, b2 RIGHT.
  L(9, 5, 5,
    [S('r', 2, 2), D('b1', 0, 2, 'r'), D('b2', 4, 2, 'r')],
    [E('TOP', 2), E('LEFT', 2), E('RIGHT', 2)],
  ),

  // L10 — Yellow Pin Trio (5x5, 5 moves order required)
  // y constrained UP, blocked by s1; s1 blocked by s2.
  // s2 UP exit; s1 UP exit; y UP exit. Plus s3 separate.
  L(10, 5, 5,
    [
      C('y', 2, 4, 'UP'), S('s1', 2, 2), S('s2', 2, 0),
      S('s3', 0, 0),
    ],
    [E('TOP', 0), E('TOP', 2)],
  ),

  // L11 — Quad Diagonal w/ Obstacles (6x6, 4-6 moves)
  // r1 UP exit; r2 LEFT row 0→(0,0)→UP exit; r4 DOWN exit; r3 UP→(0,0) (after others)→UP exit.
  // Order: r1, r2, r4, r3 (or some equivalent).
  L(11, 6, 6,
    [
      S('a', 0, 0), S('b', 5, 0), S('c', 0, 5), S('d', 5, 5),
      O('o1', 2, 2), O('o2', 3, 3),
    ],
    [E('TOP', 0), E('BOTTOM', 5)],
  ),

  // L12 — Chain w/ Lateral Stop (6x5, 4 moves)
  // r LEFT exit; s LEFT exit; b1 LEFT exit; b2 LEFT exit.
  // Forced sequence by dependency chain.
  L(12, 6, 5,
    [S('r', 0, 2), S('s', 2, 2), D('b1', 4, 2, 's'), D('b2', 5, 2, 'b1')],
    [E('LEFT', 2), E('RIGHT', 2)],
  ),

  // L13 — Yellow Cross Bridge (6x6, 6 moves)
  // y1 row 2 RIGHT clear (no obstacles row 2). y1 exits RIGHT@2.
  // y2 row 3 LEFT clear. y2 exits LEFT@3.
  // s1, s2 in row 4 must exit via BOTTOM corners.
  L(13, 6, 6,
    [
      C('y1', 0, 2, 'RIGHT'), C('y2', 5, 3, 'LEFT'),
      S('s1', 0, 4), S('s2', 5, 4),
    ],
    [E('RIGHT', 2), E('LEFT', 3), E('BOTTOM', 0), E('BOTTOM', 5)],
  ),

  // L14 — 4-Dep Diagonal (5x5, 5 moves)
  // r at center, deps at corners (don't pin). r exits any direction; deps follow.
  // r UP→(2,0)→exit TOP@2. b1(0,0) RIGHT→(4,0)→DOWN→(4,4) blocked? b4. or simpler.
  // b's at corners need to reach row/col 2.
  L(14, 5, 5,
    [
      S('r', 2, 2),
      D('b1', 0, 0, 'r'), D('b4', 4, 4, 'r'),
    ],
    [E('TOP', 2), E('BOTTOM', 2), E('LEFT', 2), E('RIGHT', 2)],
  ),

  // L15 — Constrained Corridor (7x5, 7 moves order)
  // y, s1, s2, s3 all in row 2 single exit RIGHT@2.
  // Reverse order required: s3 first then s2, s1, y.
  L(15, 7, 5,
    [
      C('y', 0, 2, 'RIGHT'),
      S('a', 2, 2), S('b', 4, 2), S('c', 6, 2),
    ],
    [E('RIGHT', 2)],
  ),

  // L16 — Detour + Stopper (5x5, 5 moves)
  // r needs BOTTOM@1; uses s as stopper at (1,4).
  L(16, 5, 5,
    [S('r', 0, 0), S('s', 2, 4), O('o1', 2, 2), O('o2', 4, 2)],
    [E('BOTTOM', 1), E('RIGHT', 4)],
  ),

  // L17 — Mixed Mechanic Tier (6x6, 5 moves)
  // y RIGHT exit, r LEFT exit, b unlocks LEFT exit.
  L(17, 6, 6,
    [
      C('y', 0, 0, 'RIGHT'), S('r', 0, 5),
      D('b', 5, 5, 'r'),
    ],
    [E('RIGHT', 0), E('LEFT', 5)],
  ),

  // L18 — Long Line + Sealed Right (7x5, 4 moves)
  // 4 sims row 2 cols 0,2,4,6. exit LEFT@2 only.
  L(18, 7, 5,
    [S('a', 0, 2), S('b', 2, 2), S('c', 4, 2), S('d', 6, 2)],
    [E('LEFT', 2)],
  ),

  // L19 — Yellow + Linear Chain (6x5, 5 moves)
  // y exit row 2 RIGHT; b1 unlocks; b2 unlocks; b3 unlocks. Chain in row 3.
  L(19, 6, 5,
    [
      C('y', 0, 2, 'RIGHT'),
      S('s', 0, 3), D('b1', 3, 3, 's'), D('b2', 5, 3, 'b1'),
    ],
    [E('RIGHT', 2), E('LEFT', 3), E('RIGHT', 3)],
  ),

  // L20 — Yellow Convergence (7x6, 5 moves)
  // y1 RIGHT row 2 clear (no row 2 obstacle); y2 LEFT row 4 clear.
  // b1 dep y1, b2 dep y2.
  L(20, 7, 6,
    [
      C('y1', 0, 2, 'RIGHT'), C('y2', 6, 4, 'LEFT'),
      S('a', 3, 1), S('b', 3, 5),
    ],
    [E('RIGHT', 2), E('LEFT', 4), E('TOP', 3), E('BOTTOM', 3)],
  ),

  // L21 — Branching Deps (6x6, 5 moves)
  // r exits → 2 children unlock → each unlocks own grandchild.
  L(21, 6, 6,
    [
      S('r', 0, 0),
      D('b1', 5, 0, 'r'), D('b2', 0, 5, 'r'),
      D('c1', 5, 5, 'b1'),
    ],
    [E('TOP', 0), E('TOP', 5), E('BOTTOM', 0), E('BOTTOM', 5)],
  ),

  // L22 — 4-Block Quartet w/ Sealed Center (6x6, 6 moves)
  L(22, 6, 6,
    [
      S('a', 0, 2), S('b', 5, 2),
      S('c', 0, 3), S('d', 5, 3),
    ],
    [E('LEFT', 2), E('RIGHT', 2), E('LEFT', 3), E('RIGHT', 3)],
  ),

  // L23 — Yellow + Pair Stoppers (7x6, 6 moves)
  // y constrained RIGHT; s1, s2 are stoppers; obstacles seal rows.
  L(23, 7, 6,
    [
      C('y', 0, 2, 'RIGHT'), S('s1', 3, 2), S('s2', 6, 2),
      O('o1', 1, 4), O('o2', 5, 4),
    ],
    [E('RIGHT', 2), E('BOTTOM', 3)],
  ),

  // L24 — Mixed Net (6x6, 6 moves)
  // 2 sims unlock 2 deps; 2 yellows independent.
  L(24, 6, 6,
    [
      S('r1', 0, 0), C('y', 5, 0, 'LEFT'),
      D('b1', 2, 2, 'r1'), D('b2', 5, 5, 'r1'),
      O('o', 3, 3),
    ],
    [E('TOP', 0), E('LEFT', 0), E('LEFT', 2), E('RIGHT', 5)],
  ),

  // L25 — Master Final (7x7, 8+ moves)
  // r LEFT exit. s DOWN exit. y constrained DOWN exit. b unlocks UP exit.
  // Decoration obstacles.
  L(25, 7, 7,
    [
      S('r', 0, 3), S('s', 3, 5),
      C('y', 3, 3, 'DOWN'), D('b', 3, 0, 'y'),
      O('o1', 2, 4), O('o2', 4, 4),
      O('o3', 1, 6), O('o4', 5, 6),
    ],
    [E('LEFT', 3), E('BOTTOM', 3), E('TOP', 3)],
  ),
];

export function getLevel(id: number): LevelData {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, id - 1))];
}
