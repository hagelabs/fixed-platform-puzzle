// Bake 50 levels with v2 solver (slide momentum + constrained + dependent).
// Verified-solvable levels with smooth difficulty curve. Outputs Levels.ts.
//
// Usage: npx tsx scripts/bake-v2.ts

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type ExitSide = 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT';
type BlockType = 'simple' | 'constrained' | 'dependent' | 'obstacle';

interface BlockSpec {
  id: string;
  type: BlockType;
  pos: [number, number];
  direction?: Direction;
  dependsOn?: string;
}

interface Level {
  id: number;
  cols: number;
  rows: number;
  blocks: BlockSpec[];
  exits: { side: ExitSide; index: number }[];
}

const DIR_TO_SIDE: Record<Direction, ExitSide> = {
  UP: 'TOP', DOWN: 'BOTTOM', LEFT: 'LEFT', RIGHT: 'RIGHT',
};
const DELTA: Record<Direction, [number, number]> = {
  UP: [0, -1], DOWN: [0, 1], LEFT: [-1, 0], RIGHT: [1, 0],
};
const DIRS: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

// ============================================================
// A* solver mirrors src/systems/MovementSystem.ts slide rule
// ============================================================

type Pos = [number, number] | null;

interface SolverCtx {
  cols: number;
  rows: number;
  movables: BlockSpec[];
  obstacleSet: Set<number>;
  exitMap: Map<string, true>;
  exitTargets: { side: ExitSide; col: number; row: number }[];
  depByIdx: number[];
}

function cellKey(c: number, r: number, cols: number): number {
  return r * cols + c;
}

function exitKey(s: ExitSide, idx: number): string {
  return `${s}:${idx}`;
}

function buildCtx(level: Level): SolverCtx {
  const movables = level.blocks.filter((b) => b.type !== 'obstacle');
  const obstacleSet = new Set<number>(
    level.blocks.filter((b) => b.type === 'obstacle')
      .map((b) => cellKey(b.pos[0], b.pos[1], level.cols))
  );
  const exitMap = new Map<string, true>();
  for (const e of level.exits) exitMap.set(exitKey(e.side, e.index), true);

  const exitTargets = level.exits.map((e) => ({
    side: e.side,
    col: e.side === 'LEFT' ? 0 : e.side === 'RIGHT' ? level.cols - 1 : e.index,
    row: e.side === 'TOP' ? 0 : e.side === 'BOTTOM' ? level.rows - 1 : e.index,
  }));

  const idMap = new Map<string, number>();
  movables.forEach((b, i) => idMap.set(b.id, i));
  const depByIdx: number[] = movables.map((b) =>
    b.type === 'dependent' && b.dependsOn ? idMap.get(b.dependsOn) ?? -1 : -1
  );

  return { cols: level.cols, rows: level.rows, movables, obstacleSet, exitMap, exitTargets, depByIdx };
}

function attempt(
  ctx: SolverCtx, positions: Pos[], idx: number, dir: Direction
): { kind: 'slide' | 'exit'; nextX?: number; nextY?: number } | null {
  const cur = positions[idx];
  if (!cur) return null;
  const block = ctx.movables[idx];
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
      if (ctx.exitMap.has(exitKey(side, exitIdx))) return { kind: 'exit' };
      if (dist === 0) return null;
      return { kind: 'slide', nextX: curC, nextY: curR };
    }
    if (ctx.obstacleSet.has(cellKey(nC, nR, ctx.cols))) {
      const dist = Math.abs(curC - sC) + Math.abs(curR - sR);
      if (dist === 0) return null;
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
      return { kind: 'slide', nextX: curC, nextY: curR };
    }
    curC = nC;
    curR = nR;
  }
}

function stateKey(positions: Pos[]): string {
  let s = '';
  for (const p of positions) s += p ? `${p[0]},${p[1]}|` : 'X|';
  return s;
}

function heuristic(ctx: SolverCtx, positions: Pos[]): number {
  // sum manhattan to nearest exit + 1 per remaining block
  let h = 0;
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    if (!p) continue;
    let min = Infinity;
    for (const t of ctx.exitTargets) {
      const d = Math.abs(p[0] - t.col) + Math.abs(p[1] - t.row);
      if (d < min) min = d;
    }
    h += Math.max(1, Math.ceil(min / 4)); // slide moves ≈ manhattan/avg-distance
  }
  return h;
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

