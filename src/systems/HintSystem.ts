import { Direction, ExitSide, Color } from '../types/Game';
import { Block } from '../entities/Block';
import { Grid } from '../entities/Grid';

type Pos = [number, number] | null;

interface SolverBlock {
  id: string;
  type: 'simple' | 'constrained' | 'dependent' | 'lock';
  color: Color;
  pos: [number, number];
  direction?: Direction;
  dependsOn?: string;
}

interface SolverCtx {
  cols: number;
  rows: number;
  blocks: SolverBlock[];
  obstacleSet: Set<number>;
  iceSet: Set<number>;
  exits: { side: ExitSide; index: number }[];
  depByIdx: number[];
  idMap: Map<string, number>;
}

const DELTA: Record<Direction, [number, number]> = {
  UP: [0, -1], DOWN: [0, 1], LEFT: [-1, 0], RIGHT: [1, 0],
};
const DIR_TO_SIDE: Record<Direction, ExitSide> = {
  UP: 'TOP', DOWN: 'BOTTOM', LEFT: 'LEFT', RIGHT: 'RIGHT',
};
const DIRS: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

function cellKey(c: number, r: number, cols: number): number {
  return r * cols + c;
}

class MinHeap<T> {
  items: { v: T; p: number }[] = [];
  push(v: T, p: number) {
    this.items.push({ v, p });
    let i = this.items.length - 1;
    while (i > 0) {
      const par = (i - 1) >> 1;
      if (this.items[par].p <= this.items[i].p) break;
      [this.items[par], this.items[i]] = [this.items[i], this.items[par]];
      i = par;
    }
  }
  pop(): T | undefined {
    if (!this.items.length) return undefined;
    const top = this.items[0].v;
    const last = this.items.pop()!;
    if (this.items.length) {
      this.items[0] = last;
      let i = 0;
      const n = this.items.length;
      while (true) {
        const l = i * 2 + 1, r = l + 1;
        let b = i;
        if (l < n && this.items[l].p < this.items[b].p) b = l;
        if (r < n && this.items[r].p < this.items[b].p) b = r;
        if (b === i) break;
        [this.items[b], this.items[i]] = [this.items[i], this.items[b]];
        i = b;
      }
    }
    return top;
  }
  get size() { return this.items.length; }
}

function buildCtx(blocks: Block[], grid: Grid, iceCells: [number, number][]): SolverCtx {
  const obstacleSet = new Set<number>();
  const solverBlocks: SolverBlock[] = [];
  for (const b of blocks) {
    if (b.removed) continue;
    if (b.type === 'obstacle') {
      obstacleSet.add(cellKey(b.gridPos[0], b.gridPos[1], grid.cols));
      continue;
    }
    solverBlocks.push({
      id: b.blockId,
      type: b.type as SolverBlock['type'],
      color: b.color,
      pos: [b.gridPos[0], b.gridPos[1]],
      direction: b.direction,
      dependsOn: b.dependsOn,
    });
  }
  const iceSet = new Set<number>();
  for (const [c, r] of iceCells) iceSet.add(cellKey(c, r, grid.cols));

  // Snapshot exits from grid by probing
  const exits: { side: ExitSide; index: number }[] = [];
  for (let c = 0; c < grid.cols; c++) {
    if (grid.hasExit('TOP', c)) exits.push({ side: 'TOP', index: c });
    if (grid.hasExit('BOTTOM', c)) exits.push({ side: 'BOTTOM', index: c });
  }
  for (let r = 0; r < grid.rows; r++) {
    if (grid.hasExit('LEFT', r)) exits.push({ side: 'LEFT', index: r });
    if (grid.hasExit('RIGHT', r)) exits.push({ side: 'RIGHT', index: r });
  }

  const idMap = new Map<string, number>();
  solverBlocks.forEach((b, i) => idMap.set(b.id, i));
  const depByIdx = solverBlocks.map((b) =>
    b.type === 'dependent' && b.dependsOn ? idMap.get(b.dependsOn) ?? -1 : -1,
  );

  return { cols: grid.cols, rows: grid.rows, blocks: solverBlocks, obstacleSet, iceSet, exits, depByIdx, idMap };
}

function exitAt(ctx: SolverCtx, side: ExitSide, idx: number): boolean {
  return ctx.exits.some((e) => e.side === side && e.index === idx);
}

