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

// AUTO-BAKED via scripts/bake-v2.ts. Each level verified solvable by A* solver
// matching MovementSystem (slide momentum + constrained + dependent).

export const LEVELS: LevelData[] = [
  L(1, 6, 6, [S('m1',2,1)], [E('RIGHT',1)]),
  L(2, 6, 6, [S('m1',2,0)], [E('BOTTOM',2)]),
  L(3, 6, 6, [C('m1',4,1,'LEFT')], [E('LEFT',1)]),
  L(4, 6, 6, [O('o1',5,0), C('m1',4,2,'UP')], [E('TOP',4)]),
  L(5, 7, 7, [S('m1',3,1), D('m2',1,1,'m1')], [E('RIGHT',1)]),
  L(6, 7, 7, [O('o1',3,0), C('m1',4,1,'DOWN'), S('m2',0,4)], [E('BOTTOM',4)]),
  L(7, 7, 7, [O('o1',0,2), S('m1',6,4), S('m2',2,6), S('m3',0,3)], [E('LEFT',3)]),
  L(8, 7, 7, [O('o1',6,0), C('m1',5,6,'UP'), D('m2',6,2,'m1')], [E('TOP',5)]),
  L(9, 8, 8, [O('o1',7,4), O('o2',2,4), C('m1',4,3,'RIGHT'), S('m2',1,6), S('m3',1,3)], [E('RIGHT',3)]),
  L(10, 8, 8, [O('o1',0,6), O('o2',4,7), S('m1',2,6), S('m2',5,1), D('m3',5,6,'m1')], [E('BOTTOM',5)]),
  L(11, 8, 8, [O('o1',7,2), O('o2',2,4), C('m1',6,1,'LEFT'), S('m2',4,1), D('m3',4,7,'m1')], [E('LEFT',1)]),
  L(12, 8, 8, [O('o1',3,0), O('o2',1,7), C('m1',2,7,'UP'), S('m2',6,6), S('m3',5,0), S('m4',2,2)], [E('TOP',2)]),
  L(13, 8, 8, [O('o1',1,7), O('o2',0,2), S('m1',1,1), S('m2',6,1), S('m3',7,1), D('m4',3,1,'m1')], [E('RIGHT',1)]),
  L(14, 8, 8, [O('o1',3,0), O('o2',5,6), C('m1',4,7,'DOWN'), S('m2',1,5), S('m3',3,2), D('m4',4,4,'m1')], [E('BOTTOM',4)]),
  L(15, 8, 8, [O('o1',0,6), O('o2',1,4), S('m1',7,5), S('m2',0,5), D('m3',5,5,'m1'), D('m4',2,5,'m3')], [E('LEFT',5)]),
  L(16, 9, 9, [O('o1',0,0), O('o2',3,2), C('m1',1,2,'UP'), S('m2',0,5), S('m3',4,0), D('m4',2,7,'m1')], [E('TOP',1)]),
  L(17, 9, 9, [O('o1',8,6), O('o2',8,2), O('o3',7,1), C('m1',0,5,'RIGHT'), S('m2',5,5), S('m3',2,5), S('m4',7,8)], [E('RIGHT',5)]),
  L(18, 9, 9, [O('o1',2,8), O('o2',5,8), O('o3',4,2), S('m1',6,2), S('m2',6,8), D('m3',4,4,'m1'), D('m4',6,4,'m1')], [E('BOTTOM',6)]),
  L(19, 9, 9, [O('o1',1,5), O('o2',8,3), O('o3',2,6), C('m1',7,2,'LEFT'), S('m2',8,2), S('m3',7,5), D('m4',5,7,'m1')], [E('LEFT',2)]),
  L(20, 9, 9, [O('o1',1,5), O('o2',2,2), O('o3',6,3), C('m1',5,3,'UP'), S('m2',2,6), S('m3',8,5), S('m4',5,4), S('m5',5,0)], [E('TOP',5)]),
  L(21, 9, 9, [O('o1',2,3), O('o2',5,4), O('o3',0,8), S('m1',8,7), S('m2',8,0), D('m3',1,7,'m1'), D('m4',6,7,'m3')], [E('RIGHT',7)]),
  L(22, 9, 9, [O('o1',7,8), O('o2',6,2), O('o3',4,8), C('m1',6,8,'DOWN'), S('m2',6,0), D('m3',6,7,'m1'), D('m4',6,6,'m3')], [E('BOTTOM',6)]),
  L(23, 10, 10, [O('o1',9,7), O('o2',5,2), O('o3',7,9), C('m1',1,8,'LEFT'), S('m2',3,8), S('m3',6,0), D('m4',9,8,'m1')], [E('LEFT',8)]),
  L(24, 10, 10, [O('o1',1,4), O('o2',2,0), O('o3',4,6), C('m1',1,0,'UP'), S('m2',5,9), S('m3',1,5), S('m4',1,8), D('m5',1,3,'m1')], [E('TOP',1)]),
  L(25, 10, 10, [O('o1',1,5), O('o2',7,9), O('o3',0,7), C('m1',9,6,'RIGHT'), S('m2',0,6), S('m3',4,6), D('m4',3,6,'m1'), D('m5',6,6,'m4')], [E('RIGHT',6)]),
  L(26, 10, 10, [O('o1',0,3), O('o2',8,8), O('o3',3,0), S('m1',2,1), S('m2',2,8), D('m3',2,4,'m1'), D('m4',2,6,'m1')], [E('BOTTOM',2)]),
  L(27, 10, 10, [O('o1',0,5), O('o2',6,6), O('o3',6,2), S('m1',4,6), S('m2',5,6), D('m3',8,6,'m1'), D('m4',7,6,'m3'), D('m5',6,8,'m4')], [E('LEFT',6)]),
  L(28, 10, 10, [O('o1',5,8), O('o2',7,9), O('o3',3,0), O('o4',4,4), C('m1',2,8,'UP'), S('m2',2,3), S('m3',2,0), S('m4',6,6), D('m5',9,4,'m1')], [E('TOP',2)]),
  L(29, 10, 10, [O('o1',6,9), O('o2',2,8), O('o3',8,1), O('o4',9,6), C('m1',6,7,'RIGHT'), S('m2',5,7), S('m3',8,7), D('m4',4,7,'m1'), D('m5',9,5,'m4')], [E('RIGHT',7)]),
  L(30, 10, 10, [O('o1',2,1), O('o2',9,2), O('o3',7,2), O('o4',3,3), C('m1',4,5,'DOWN'), S('m2',9,0), S('m3',9,3), S('m4',0,6), D('m5',4,1,'m1')], [E('BOTTOM',4)]),
  L(31, 10, 10, [O('o1',6,3), O('o2',8,5), O('o3',9,5), S('m1',1,4), S('m2',2,6), S('m3',6,8), S('m4',9,3)], [E('RIGHT',3), E('RIGHT',6)]),
  L(32, 10, 10, [O('o1',9,2), O('o2',2,8), O('o3',6,3), O('o4',9,5), S('m1',7,6), S('m2',7,5), D('m3',3,8,'m1'), D('m4',7,4,'m3'), D('m5',7,0,'m4')], [E('BOTTOM',7)]),
  L(33, 10, 10, [O('o1',9,1), O('o2',7,3), O('o3',4,2), O('o4',8,5), C('m1',8,2,'RIGHT'), S('m2',0,2), S('m3',3,0), D('m4',1,2,'m1'), D('m5',9,4,'m1')], [E('RIGHT',2)]),
  L(34, 10, 10, [O('o1',8,0), O('o2',3,1), O('o3',6,0), O('o4',7,9), C('m1',5,5,'UP'), S('m2',9,8), S('m3',0,7), D('m4',9,2,'m1'), D('m5',0,6,'m1')], [E('TOP',5)]),
  L(35, 10, 10, [O('o1',7,9), O('o2',6,6), O('o3',2,7), C('m1',1,5,'DOWN'), C('m2',1,7,'DOWN'), S('m3',9,1), S('m4',0,6), S('m5',1,0)], [E('BOTTOM',1), E('RIGHT',7)]),
  L(36, 10, 10, [O('o1',1,3), O('o2',4,2), O('o3',0,4), O('o4',1,1), S('m1',3,3), D('m2',5,1,'m1'), D('m3',2,3,'m2'), D('m4',4,3,'m3'), D('m5',8,3,'m4')], [E('LEFT',3)]),
  L(37, 10, 10, [O('o1',9,1), O('o2',3,1), O('o3',7,0), C('m1',3,9,'DOWN')], [E('BOTTOM',3)]),
  L(38, 10, 10, [O('o1',9,0), O('o2',5,9), O('o3',3,3), O('o4',8,3), C('m1',9,6,'RIGHT'), S('m2',8,6), D('m3',6,6,'m1'), D('m4',0,6,'m1'), D('m5',5,6,'m1')], [E('RIGHT',6)]),
  L(39, 10, 10, [O('o1',3,4), O('o2',4,5), O('o3',3,3), O('o4',1,1), C('m1',2,0,'UP'), S('m2',8,8), S('m3',2,8), D('m4',2,6,'m1')], [E('TOP',2)]),
  L(40, 10, 10, [O('o1',5,9), O('o2',4,3), O('o3',9,9), O('o4',8,5), C('m1',7,1,'RIGHT'), S('m2',1,4), S('m3',9,1), D('m4',3,1,'m1'), D('m5',1,8,'m1')], [E('RIGHT',1), E('BOTTOM',8)]),
  L(41, 10, 10, [O('o1',7,2), O('o2',4,3), O('o3',4,9), O('o4',0,2), S('m1',5,3), D('m2',3,2,'m1'), D('m3',5,4,'m2'), D('m4',5,7,'m3'), D('m5',5,8,'m4')], [E('BOTTOM',5)]),
  L(42, 10, 10, [O('o1',3,4), O('o2',8,4), O('o3',7,1), O('o4',8,1), C('m1',3,2,'LEFT'), S('m2',6,2), S('m3',0,2), D('m4',6,9,'m1'), D('m5',9,5,'m1')], [E('LEFT',2)]),
  L(43, 10, 10, [O('o1',1,1), O('o2',9,6), O('o3',5,9), O('o4',0,3), S('m1',2,4), S('m2',6,4), D('m3',6,6,'m1'), D('m4',6,9,'m1'), D('m5',6,2,'m1')], [E('TOP',6)]),
  L(44, 10, 10, [O('o1',3,2), O('o2',2,6), O('o3',8,7), O('o4',6,5), C('m1',1,3,'RIGHT'), C('m2',2,3,'RIGHT'), S('m3',4,3), S('m4',7,7), D('m5',9,7,'m1')], [E('RIGHT',3), E('BOTTOM',2)]),
  L(45, 10, 10, [O('o1',2,4), O('o2',2,3), O('o3',8,2), O('o4',0,6), C('m1',3,6,'DOWN'), S('m2',3,0), D('m3',3,1,'m1'), D('m4',9,6,'m3'), D('m5',3,4,'m4')], [E('BOTTOM',3)]),
  L(46, 10, 10, [O('o1',1,2), O('o2',4,0), O('o3',8,3), O('o4',5,6), C('m1',3,5,'RIGHT'), C('m2',8,5,'RIGHT'), C('m3',9,5,'RIGHT'), C('m4',0,5,'RIGHT')], [E('TOP',5), E('BOTTOM',5), E('LEFT',5), E('RIGHT',5)]),
  L(47, 10, 10, [O('o1',3,0), O('o2',2,0), O('o3',0,6), O('o4',3,7), O('o5',7,0), C('m1',6,1,'LEFT'), S('m2',1,8), D('m3',5,5,'m1'), D('m4',4,0,'m1'), D('m5',7,8,'m3')], [E('LEFT',1)]),
  L(48, 10, 10, [O('o1',1,1), O('o2',7,4), O('o3',2,1), O('o4',3,5), C('m1',6,5,'DOWN'), S('m2',6,3), D('m3',8,9,'m1'), D('m4',2,0,'m1'), D('m5',9,6,'m3')], [E('BOTTOM',2), E('BOTTOM',6)]),
  L(49, 10, 10, [O('o1',3,2), O('o2',5,5), O('o3',8,2), O('o4',5,8), O('o5',5,4), C('m1',2,6,'UP'), C('m2',6,8,'UP'), S('m3',0,6), D('m4',6,1,'m1'), D('m5',6,2,'m1')], [E('TOP',2), E('TOP',6)]),
  L(50, 10, 10, [O('o1',6,9), O('o2',5,4), O('o3',0,6), O('o4',0,4), C('m1',9,5,'RIGHT'), S('m2',1,5), D('m3',5,5,'m1'), D('m4',5,2,'m1'), D('m5',6,5,'m3')], [E('RIGHT',2), E('RIGHT',5)]),
];

