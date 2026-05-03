import { LEVELS } from '../src/config/Levels.ts';
import { solve } from '../src/utils/Solver.ts';

let solvedCount = 0;
let totalOptimal = 0;
let totalVisited = 0;
let maxVisited = 0;
let slowest = { id: 0, ms: 0 };

console.log('id  cols size  blocks  obs  exits  optimal  visited   ms');
console.log('--- ---- ----  ------  ---  -----  -------  -------  ---');

for (const level of LEVELS) {
  const t0 = Date.now();
  const r = solve(level, { maxVisited: 800000, maxDepth: 200 });
  const ms = Date.now() - t0;
  const simple = level.blocks.filter((b) => (b.type ?? 'simple') === 'simple').length;
  const obs = level.blocks.filter((b) => b.type === 'obstacle').length;

  const flag = r.solvable ? '   ' : 'XXX';
  console.log(
    `${flag} ${String(level.id).padStart(2)}  ${level.cols}x${level.rows}  ${String(simple).padStart(3)}    ${String(obs).padStart(2)}    ${String(level.exits.length).padStart(3)}    ${String(level.optimalMoves).padStart(3)}    ${String(r.visited).padStart(6)}  ${String(ms).padStart(4)}`
  );

  if (r.solvable) {
    solvedCount++;
    totalOptimal += r.optimalMoves;
    totalVisited += r.visited;
    if (r.visited > maxVisited) maxVisited = r.visited;
    if (ms > slowest.ms) slowest = { id: level.id, ms };
  }
}

console.log('---');
console.log(`solved:  ${solvedCount}/${LEVELS.length}`);
console.log(`avg optimal: ${(totalOptimal / Math.max(1, solvedCount)).toFixed(1)}`);
console.log(`avg visited: ${(totalVisited / Math.max(1, solvedCount)).toFixed(0)}`);
console.log(`max visited: ${maxVisited}`);
console.log(`slowest level: ${slowest.id} (${slowest.ms}ms)`);

if (solvedCount < LEVELS.length) {
  process.exit(1);
}