function attempt(
  ctx: SolverCtx, positions: Pos[], unlockedColors: Set<Color>, idx: number, dir: Direction,
): { kind: 'slide' | 'exit'; nextX?: number; nextY?: number; exitedColor?: Color } | null {
  const cur = positions[idx];
  if (!cur) return null;
  const block = ctx.blocks[idx];

  if (block.type === 'lock' && !unlockedColors.has(block.color)) return null;
  if (block.type === 'dependent') {
    const p = ctx.depByIdx[idx];
    if (p >= 0 && positions[p] !== null) return null;
  }
  if (block.type === 'constrained' && block.direction !== dir) return null;

  const [dx, dy] = DELTA[dir];
  let curC = cur[0];
  let curR = cur[1];
  const sC = curC, sR = curR;

  while (true) {
    const nC = curC + dx;
    const nR = curR + dy;
    if (nC < 0 || nC >= ctx.cols || nR < 0 || nR >= ctx.rows) {
      const side = DIR_TO_SIDE[dir];
      const exitIdx = side === 'LEFT' || side === 'RIGHT' ? curR : curC;
      const dist = Math.abs(curC - sC) + Math.abs(curR - sR);
      if (exitAt(ctx, side, exitIdx)) return { kind: 'exit', exitedColor: block.color };
      if (dist === 0) return null;
      if (ctx.iceSet.has(cellKey(curC, curR, ctx.cols))) return null;
      return { kind: 'slide', nextX: curC, nextY: curR };
    }
    if (ctx.obstacleSet.has(cellKey(nC, nR, ctx.cols))) {
      const dist = Math.abs(curC - sC) + Math.abs(curR - sR);
      if (dist === 0) return null;
      if (ctx.iceSet.has(cellKey(curC, curR, ctx.cols))) return null;
      return { kind: 'slide', nextX: curC, nextY: curR };
    }
    let blocked = false;
    for (let i = 0; i < positions.length; i++) {
      if (i === idx) continue;
      const p = positions[i];
      if (!p) continue;
      if (p[0] === nC && p[1] === nR) { blocked = true; break; }
    }
    if (blocked) {
      const dist = Math.abs(curC - sC) + Math.abs(curR - sR);
      if (dist === 0) return null;
      if (ctx.iceSet.has(cellKey(curC, curR, ctx.cols))) return null;
      return { kind: 'slide', nextX: curC, nextY: curR };
    }
    curC = nC;
    curR = nR;
  }
}

function stateKey(positions: Pos[], unlocked: Set<Color>): string {
  let s = '';
  for (const p of positions) s += p ? `${p[0]},${p[1]}|` : 'X|';
  const colors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  for (const c of colors) s += unlocked.has(c) ? '1' : '0';
  return s;
}

function heuristic(ctx: SolverCtx, positions: Pos[]): number {
  let h = 0;
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    if (!p) continue;
    let min = Infinity;
    for (const e of ctx.exits) {
      const tc = e.side === 'LEFT' ? 0 : e.side === 'RIGHT' ? ctx.cols - 1 : e.index;
      const tr = e.side === 'TOP' ? 0 : e.side === 'BOTTOM' ? ctx.rows - 1 : e.index;
      const d = Math.abs(p[0] - tc) + Math.abs(p[1] - tr);
      if (d < min) min = d;
    }
    h += Math.max(1, Math.ceil(min / 4));
  }
  return h;
}

export interface HintMove {
  blockId: string;
  dir: Direction;
}

export function suggestMove(
  blocks: Block[],
  grid: Grid,
  iceCells: [number, number][],
  budget = 50000,
  maxDepth = 60,
): HintMove | null {
  const ctx = buildCtx(blocks, grid, iceCells);
  if (ctx.blocks.length === 0) return null;

  const init: Pos[] = ctx.blocks.map((b) => [b.pos[0], b.pos[1]]);
  const initUnlocked = new Set<Color>();
  // seed unlocked from grid's current state
  const COLOR_LIST: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  for (const c of COLOR_LIST) if (grid.isColorUnlocked(c)) initUnlocked.add(c);

  const initKey = stateKey(init, initUnlocked);
  const open = new MinHeap<{ p: Pos[]; u: Set<Color>; g: number; key: string }>();
  open.push({ p: init, u: initUnlocked, g: 0, key: initKey }, heuristic(ctx, init));
  const seen = new Map<string, number>();
  seen.set(initKey, 0);

  type ParentRec = { parent: string | null; move: HintMove | null };
  const parents = new Map<string, ParentRec>();
  parents.set(initKey, { parent: null, move: null });

  let visited = 0;
  while (open.size > 0 && visited < budget) {
    const cur = open.pop()!;
    visited++;

    let allOut = true;
    for (const p of cur.p) if (p) { allOut = false; break; }
    if (allOut) {
      let k: string | null = cur.key;
      let firstMove: HintMove | null = null;
      while (k) {
        const rec = parents.get(k);
        if (!rec) break;
        if (rec.move) firstMove = rec.move;
        if (!rec.parent) break;
        k = rec.parent;
      }
      return firstMove;
    }
    if (cur.g >= maxDepth) continue;

    for (let i = 0; i < cur.p.length; i++) {
      if (!cur.p[i]) continue;
      for (const d of DIRS) {
        const r = attempt(ctx, cur.p, cur.u, i, d);
        if (!r) continue;
        const next: Pos[] = cur.p.slice();
        let nextU = cur.u;
        if (r.kind === 'exit') {
          next[i] = null;
          if (r.exitedColor && !cur.u.has(r.exitedColor)) {
            nextU = new Set(cur.u);
            nextU.add(r.exitedColor);
          }
        } else {
          next[i] = [r.nextX!, r.nextY!];
        }
        const nk = stateKey(next, nextU);
        const ng = cur.g + 1;
        const prev = seen.get(nk);
        if (prev !== undefined && prev <= ng) continue;
        seen.set(nk, ng);
        parents.set(nk, { parent: cur.key, move: { blockId: ctx.blocks[i].id, dir: d } });
        open.push({ p: next, u: nextU, g: ng, key: nk }, ng + heuristic(ctx, next));
      }
    }
  }
  return null;
}
