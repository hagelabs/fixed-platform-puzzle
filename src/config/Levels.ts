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

// Hand-authored per LEVEL_DESIGN.md progression framework.
// Phase 1 (1-5): Introduction. Phase 2 (6-10): Foundation.
// Phase 3 (11-17): Advanced. Phase 4 (18-25): Expert.

export const LEVELS: LevelData[] = [
  // L1 — First Touch (6x6, 1 move). Drag a left → exit.
  L(1, 6, 6,
    [S('a', 0, 2)],
    [E('LEFT', 2)],
  ),

  // L2 — Two Sides (6x6, 2 moves). Each red at its exit edge.
  L(2, 6, 6,
    [S('a', 0, 1), S('b', 5, 4), O('o', 2, 2)],
    [E('LEFT', 1), E('RIGHT', 4)],
  ),

  // L3 — First Yellow (7x7, 2 moves). Red exits LEFT, yellow UP only.
  // a (1,3) drag left→(0,3) LEFT@3. y (5,1) drag up→(5,0) TOP@5 (matches UP).
  L(3, 7, 7,
    [S('a', 1, 3), C('y', 5, 1, 'UP'), O('o', 3, 5)],
    [E('LEFT', 3), E('TOP', 5)],
  ),

  // L4 — Unlock the Blue (7x7, 2 moves). Depth 1.
  // r left→LEFT@3. b unlocked, drag right→(6,3) RIGHT@3.
  L(4, 7, 7,
    [S('r', 1, 3), D('b', 5, 3, 'r'), O('o', 3, 5)],
    [E('LEFT', 3), E('RIGHT', 3)],
  ),

  // L5 — Mixed Quartet (7x7, 4 moves). Depth 1.
  // r1 left→LEFT@1. b unlock→right→RIGHT@1.
  // r2 right→RIGHT@5. y right→(6,5) RIGHT@5 (matches RIGHT).
  L(5, 7, 7,
    [
      S('r1', 1, 1), S('r2', 5, 5),
      C('y', 0, 5, 'RIGHT'),
      D('b', 6, 1, 'r1'),
      O('o1', 3, 3), O('o2', 4, 3),
    ],
    [E('LEFT', 1), E('RIGHT', 1), E('LEFT', 5), E('RIGHT', 5)],
  ),

  // L6 — Four-Way (8x8, 4 moves). Depth 1.
  // r1 left→LEFT@1. r2 right→RIGHT@6.
  // y down col 3→BOTTOM@3 (matches DOWN). b unlock→up col 4→TOP@4.
  L(6, 8, 8,
    [
      S('r1', 1, 1), S('r2', 6, 6),
      C('y', 3, 0, 'DOWN'),
      D('b', 4, 7, 'y'),
      O('o1', 2, 4), O('o2', 5, 4),
    ],
    [E('LEFT', 1), E('RIGHT', 6), E('BOTTOM', 3), E('TOP', 4)],
  ),

  // L7 — Yellow Pair w/ Stoppers (8x8, 4 moves).
  // r1 right→(7,2) RIGHT@2 (clears row 2). y1 right→(7,2) RIGHT@2 (matches).
  // r2 right→(7,5) RIGHT@5. y2 right→(7,5) RIGHT@5.
  L(7, 8, 8,
    [
      C('y1', 0, 2, 'RIGHT'), C('y2', 0, 5, 'RIGHT'),
      S('r1', 4, 2), S('r2', 4, 5),
      O('o1', 6, 0), O('o2', 6, 7),
    ],
    [E('RIGHT', 2), E('RIGHT', 5)],
  ),

  // L8 — Cross Currents (8x8, 5 moves). Depth 1 + parallel yellows.
  // r1 left→LEFT@1. r2 right→RIGHT@6. b unlock→up col 4→TOP@4.
  // y1 right row 4→RIGHT@4. y2 left row 3→LEFT@3.
  L(8, 8, 8,
    [
      S('r1', 1, 1), S('r2', 6, 6),
      C('y1', 0, 4, 'RIGHT'), C('y2', 7, 3, 'LEFT'),
      D('b', 4, 4, 'r1'),
      O('o1', 2, 2), O('o2', 5, 5), O('o3', 4, 7),
    ],
    [E('LEFT', 1), E('RIGHT', 6), E('RIGHT', 4), E('LEFT', 3), E('TOP', 4)],
  ),

  // L9 — Order Trap (8x8, 4 moves). False path: drag y first → blocked by r3.
  // r1 left→LEFT@2. r2 right→RIGHT@2. r3 left→LEFT@5.
  // y left row 5 (after r3 gone)→LEFT@5 (matches LEFT).
  L(9, 8, 8,
    [
      S('r1', 0, 2), S('r2', 7, 2), S('r3', 0, 5),
      C('y', 7, 5, 'LEFT'),
      O('o1', 3, 3), O('o2', 4, 4), O('o3', 3, 0),
    ],
    [E('LEFT', 2), E('RIGHT', 2), E('LEFT', 5)],
  ),

  // L10 — Twin Chain (8x8, 6 moves). Depth 2.
  // r1 left→LEFT@1. b1 unlock→up→TOP@4. b2 unlock→down→BOTTOM@4.
  // r2 right→RIGHT@6. y1 right row 4→RIGHT@4. y2 left row 3→LEFT@3.
  L(10, 8, 8,
    [
      S('r1', 1, 1), S('r2', 6, 6),
      C('y1', 0, 4, 'RIGHT'), C('y2', 7, 3, 'LEFT'),
      D('b1', 4, 1, 'r1'), D('b2', 4, 6, 'b1'),
      O('o1', 2, 5), O('o2', 5, 2), O('o3', 3, 5),
    ],
    [E('LEFT', 1), E('RIGHT', 6), E('RIGHT', 4), E('LEFT', 3), E('TOP', 4), E('BOTTOM', 4)],
  ),

  // L11 — Parallel Chains (9x9, 6 moves).
  // r1 left→LEFT@1. b1→LEFT@7. r2 right→RIGHT@7. b2→RIGHT@1.
  // y1 right row 3→RIGHT@3. y2 left row 5→LEFT@5.
  L(11, 9, 9,
    [
      S('r1', 0, 1), S('r2', 8, 7),
      D('b1', 0, 7, 'r1'), D('b2', 8, 1, 'r2'),
      C('y1', 0, 3, 'RIGHT'), C('y2', 8, 5, 'LEFT'),
      O('o1', 4, 4), O('o2', 4, 0), O('o3', 4, 8), O('o4', 2, 7),
    ],
    [E('LEFT', 1), E('LEFT', 7), E('RIGHT', 7), E('RIGHT', 1), E('RIGHT', 3), E('LEFT', 5)],
  ),

  // L12 — Cross Center (9x9, 5 moves). Depth 1 + 2 yellows.
  // r1 left→LEFT@4. r2 right→RIGHT@4. b unlock→up col 4→TOP@4.
  // y1 down col 3→BOTTOM@3. y2 up col 5→TOP@5.
  L(12, 9, 9,
    [
      S('r1', 0, 4), S('r2', 8, 4),
      C('y1', 3, 0, 'DOWN'), C('y2', 5, 8, 'UP'),
      D('b', 4, 4, 'r1'),
      O('o1', 2, 2), O('o2', 6, 6), O('o3', 1, 7),
    ],
    [E('LEFT', 4), E('RIGHT', 4), E('BOTTOM', 3), E('TOP', 5), E('TOP', 4)],
  ),

  // L13 — Three Reds w/ Yellows (9x9, 6 moves). Depth 1.
  // r1,r2 left exits. r3 right→RIGHT@4. b unlock→left→LEFT@4.
  // y1 down col 3→BOTTOM@3. y2 up col 5→TOP@5.
  L(13, 9, 9,
    [
      S('r1', 0, 1), S('r2', 0, 7), S('r3', 8, 4),
      C('y1', 3, 0, 'DOWN'), C('y2', 5, 8, 'UP'),
      D('b', 4, 4, 'r3'),
      O('o1', 2, 2), O('o2', 2, 6), O('o3', 6, 2), O('o4', 6, 6),
    ],
    [E('LEFT', 1), E('LEFT', 7), E('RIGHT', 4), E('BOTTOM', 3), E('TOP', 5), E('LEFT', 4)],
  ),

  // L14 — All Yellow (9x9, 4 moves). No deps.
  // r down col 4→BOTTOM@4 (clears way). y3 down col 4→BOTTOM@4 (matches).
  // y1 right row 2→RIGHT@2. y2 left row 6→LEFT@6.
  L(14, 9, 9,
    [
      S('r', 4, 4),
      C('y1', 0, 2, 'RIGHT'), C('y2', 8, 6, 'LEFT'), C('y3', 4, 0, 'DOWN'),
      O('o1', 2, 5), O('o2', 6, 3), O('o3', 1, 7),
    ],
    [E('RIGHT', 2), E('LEFT', 6), E('BOTTOM', 4)],
  ),

  // L15 — Edge Chain (9x9, 6 moves). Depth 2.
  // r1 left→LEFT@1. b1 unlock→up→TOP@4. b2 unlock→down→BOTTOM@4.
  // r2 right→RIGHT@7. y1 right row 3→RIGHT@3. y2 left row 5→LEFT@5.
  L(15, 9, 9,
    [
      S('r1', 0, 1), S('r2', 8, 7),
      C('y1', 0, 3, 'RIGHT'), C('y2', 8, 5, 'LEFT'),
      D('b1', 4, 0, 'r1'), D('b2', 4, 8, 'b1'),
      O('o1', 2, 6), O('o2', 6, 2), O('o3', 4, 4), O('o4', 7, 6),
    ],
    [E('LEFT', 1), E('RIGHT', 7), E('RIGHT', 3), E('LEFT', 5), E('TOP', 4), E('BOTTOM', 4)],
  ),

  // L16 — False Lure (9x9, 5 moves). False: drag y first → blocked.
  // r1 left→LEFT@1. b unlock→left row 4→LEFT@4. r2 right→RIGHT@7.
  // y1 right row 5→RIGHT@5. y2 left row 3→LEFT@3.
  L(16, 9, 9,
    [
      S('r1', 1, 1), S('r2', 7, 7),
      C('y1', 0, 5, 'RIGHT'), C('y2', 8, 3, 'LEFT'),
      D('b', 4, 4, 'r1'),
      O('o1', 3, 2), O('o2', 5, 6), O('o3', 4, 0), O('o4', 4, 8),
    ],
    [E('LEFT', 1), E('RIGHT', 7), E('RIGHT', 5), E('LEFT', 3), E('LEFT', 4)],
  ),

  // L17 — Wide Court (10x9, 7 moves).
  // r1 left→LEFT@1. b1→LEFT@7. r2 right→RIGHT@7. b2→RIGHT@1.
  // r3 up→TOP@4 (already at edge). y1 right row 3→RIGHT@3. y2 left row 5→LEFT@5.
  L(17, 10, 9,
    [
      S('r1', 0, 1), S('r2', 9, 7), S('r3', 4, 0),
      C('y1', 0, 3, 'RIGHT'), C('y2', 9, 5, 'LEFT'),
      D('b1', 0, 7, 'r1'), D('b2', 9, 1, 'r2'),
      O('o1', 3, 4), O('o2', 6, 4), O('o3', 4, 8), O('o4', 5, 8), O('o5', 4, 2),
    ],
    [E('LEFT', 1), E('RIGHT', 7), E('TOP', 4), E('LEFT', 7), E('RIGHT', 1), E('RIGHT', 3), E('LEFT', 5)],
  ),

  // L18 — Triple Chain (10x9, 5 moves). Depth 3.
  // r left→LEFT@4. b1→right RIGHT@4. b2→up TOP@9. b3→up TOP@0.
  // y up col 4→TOP@4 (matches UP).
  L(18, 10, 9,
    [
      S('r', 0, 4),
      D('b1', 9, 4, 'r'), D('b2', 9, 0, 'b1'), D('b3', 0, 0, 'b2'),
      C('y', 4, 8, 'UP'),
      O('o1', 5, 5), O('o2', 3, 4), O('o3', 6, 6),
    ],
    [E('LEFT', 4), E('RIGHT', 4), E('TOP', 9), E('TOP', 0), E('TOP', 4)],
  ),

  // L19 — Big Yard (10x10, 7 moves). Parallel chains + yellows.
  // r1 left→LEFT@1. b1→LEFT@8. r2 right→RIGHT@8. b2→RIGHT@1.
  // r3 right row 4→RIGHT@4. y1 down col 4→BOTTOM@4. y2 up col 5→TOP@5.
  L(19, 10, 10,
    [
      S('r1', 0, 1), S('r2', 9, 8),
      D('b1', 0, 8, 'r1'), D('b2', 9, 1, 'r2'),
      C('y1', 4, 0, 'DOWN'), C('y2', 5, 9, 'UP'),
      S('r3', 4, 4),
      O('o1', 2, 4), O('o2', 7, 5), O('o3', 6, 2), O('o4', 3, 7),
    ],
    [E('LEFT', 1), E('RIGHT', 8), E('LEFT', 8), E('RIGHT', 1), E('BOTTOM', 4), E('TOP', 5), E('RIGHT', 4)],
  ),

  // L20 — Pinwheel (10x10, 8 moves).
  // r1 up→TOP@0. b1→up TOP@9. r2 down→BOTTOM@9. b2→down BOTTOM@0.
  // y2 left row 4→LEFT@4. r3 right row 4→RIGHT@4.
  // r4 right row 5→RIGHT@5. y1 right row 5→RIGHT@5.
  L(20, 10, 10,
    [
      S('r1', 0, 0), S('r2', 9, 9),
      D('b1', 9, 0, 'r1'), D('b2', 0, 9, 'r2'),
      C('y1', 0, 5, 'RIGHT'), C('y2', 9, 4, 'LEFT'),
      S('r3', 4, 4), S('r4', 5, 5),
      O('o1', 2, 2), O('o2', 7, 7), O('o3', 4, 7), O('o4', 5, 2),
    ],
    [E('TOP', 0), E('BOTTOM', 9), E('TOP', 9), E('BOTTOM', 0), E('RIGHT', 5), E('LEFT', 4), E('RIGHT', 4)],
  ),

  // L21 — Branching Tree (10x10, 7 moves). r unlocks b1 and b2 (parallel).
  // r1 up. b1→right row 4→RIGHT@4. r2 down. b2→up unchanged path.
  // r3 down→BOTTOM@0. y1 right row 4→RIGHT@4 (after b1). y2 left row 5→LEFT@5.
  L(21, 10, 10,
    [
      S('r1', 0, 0), S('r2', 9, 9), S('r3', 0, 9),
      D('b1', 9, 0, 'r1'), D('b2', 4, 4, 'r2'),
      C('y1', 0, 4, 'RIGHT'), C('y2', 9, 5, 'LEFT'),
      O('o1', 3, 3), O('o2', 6, 6), O('o3', 5, 2), O('o4', 4, 7), O('o5', 2, 7),
    ],
    [E('TOP', 0), E('BOTTOM', 9), E('BOTTOM', 0), E('TOP', 9), E('RIGHT', 4), E('LEFT', 5)],
  ),

  // L22 — Eight Block Arena (10x10, 8 moves). Mixed.
  // r1 left→LEFT@1. b1→LEFT@8. r2 right→RIGHT@8. b2→RIGHT@1.
  // r3 up→TOP@4. r4 down→BOTTOM@5. y1 right row 5→RIGHT@5. y2 left row 4→LEFT@4.
  L(22, 10, 10,
    [
      S('r1', 0, 1), S('r2', 9, 8), S('r3', 4, 0), S('r4', 5, 9),
      D('b1', 0, 8, 'r1'), D('b2', 9, 1, 'r2'),
      C('y1', 0, 5, 'RIGHT'), C('y2', 9, 4, 'LEFT'),
      O('o1', 3, 3), O('o2', 6, 6), O('o3', 5, 3), O('o4', 4, 6), O('o5', 2, 7), O('o6', 7, 2),
    ],
    [E('LEFT', 1), E('RIGHT', 8), E('LEFT', 8), E('RIGHT', 1), E('TOP', 4), E('BOTTOM', 5), E('RIGHT', 5), E('LEFT', 4)],
  ),

  // L23 — Center Web (10x10, 8 moves). 4 corners + 3 deps + yellow.
  // r1,r2,r3,r4 each at corner→edge exit.
  // b1→left LEFT@4. b2→right RIGHT@5. b3→left LEFT@5. y up col 5→TOP@5.
  L(23, 10, 10,
    [
      S('r1', 0, 0), S('r2', 9, 0), S('r3', 0, 9), S('r4', 9, 9),
      D('b1', 4, 4, 'r1'), D('b2', 5, 5, 'r2'), D('b3', 4, 5, 'r3'),
      C('y', 5, 4, 'UP'),
      O('o1', 3, 3), O('o2', 6, 6), O('o3', 6, 3), O('o4', 3, 6), O('o5', 7, 4), O('o6', 1, 6),
    ],
    [E('TOP', 0), E('TOP', 9), E('BOTTOM', 0), E('BOTTOM', 9), E('LEFT', 4), E('RIGHT', 5), E('LEFT', 5), E('TOP', 5)],
  ),

  // L24 — Endgame Symmetry (9x9, 5 moves). Elegant balance.
  // r left row 4→LEFT@4. b1 unlock→up→TOP@4. b2 unlock→down→BOTTOM@4.
  // y1 right row 3→RIGHT@3. y2 left row 5→LEFT@5.
  L(24, 9, 9,
    [
      S('r', 4, 4),
      C('y1', 0, 3, 'RIGHT'), C('y2', 8, 5, 'LEFT'),
      D('b1', 4, 0, 'r'), D('b2', 4, 8, 'r'),
      O('o1', 2, 2), O('o2', 6, 6), O('o3', 2, 6), O('o4', 6, 2),
    ],
    [E('TOP', 4), E('BOTTOM', 4), E('RIGHT', 3), E('LEFT', 5), E('LEFT', 4)],
  ),

  // L25 — Master Final (9x9, 7 moves).
  // r1 up→TOP@0. b1 unlock→up TOP@8. r2 down→BOTTOM@8. b2 unlock→down BOTTOM@0.
  // s down col 4→BOTTOM@4. y1 down col 3→BOTTOM@3 (matches DOWN).
  // y2 up col 5→TOP@5 (matches UP).
  L(25, 9, 9,
    [
      S('r1', 0, 0), S('r2', 8, 8),
      D('b1', 8, 0, 'r1'), D('b2', 0, 8, 'r2'),
      C('y1', 3, 0, 'DOWN'), C('y2', 5, 8, 'UP'),
      S('s', 4, 4),
      O('o1', 2, 2), O('o2', 6, 6), O('o3', 2, 6), O('o4', 6, 2), O('o5', 1, 4), O('o6', 7, 4),
    ],
    [E('TOP', 0), E('TOP', 8), E('BOTTOM', 0), E('BOTTOM', 8), E('BOTTOM', 4), E('BOTTOM', 3), E('TOP', 5)],
  ),
];

export function getLevel(id: number): LevelData {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, id - 1))];
}