interface SolveResult {
  solvable: boolean;
  optimal: number;
  visited: number;
  path: { blockId: string; dir: Direction }[];
}

function solve(level: Level, maxStates = 60000, maxDepth = 60): SolveResult {
  const ctx = buildCtx(level);
  if (ctx.movables.length === 0) return { solvable: true, optimal: 0, visited: 0, path: [] };

  const init: Pos[] = ctx.movables.map((b) => [b.pos[0], b.pos[1]]);
  const initKey = stateKey(init);
  const initH = heuristic(ctx, init);

  const open = new MinHeap<{ p: Pos[]; g: number; key: string }>();
  open.push({ p: init, g: 0, key: initKey }, initH);
  const seen = new Map<string, number>();
  seen.set(initKey, 0);

  type ParentRec = { parent: string | null; move: { blockId: string; dir: Direction } | null };
  const parents = new Map<string, ParentRec>();
  parents.set(initKey, { parent: null, move: null });

  let visited = 0;
  while (open.size > 0) {
    if (visited > maxStates) return { solvable: false, optimal: -1, visited, path: [] };
    const cur = open.pop()!;
    visited++;

    let allOut = true;
    for (const p of cur.p) if (p) { allOut = false; break; }
    if (allOut) {
      const path: { blockId: string; dir: Direction }[] = [];
      let k: string | null = cur.key;
      while (k) {
        const rec = parents.get(k);
        if (!rec || !rec.move) break;
        path.push(rec.move);
        k = rec.parent;
      }
      path.reverse();
      return { solvable: true, optimal: cur.g, visited, path };
    }

    if (cur.g >= maxDepth) continue;
    const known = seen.get(cur.key);
    if (known !== undefined && known < cur.g) continue;

    for (let i = 0; i < cur.p.length; i++) {
      if (!cur.p[i]) continue;
      for (const d of DIRS) {
        const r = attempt(ctx, cur.p, i, d);
        if (!r) continue;
        const next: Pos[] = cur.p.slice();
        if (r.kind === 'exit') next[i] = null;
        else next[i] = [r.nextX!, r.nextY!];
        const nk = stateKey(next);
        const ng = cur.g + 1;
        const prev = seen.get(nk);
        if (prev !== undefined && prev <= ng) continue;
        seen.set(nk, ng);
        parents.set(nk, { parent: cur.key, move: { blockId: ctx.movables[i].id, dir: d } });
        const h = heuristic(ctx, next);
        open.push({ p: next, g: ng, key: nk }, ng + h);
      }
    }
  }
  return { solvable: false, optimal: -1, visited, path: [] };
}

// ============================================================
// Phase config — smooth curve, variety
// ============================================================

interface Phase {
  cols: number; rows: number;
  movables: number; yellows: number; deps: number; obstacles: number;
  exits: number;
  optMin: number; optMax: number;
  depthMode: 'linear' | 'branch' | 'mixed' | 'none';
  primarySide: ExitSide;
}

// PHASES generated programmatically — 4 packs × 30 levels = 120.
// Tutorial (1-30): simple + constrained dominant, small grids
// Gears (31-60): dependent intro + depth
// Stones (61-90): obstacle-heavy
// Master (91-120): mixed mastery
const SIDES_CYCLE: ExitSide[] = ['RIGHT', 'BOTTOM', 'LEFT', 'TOP'];