export type SolutionMove = { blockId: string; dir: Direction };

export const SOLUTIONS: Record<number, SolutionMove[]> = {
  1: [{blockId:'m1',dir:'RIGHT'}],
  2: [{blockId:'m1',dir:'DOWN'}],
  3: [{blockId:'m1',dir:'LEFT'}],
  4: [{blockId:'m1',dir:'UP'}],
  5: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}],
  6: [{blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}],
  7: [{blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'LEFT'}],
  8: [{blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}],
  9: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}],
  10: [{blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}],
  11: [{blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}],
  12: [{blockId:'m4',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}],
  13: [{blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}],
  14: [{blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}],
  15: [{blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}],
  16: [{blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}],
  17: [{blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}],
  18: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}],
  19: [{blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}],
  20: [{blockId:'m2',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'UP'}],
  21: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}],
  22: [{blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}],
  23: [{blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}],
  24: [{blockId:'m1',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}],
  25: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}],
  26: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}],
  27: [{blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}],
  28: [{blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}],
  29: [{blockId:'m3',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}],
  30: [{blockId:'m1',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}],
  31: [{blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'RIGHT'}],
  32: [{blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}],
  33: [{blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}],
  34: [{blockId:'m1',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}],
  35: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}],
  36: [{blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}],
  37: [{blockId:'m1',dir:'DOWN'}],
  38: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}],
  39: [{blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}],
  40: [{blockId:'m3',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}],
  41: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}],
  42: [{blockId:'m3',dir:'LEFT'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}],
  43: [{blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m1',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}],
  44: [{blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}],
  45: [{blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}],
  46: [{blockId:'m3',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}],
  47: [{blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}],
  48: [{blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}],
  49: [{blockId:'m1',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}],
  50: [{blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}],
};

export function getSolution(id: number): SolutionMove[] {
  return SOLUTIONS[id] ?? [];
}

export function getLevel(id: number): LevelData {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, id - 1))];
}

export const MAX_LEVEL_COLS = LEVELS.reduce((m, l) => Math.max(m, l.cols), 0);
export const MAX_LEVEL_ROWS = LEVELS.reduce((m, l) => Math.max(m, l.rows), 0);