function buildPhases(): Phase[] {
  const out: Phase[] = [];

  // === Pack 1: Tutorial (L1-30) ===
  for (let i = 0; i < 30; i++) {
    const stage = Math.floor(i / 5); // 0..5
    const side = SIDES_CYCLE[i % 4];
    if (stage === 0) {
      // 1 movable, no obstacles, intro each side
      out.push({ cols: 6, rows: 6, movables: 1, yellows: i >= 2 ? 1 : 0, deps: 0, obstacles: 0, exits: 1, optMin: 1, optMax: 4, depthMode: 'none', primarySide: side });
    } else if (stage === 1) {
      // 1-2 movables, 1 obstacle
      out.push({ cols: 6, rows: 6, movables: 1 + (i % 2), yellows: 1, deps: 0, obstacles: 1, exits: 1, optMin: 1, optMax: 5, depthMode: 'none', primarySide: side });
    } else if (stage === 2) {
      // 2 movables, 1 obstacle
      out.push({ cols: 7, rows: 7, movables: 2, yellows: i % 2, deps: 0, obstacles: 1, exits: 1, optMin: 2, optMax: 6, depthMode: 'none', primarySide: side });
    } else if (stage === 3) {
      // 2-3 movables, 1-2 obstacles
      out.push({ cols: 7, rows: 7, movables: 2 + (i % 2), yellows: 1, deps: 0, obstacles: 1 + (i % 2), exits: 1, optMin: 3, optMax: 7, depthMode: 'none', primarySide: side });
    } else if (stage === 4) {
      // 3 movables, 2 obstacles
      out.push({ cols: 7, rows: 7, movables: 3, yellows: 1, deps: 0, obstacles: 2, exits: 1, optMin: 4, optMax: 8, depthMode: 'none', primarySide: side });
    } else {
      // 3 movables, mixed, intro 8x8
      out.push({ cols: 8, rows: 8, movables: 3, yellows: i % 2, deps: 0, obstacles: 2, exits: 1, optMin: 4, optMax: 9, depthMode: 'none', primarySide: side });
    }
  }

  // === Pack 2: Gears (L31-60) ===
  for (let i = 0; i < 30; i++) {
    const stage = Math.floor(i / 5);
    const side = SIDES_CYCLE[i % 4];
    if (stage === 0) {
      // intro dependent — 2 movables 1 dep
      out.push({ cols: 7, rows: 7, movables: 2, yellows: 0, deps: 1, obstacles: 1, exits: 1, optMin: 3, optMax: 8, depthMode: 'linear', primarySide: side });
    } else if (stage === 1) {
      // 3 movables, 1 dep, 2 obstacles
      out.push({ cols: 8, rows: 8, movables: 3, yellows: i % 2, deps: 1, obstacles: 2, exits: 1, optMin: 5, optMax: 10, depthMode: 'linear', primarySide: side });
    } else if (stage === 2) {
      // 3 movables, 2 dep, depth 2
      out.push({ cols: 8, rows: 8, movables: 3, yellows: 0, deps: 2, obstacles: 2, exits: 1, optMin: 6, optMax: 12, depthMode: 'linear', primarySide: side });
    } else if (stage === 3) {
      // 4 movables, 1-2 dep
      out.push({ cols: 8, rows: 8, movables: 4, yellows: i % 2, deps: 1 + (i % 2), obstacles: 2, exits: 1, optMin: 7, optMax: 13, depthMode: 'linear', primarySide: side });
    } else if (stage === 4) {
      // 4 movables, 2 dep, branch mode
      out.push({ cols: 9, rows: 9, movables: 4, yellows: 1, deps: 2, obstacles: 3, exits: 1, optMin: 8, optMax: 14, depthMode: i % 2 ? 'branch' : 'linear', primarySide: side });
    } else {
      // 4 movables, 2 dep mixed
      out.push({ cols: 9, rows: 9, movables: 4, yellows: 1, deps: 2, obstacles: 3, exits: 1, optMin: 9, optMax: 15, depthMode: 'mixed', primarySide: side });
    }
  }

  // === Pack 3: Stones (L61-90) — obstacle-heavy ===
  for (let i = 0; i < 30; i++) {
    const stage = Math.floor(i / 5);
    const side = SIDES_CYCLE[i % 4];
    if (stage === 0) {
      // 3 movables 3 obstacles
      out.push({ cols: 9, rows: 9, movables: 3, yellows: 1, deps: 0, obstacles: 3, exits: 1, optMin: 5, optMax: 12, depthMode: 'none', primarySide: side });
    } else if (stage === 1) {
      // 4 movables 3-4 obstacles
      out.push({ cols: 9, rows: 9, movables: 4, yellows: i % 2, deps: 1, obstacles: 3 + (i % 2), exits: 1, optMin: 7, optMax: 13, depthMode: 'linear', primarySide: side });
    } else if (stage === 2) {
      // 4 movables 4 obstacles
      out.push({ cols: 10, rows: 10, movables: 4, yellows: 1, deps: 1, obstacles: 4, exits: 1, optMin: 8, optMax: 14, depthMode: 'linear', primarySide: side });
    } else if (stage === 3) {
      // 5 movables 4 obstacles
      out.push({ cols: 10, rows: 10, movables: 5, yellows: 1, deps: 2, obstacles: 4, exits: 1, optMin: 10, optMax: 16, depthMode: 'linear', primarySide: side });
    } else if (stage === 4) {
      // 5 movables 5 obstacles, dual exit intro
      out.push({ cols: 10, rows: 10, movables: 5, yellows: 1, deps: 2, obstacles: 5, exits: i % 2 ? 2 : 1, optMin: 10, optMax: 17, depthMode: 'branch', primarySide: side });
    } else {
      // 5 movables 5 obstacles
      out.push({ cols: 10, rows: 10, movables: 5, yellows: 1, deps: 2, obstacles: 5, exits: 1, optMin: 12, optMax: 18, depthMode: 'mixed', primarySide: side });
    }
  }

  // === Pack 4: Master (L91-120) — mixed mastery ===
  for (let i = 0; i < 30; i++) {
    const stage = Math.floor(i / 5);
    const side = SIDES_CYCLE[i % 4];
    if (stage === 0) {
      // 5 movables, 3 deps, branching
      out.push({ cols: 10, rows: 10, movables: 5, yellows: 1, deps: 3, obstacles: 3, exits: 1, optMin: 12, optMax: 19, depthMode: 'branch', primarySide: side });
    } else if (stage === 1) {
      // 5 movables, 3 deps, mixed
      out.push({ cols: 10, rows: 10, movables: 5, yellows: 1, deps: 3, obstacles: 4, exits: 1, optMin: 14, optMax: 21, depthMode: 'mixed', primarySide: side });
    } else if (stage === 2) {
      // 5 movables, dual exit, mixed
      out.push({ cols: 10, rows: 10, movables: 5, yellows: 1, deps: 2, obstacles: 4, exits: 2, optMin: 13, optMax: 21, depthMode: 'mixed', primarySide: side });
    } else if (stage === 3) {
      // 5 movables, 4 deps
      out.push({ cols: 10, rows: 10, movables: 5, yellows: 1, deps: 3, obstacles: 4, exits: 1, optMin: 15, optMax: 22, depthMode: 'linear', primarySide: side });
    } else if (stage === 4) {
      // 5 movables, 4 deps, mixed
      out.push({ cols: 10, rows: 10, movables: 5, yellows: i % 2 ? 2 : 1, deps: 3, obstacles: 5, exits: i % 2 ? 2 : 1, optMin: 15, optMax: 23, depthMode: 'mixed', primarySide: side });
    } else {
      // legendary
      out.push({ cols: 10, rows: 10, movables: 5, yellows: 1, deps: 3, obstacles: 5, exits: 2, optMin: 16, optMax: 24, depthMode: 'mixed', primarySide: side });
    }
  }

  return out;
}

const PHASES: Phase[] = buildPhases();
const TOTAL = PHASES.length;

function getPhase(id: number): Phase { return PHASES[id - 1]; }

// ============================================================
// Generator
// ============================================================

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
}

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function sideToDir(s: ExitSide): Direction {
  return s === 'TOP' ? 'UP' : s === 'BOTTOM' ? 'DOWN' : s === 'LEFT' ? 'LEFT' : 'RIGHT';
}

function generateLevel(id: number, seed: number): Level | null {
  const rand = rng(seed);
  const phase = getPhase(id);
  const { cols, rows } = phase;
  const primaryDir = sideToDir(phase.primarySide);
  const isHorizontal = phase.primarySide === 'LEFT' || phase.primarySide === 'RIGHT';

  // Exits
  const exits: { side: ExitSide; index: number }[] = [];
  if (phase.exits === 1) {
    const max = isHorizontal ? rows : cols;
    exits.push({ side: phase.primarySide, index: 1 + Math.floor(rand() * (max - 2)) });
  } else if (phase.exits === 2) {
    const max = isHorizontal ? rows : cols;
    if (rand() < 0.7) {
      const i1 = 1 + Math.floor(rand() * Math.max(1, Math.floor((max - 4) / 2)));
      const i2 = Math.min(max - 2, i1 + 3 + Math.floor(rand() * 2));
      exits.push({ side: phase.primarySide, index: i1 });
      if (i2 > i1 + 1) exits.push({ side: phase.primarySide, index: i2 });
      else exits.push({ side: phase.primarySide, index: i1 + 2 });
    } else {
      const other: ExitSide =
        phase.primarySide === 'RIGHT' ? 'BOTTOM' :
        phase.primarySide === 'BOTTOM' ? 'RIGHT' :
        phase.primarySide === 'LEFT' ? 'TOP' : 'LEFT';
      exits.push({ side: phase.primarySide, index: 1 + Math.floor(rand() * (max - 2)) });
      const m2 = (other === 'TOP' || other === 'BOTTOM') ? cols : rows;
      exits.push({ side: other, index: 1 + Math.floor(rand() * (m2 - 2)) });
    }
  } else if (phase.exits === 4) {
    exits.push({ side: 'TOP', index: Math.floor(cols / 2) });
    exits.push({ side: 'BOTTOM', index: Math.floor(cols / 2) });
    exits.push({ side: 'LEFT', index: Math.floor(rows / 2) });
    exits.push({ side: 'RIGHT', index: Math.floor(rows / 2) });
  }

  const occupied: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const blocks: BlockSpec[] = [];

  // Obstacles
  for (let i = 0; i < phase.obstacles; i++) {
    let attempts = 0;
    while (attempts++ < 50) {
      const x = Math.floor(rand() * cols);
      const y = Math.floor(rand() * rows);
      if (occupied[y][x]) continue;
      // avoid placing obstacle on exit cell
      const isExitCell = exits.some((e) => {
        const tc = e.side === 'LEFT' ? 0 : e.side === 'RIGHT' ? cols - 1 : e.index;
        const tr = e.side === 'TOP' ? 0 : e.side === 'BOTTOM' ? rows - 1 : e.index;
        return x === tc && y === tr;
      });
      if (isExitCell) continue;
      occupied[y][x] = true;
      blocks.push({ id: `o${i + 1}`, type: 'obstacle', pos: [x, y] });
      break;
    }
  }

  // Roles
  const roles: ('simple' | 'constrained' | 'dependent')[] = [];
  for (let i = 0; i < phase.deps; i++) roles.push('dependent');
  for (let i = 0; i < phase.yellows; i++) roles.push('constrained');
  while (roles.length < phase.movables) roles.push('simple');
  if (roles.length > phase.movables) roles.length = phase.movables;
  const nonDep = roles.filter((r) => r !== 'dependent').length;
  if (nonDep === 0 && roles.length > 0) {
    const i = roles.indexOf('dependent');
    roles[i] = 'simple';
  }

  // Sort: place non-dep first, dep after (dep gets later positions in queue)
  roles.sort((a, b) => (a === 'dependent' ? 1 : 0) - (b === 'dependent' ? 1 : 0));

  // Place movables
  const ids: string[] = [];
  for (let i = 0; i < phase.movables; i++) ids.push(`m${i + 1}`);

  // primary axis line(s) for biased placement
  const primaryRows: number[] = [];
  const primaryCols: number[] = [];
  for (const e of exits) {
    if (e.side === 'LEFT' || e.side === 'RIGHT') primaryRows.push(e.index);
    else primaryCols.push(e.index);
  }

  for (let i = 0; i < phase.movables; i++) {
    const role = roles[i];
    let placed = false;
    for (let attempt = 0; attempt < 80 && !placed; attempt++) {
      let x: number, y: number;
      if (rand() < 0.75 && (primaryRows.length > 0 || primaryCols.length > 0)) {
        if (isHorizontal && primaryRows.length > 0) {
          y = pick(rand, primaryRows);
          x = Math.floor(rand() * cols);
        } else if (!isHorizontal && primaryCols.length > 0) {
          x = pick(rand, primaryCols);
          y = Math.floor(rand() * rows);
        } else {
          x = Math.floor(rand() * cols);
          y = Math.floor(rand() * rows);
        }
      } else {
        x = Math.floor(rand() * cols);
        y = Math.floor(rand() * rows);
      }
      if (occupied[y][x]) continue;
      occupied[y][x] = true;

      const spec: BlockSpec = { id: ids[i], type: role, pos: [x, y] };
      if (role === 'constrained') spec.direction = primaryDir;
      blocks.push(spec);
      placed = true;
    }
    if (!placed) return null;
  }

  // Wire dependents
  const depBlocks = blocks.filter((b) => b.type === 'dependent');
  const nonDepBlocks = blocks.filter((b) => b.type === 'simple' || b.type === 'constrained');
  if (depBlocks.length > 0 && nonDepBlocks.length === 0) return null;

  if (phase.depthMode === 'linear') {
    let parent = nonDepBlocks[0];
    for (const d of depBlocks) {
      d.dependsOn = parent.id;
      parent = d;
    }
  } else if (phase.depthMode === 'branch') {
    const root = nonDepBlocks[0];
    for (const d of depBlocks) d.dependsOn = root.id;
  } else if (phase.depthMode === 'mixed') {
    const root = nonDepBlocks[0];
    let parent = root;
    for (let i = 0; i < depBlocks.length; i++) {
      if (i % 2 === 0) {
        depBlocks[i].dependsOn = parent.id;
        parent = depBlocks[i];
      } else {
        depBlocks[i].dependsOn = root.id;
      }
    }
  } else {
    for (const d of depBlocks) d.dependsOn = nonDepBlocks[0].id;
  }

  return { id, cols, rows, blocks, exits };
}

// ============================================================
// Bake loop
// ============================================================

function levelSig(level: Level): string {
  const blockSig = [...level.blocks]
    .map((b) => `${b.type}@${b.pos[0]},${b.pos[1]}|${b.direction ?? ''}|${b.dependsOn ?? ''}`)
    .sort().join(';');
  const exitSig = [...level.exits].map((e) => `${e.side}@${e.index}`).sort().join(';');
  return `${level.cols}x${level.rows}#${blockSig}#${exitSig}`;
}

interface BakedLevel { lvl: Level; opt: number; path: { blockId: string; dir: Direction }[]; }

function bakeAll(): BakedLevel[] {
  const out: BakedLevel[] = [];
  const sigs = new Set<string>();

  for (let id = 1; id <= TOTAL; id++) {
    const phase = getPhase(id);
    let chosen: BakedLevel | null = null;
    const passes: { maxAttempts: number; budget: number; depth: number; strict: boolean }[] = [
      { maxAttempts: 200, budget: 40000, depth: 50, strict: true },
      { maxAttempts: 200, budget: 80000, depth: 60, strict: true },
      { maxAttempts: 300, budget: 120000, depth: 70, strict: false },
    ];

    outer:
    for (const pass of passes) {
      for (let attempt = 0; attempt < pass.maxAttempts; attempt++) {
        const seed = id * 100003 + attempt * 977 + (pass.budget * 31);
        const lvl = generateLevel(id, seed);
        if (!lvl) continue;
        const sig = levelSig(lvl);
        if (sigs.has(sig)) continue;
        const r = solve(lvl, pass.budget, pass.depth);
        if (!r.solvable) continue;
        if (pass.strict && (r.optimal < phase.optMin || r.optimal > phase.optMax)) continue;
        chosen = { lvl, opt: r.optimal, path: r.path };
        break outer;
      }
    }

    if (!chosen) {
      console.error(`L${id}: failed bake`);
      process.exit(1);
    }
    sigs.add(levelSig(chosen.lvl));
    out.push(chosen);
    const inBand = chosen.opt >= phase.optMin && chosen.opt <= phase.optMax ? '✓' : '~';
    console.log(
      `L${String(id).padStart(2)} (${phase.cols}x${phase.rows}, ${chosen.lvl.exits.length}ex, ${chosen.lvl.blocks.length}b): opt=${chosen.opt} band=[${phase.optMin}-${phase.optMax}] ${inBand} path=${chosen.path.length}`
    );
  }
  return out;
}

// ============================================================
// Emit Levels.ts
// ============================================================

function emitLevelsTs(baked: BakedLevel[]): string {
  const header = `import { LevelData, BlockData, Color, ExitZone, Direction } from '../types/Game';

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
const SC = (id: string, c: number, r: number, color: Color): BlockData => ({
  id, color, position: [c, r], size: [1, 1], type: 'simple',
});
const K = (id: string, c: number, r: number, unlockAt: number, color: Color = 'purple'): BlockData => ({
  id, color, position: [c, r], size: [1, 1], type: 'lock', unlockAt,
});
const E = (
  side: 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT',
  index: number,
): ExitZone => ({ side, index });
const L = (
  id: number, cols: number, rows: number, blocks: BlockData[], exits: ExitZone[],
  parMoves: number, pack?: string, iceCells?: [number, number][],
): LevelData => ({ id, cols, rows, blocks, exits, parMoves, pack, iceCells });

// AUTO-BAKED via scripts/bake-v2.ts. Each level verified solvable by A* solver
// matching MovementSystem (slide momentum + constrained + dependent).
// parMoves = optimal solver solution length (used for 3-star thresholds).

export const LEVELS: LevelData[] = [
`;

  const packOf = (id: number): string => {
    if (id <= 30) return 'tutorial';
    if (id <= 60) return 'gears';
    if (id <= 90) return 'stones';
    return 'master';
  };

  const body = baked.map(({ lvl, opt }) => {
    const blocksStr = lvl.blocks.map((b) => {
      if (b.type === 'simple') return `S('${b.id}',${b.pos[0]},${b.pos[1]})`;
      if (b.type === 'obstacle') return `O('${b.id}',${b.pos[0]},${b.pos[1]})`;
      if (b.type === 'constrained') return `C('${b.id}',${b.pos[0]},${b.pos[1]},'${b.direction}')`;
      return `D('${b.id}',${b.pos[0]},${b.pos[1]},'${b.dependsOn}')`;
    }).join(', ');
    const exitsStr = lvl.exits.map((e) => `E('${e.side}',${e.index})`).join(', ');
    return `  L(${lvl.id}, ${lvl.cols}, ${lvl.rows}, [${blocksStr}], [${exitsStr}], ${opt}, '${packOf(lvl.id)}'),`;
  }).join('\n');

  // Fixture levels — hand-authored to showcase ice (push) + lock (counter) mechanics. Appended to master pack.
  const fixtures = `
  // === FIXTURE LEVELS (hand-authored: ice push + lock counter mechanics) ===
  // L121 — ice push intro: skip 1 obstacle
  L(121, 5, 3, [SC('m1',0,1,'red'), O('o1',2,1)], [E('RIGHT',1)], 2, 'master', [[1,1]]),
  // L122 — chain push through two obstacles
  L(122, 7, 3, [SC('m1',0,1,'red'), O('o1',2,1), O('o2',4,1)], [E('RIGHT',1)], 2, 'master', [[1,1],[3,1]]),
  // L123 — parallel ice paths, 2 simples
  L(123, 6, 4, [SC('m1',0,1,'red'), SC('m2',0,2,'blue'), O('o1',3,1), O('o2',3,2)], [E('RIGHT',1), E('RIGHT',2)], 4, 'master', [[2,1],[2,2]]),
  // L124 — lock counter intro: unlockAt 1
  L(124, 6, 2, [SC('m1',0,0,'red'), K('k1',0,1,1)], [E('RIGHT',0), E('RIGHT',1)], 2, 'master'),
  // L125 — lock unlockAt 2 (need 2 exits first)
  L(125, 7, 3, [SC('m1',0,0,'red'), SC('m2',0,1,'blue'), K('k1',0,2,2)], [E('RIGHT',0), E('RIGHT',1), E('RIGHT',2)], 3, 'master'),
  // L126 — two locks, staggered unlock (1 and 2)
  L(126, 8, 3, [SC('m1',0,0,'red'), K('k1',0,1,1), K('k2',0,2,2)], [E('RIGHT',0), E('RIGHT',1), E('RIGHT',2)], 3, 'master'),`;

  const bakedSolutions = baked.map(({ lvl, path }) => {
    const moves = path.map((m) => `{blockId:'${m.blockId}',dir:'${m.dir}'}`).join(', ');
    return `  ${lvl.id}: [${moves}],`;
  }).join('\n');

  const fixtureSolutions = `  121: [{blockId:'m1',dir:'RIGHT'},{blockId:'m1',dir:'RIGHT'}],
  122: [{blockId:'m1',dir:'RIGHT'},{blockId:'m1',dir:'RIGHT'}],
  123: [{blockId:'m1',dir:'RIGHT'},{blockId:'m1',dir:'RIGHT'},{blockId:'m2',dir:'RIGHT'},{blockId:'m2',dir:'RIGHT'}],
  124: [{blockId:'m1',dir:'RIGHT'},{blockId:'k1',dir:'RIGHT'}],
  125: [{blockId:'m1',dir:'RIGHT'},{blockId:'m2',dir:'RIGHT'},{blockId:'k1',dir:'RIGHT'}],
  126: [{blockId:'m1',dir:'RIGHT'},{blockId:'k1',dir:'RIGHT'},{blockId:'k2',dir:'RIGHT'}],`;

  const solutionsBody = bakedSolutions + '\n' + fixtureSolutions;

  const footer = `
];

export type SolutionMove = { blockId: string; dir: Direction };

export const SOLUTIONS: Record<number, SolutionMove[]> = {
${solutionsBody}
};

export function getSolution(id: number): SolutionMove[] {
  return SOLUTIONS[id] ?? [];
}

export function getLevel(id: number): LevelData {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, id - 1))];
}

export const MAX_LEVEL_COLS = LEVELS.reduce((m, l) => Math.max(m, l.cols), 0);
export const MAX_LEVEL_ROWS = LEVELS.reduce((m, l) => Math.max(m, l.rows), 0);

export interface WorldPack {
  id: string;
  name: string;
  theme: string;
  levelIds: number[];
  unlockAfter: number;
}

export const PACKS: WorldPack[] = [
  { id: 'tutorial', name: 'Tutorial',  theme: 'intro',     levelIds: LEVELS.filter(l => l.pack === 'tutorial').map(l => l.id), unlockAfter: 0 },
  { id: 'gears',    name: 'Gears',     theme: 'dependent', levelIds: LEVELS.filter(l => l.pack === 'gears').map(l => l.id),    unlockAfter: 25 },
  { id: 'stones',   name: 'Stones',    theme: 'obstacle',  levelIds: LEVELS.filter(l => l.pack === 'stones').map(l => l.id),   unlockAfter: 55 },
  { id: 'master',   name: 'Master',    theme: 'mixed',     levelIds: LEVELS.filter(l => l.pack === 'master').map(l => l.id),   unlockAfter: 85 },
];

export const FIXTURE_IDS = LEVELS.filter((l) => l.id >= 121).map((l) => l.id);

export function getPackOf(levelId: number): WorldPack | undefined {
  return PACKS.find((p) => p.levelIds.includes(levelId));
}

export function starsFor(parMoves: number, moves: number): 1 | 2 | 3 {
  if (moves <= parMoves) return 3;
  if (moves <= Math.ceil(parMoves * 1.4)) return 2;
  return 1;
}
`;
  return header + body + '\n' + fixtures + footer;
}

// ============================================================
// Run
// ============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(`Baking ${TOTAL} levels (v2 solver)...`);
const t0 = Date.now();
const levels = bakeAll();
const dt = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`---`);
console.log(`Baked ${levels.length} levels in ${dt}s`);

const out = emitLevelsTs(levels);
const outPath = resolve(__dirname, '..', 'src', 'config', 'Levels.ts');
writeFileSync(outPath, out, 'utf8');
console.log(`Wrote ${outPath}`);
