import { LevelData, BlockData, Color, ExitZone, Direction } from '../types/Game';

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
const K = (id: string, c: number, r: number, color: Color): BlockData => ({
  id, color, position: [c, r], size: [1, 1], type: 'lock',
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
  L(1, 6, 6, [S('m1',4,3)], [E('RIGHT',3)], 1, 'tutorial'),
  L(2, 6, 6, [S('m1',2,2)], [E('BOTTOM',2)], 1, 'tutorial'),
  L(3, 6, 6, [C('m1',4,1,'LEFT')], [E('LEFT',1)], 1, 'tutorial'),
  L(4, 6, 6, [C('m1',4,5,'UP')], [E('TOP',4)], 1, 'tutorial'),
  L(5, 6, 6, [C('m1',4,3,'RIGHT')], [E('RIGHT',3)], 1, 'tutorial'),
  L(6, 6, 6, [O('o1',5,2), C('m1',2,0,'DOWN'), S('m2',2,3)], [E('BOTTOM',2)], 2, 'tutorial'),
  L(7, 6, 6, [O('o1',0,1), C('m1',5,2,'LEFT')], [E('LEFT',2)], 1, 'tutorial'),
  L(8, 6, 6, [O('o1',4,0), C('m1',1,1,'UP'), S('m2',1,3)], [E('TOP',1)], 2, 'tutorial'),
  L(9, 6, 6, [O('o1',4,0), C('m1',0,3,'RIGHT')], [E('RIGHT',3)], 1, 'tutorial'),
  L(10, 6, 6, [O('o1',0,5), C('m1',3,5,'DOWN'), S('m2',3,4)], [E('BOTTOM',3)], 2, 'tutorial'),
  L(11, 7, 7, [O('o1',0,5), S('m1',5,1), S('m2',4,1)], [E('LEFT',1)], 2, 'tutorial'),
  L(12, 7, 7, [O('o1',6,4), C('m1',4,0,'UP'), S('m2',4,5)], [E('TOP',4)], 2, 'tutorial'),
  L(13, 7, 7, [O('o1',2,3), S('m1',2,4), S('m2',5,4)], [E('RIGHT',4)], 2, 'tutorial'),
  L(14, 7, 7, [O('o1',0,2), C('m1',2,5,'DOWN'), S('m2',2,4)], [E('BOTTOM',2)], 2, 'tutorial'),
  L(15, 7, 7, [O('o1',4,2), S('m1',0,1), S('m2',6,1)], [E('LEFT',1)], 2, 'tutorial'),
  L(16, 7, 7, [O('o1',3,0), O('o2',1,5), C('m1',4,1,'UP'), S('m2',2,6), S('m3',4,3)], [E('TOP',4)], 6, 'tutorial'),
  L(17, 7, 7, [O('o1',6,2), C('m1',4,1,'RIGHT'), S('m2',5,0)], [E('RIGHT',1)], 4, 'tutorial'),
  L(18, 7, 7, [O('o1',4,6), O('o2',2,5), C('m1',3,0,'DOWN'), S('m2',0,1), S('m3',3,5)], [E('BOTTOM',3)], 5, 'tutorial'),
  L(19, 7, 7, [O('o1',6,4), C('m1',3,3,'LEFT'), S('m2',4,0)], [E('LEFT',3)], 4, 'tutorial'),
  L(20, 7, 7, [O('o1',6,4), O('o2',6,0), C('m1',5,1,'UP'), S('m2',5,0), S('m3',5,3)], [E('TOP',5)], 3, 'tutorial'),
  L(21, 7, 7, [O('o1',0,2), O('o2',2,1), C('m1',4,2,'RIGHT'), S('m2',1,2), S('m3',2,6)], [E('RIGHT',2)], 4, 'tutorial'),
  L(22, 7, 7, [O('o1',1,3), O('o2',2,2), C('m1',3,2,'DOWN'), S('m2',3,6), S('m3',5,2)], [E('BOTTOM',3)], 4, 'tutorial'),
  L(23, 7, 7, [O('o1',4,6), O('o2',6,3), C('m1',1,2,'LEFT'), S('m2',0,2), S('m3',6,5)], [E('LEFT',2)], 7, 'tutorial'),
  L(24, 7, 7, [O('o1',6,4), O('o2',1,5), C('m1',2,3,'UP'), S('m2',0,5), S('m3',2,5)], [E('TOP',2)], 7, 'tutorial'),
  L(25, 7, 7, [O('o1',6,4), O('o2',5,0), C('m1',2,5,'RIGHT'), S('m2',3,5), S('m3',2,4)], [E('RIGHT',5)], 6, 'tutorial'),
  L(26, 8, 8, [O('o1',2,5), O('o2',7,0), C('m1',6,1,'DOWN'), S('m2',6,2), S('m3',7,4)], [E('BOTTOM',6)], 6, 'tutorial'),
  L(27, 8, 8, [O('o1',4,5), O('o2',7,0), S('m1',7,1), S('m2',0,1), S('m3',2,6)], [E('LEFT',1)], 5, 'tutorial'),
  L(28, 8, 8, [O('o1',0,6), O('o2',7,0), C('m1',6,4,'UP'), S('m2',6,0), S('m3',2,4)], [E('TOP',6)], 5, 'tutorial'),
  L(29, 8, 8, [O('o1',0,2), O('o2',6,5), S('m1',1,3), S('m2',3,3), S('m3',7,7)], [E('RIGHT',3)], 5, 'tutorial'),
  L(30, 8, 8, [O('o1',3,5), O('o2',1,6), C('m1',2,3,'DOWN'), S('m2',2,0), S('m3',5,6)], [E('BOTTOM',2)], 4, 'tutorial'),
  L(31, 7, 7, [O('o1',6,3), S('m1',4,2), D('m2',5,2,'m1')], [E('RIGHT',2)], 5, 'gears'),
  L(32, 7, 7, [O('o1',1,0), S('m1',4,0), D('m2',1,6,'m1')], [E('BOTTOM',2)], 6, 'gears'),
  L(33, 7, 7, [O('o1',0,3), S('m1',6,4), D('m2',3,4,'m1')], [E('LEFT',4)], 5, 'gears'),
  L(34, 7, 7, [O('o1',4,0), S('m1',5,5), D('m2',5,4,'m1')], [E('TOP',5)], 5, 'gears'),
  L(35, 7, 7, [O('o1',6,4), S('m1',1,5), D('m2',3,5,'m1')], [E('RIGHT',5)], 5, 'gears'),
  L(36, 8, 8, [O('o1',7,1), O('o2',1,7), C('m1',2,0,'DOWN'), S('m2',2,7), D('m3',7,3,'m1')], [E('BOTTOM',2)], 5, 'gears'),
  L(37, 8, 8, [O('o1',7,2), O('o2',7,6), S('m1',4,5), S('m2',4,1), D('m3',7,5,'m1')], [E('LEFT',5)], 6, 'gears'),
  L(38, 8, 8, [O('o1',2,3), O('o2',6,0), C('m1',5,1,'UP'), S('m2',5,4), D('m3',1,1,'m1')], [E('TOP',5)], 5, 'gears'),
  L(39, 8, 8, [O('o1',0,2), O('o2',4,2), S('m1',2,3), S('m2',7,4), D('m3',4,3,'m1')], [E('RIGHT',3)], 9, 'gears'),
  L(40, 8, 8, [O('o1',2,5), O('o2',7,6), C('m1',3,4,'DOWN'), S('m2',0,0), D('m3',0,3,'m1')], [E('BOTTOM',3)], 9, 'gears'),
  L(41, 8, 8, [O('o1',0,6), O('o2',0,3), S('m1',7,2), D('m2',1,2,'m1'), D('m3',3,2,'m2')], [E('LEFT',2)], 6, 'gears'),
  L(42, 8, 8, [O('o1',3,0), O('o2',5,0), S('m1',2,2), D('m2',7,0,'m1'), D('m3',2,4,'m2')], [E('TOP',2)], 7, 'gears'),
  L(43, 8, 8, [O('o1',0,0), O('o2',7,4), S('m1',0,1), D('m2',6,2,'m1'), D('m3',1,6,'m2')], [E('RIGHT',1)], 7, 'gears'),
  L(44, 8, 8, [O('o1',1,7), O('o2',6,5), S('m1',2,1), D('m2',2,2,'m1'), D('m3',2,0,'m2')], [E('BOTTOM',2)], 6, 'gears'),
  L(45, 8, 8, [O('o1',4,2), O('o2',0,4), S('m1',1,3), D('m2',6,5,'m1'), D('m3',4,3,'m2')], [E('LEFT',3)], 6, 'gears'),
  L(46, 8, 8, [O('o1',0,6), O('o2',7,7), C('m1',1,0,'UP'), S('m2',1,3), D('m3',1,7,'m1'), D('m4',1,5,'m3')], [E('TOP',1)], 12, 'gears'),
  L(47, 8, 8, [O('o1',1,0), O('o2',7,3), S('m1',2,4), S('m2',7,4), S('m3',3,4), D('m4',7,0,'m1')], [E('RIGHT',4)], 8, 'gears'),
  L(48, 8, 8, [O('o1',3,7), O('o2',6,1), C('m1',4,3,'DOWN'), S('m2',4,4), D('m3',2,6,'m1'), D('m4',4,1,'m3')], [E('BOTTOM',4)], 7, 'gears'),
  L(49, 8, 8, [O('o1',3,0), O('o2',4,0), S('m1',7,1), S('m2',5,1), S('m3',4,1), D('m4',7,6,'m1')], [E('LEFT',1)], 10, 'gears'),
  L(50, 8, 8, [O('o1',3,0), O('o2',7,7), C('m1',2,6,'UP'), S('m2',2,7), D('m3',7,3,'m1'), D('m4',6,3,'m3')], [E('TOP',2)], 11, 'gears'),
  L(51, 9, 9, [O('o1',0,1), O('o2',7,8), O('o3',0,7), C('m1',7,2,'RIGHT'), S('m2',5,1), D('m3',5,2,'m1'), D('m4',0,2,'m3')], [E('RIGHT',2)], 10, 'gears'),
  L(52, 9, 9, [O('o1',6,8), O('o2',7,0), O('o3',2,0), C('m1',1,7,'DOWN'), S('m2',8,3), D('m3',3,4,'m1'), D('m4',1,2,'m1')], [E('BOTTOM',1)], 11, 'gears'),
  L(53, 9, 9, [O('o1',8,3), O('o2',3,4), O('o3',4,3), C('m1',2,2,'LEFT'), S('m2',3,1), D('m3',6,2,'m1'), D('m4',5,2,'m3')], [E('LEFT',2)], 10, 'gears'),
  L(54, 9, 9, [O('o1',2,3), O('o2',4,2), O('o3',4,8), C('m1',3,6,'UP'), S('m2',3,2), D('m3',3,8,'m1'), D('m4',7,8,'m1')], [E('TOP',3)], 8, 'gears'),
  L(55, 9, 9, [O('o1',8,2), O('o2',2,8), O('o3',7,8), C('m1',7,1,'RIGHT'), S('m2',2,1), D('m3',7,2,'m1'), D('m4',1,8,'m3')], [E('RIGHT',1)], 10, 'gears'),
  L(56, 9, 9, [O('o1',5,5), O('o2',1,2), O('o3',7,4), C('m1',6,4,'DOWN'), S('m2',3,5), D('m3',0,8,'m1'), D('m4',6,0,'m1')], [E('BOTTOM',6)], 11, 'gears'),
  L(57, 9, 9, [O('o1',1,2), O('o2',8,4), O('o3',8,2), C('m1',1,5,'LEFT'), S('m2',3,3), D('m3',3,7,'m1'), D('m4',2,5,'m1')], [E('LEFT',5)], 9, 'gears'),
  L(58, 9, 9, [O('o1',5,1), O('o2',5,3), O('o3',5,2), C('m1',4,2,'UP'), S('m2',1,8), D('m3',4,6,'m1'), D('m4',4,7,'m1')], [E('TOP',4)], 14, 'gears'),
  L(59, 9, 9, [O('o1',0,8), O('o2',5,7), O('o3',0,3), C('m1',3,4,'RIGHT'), S('m2',8,4), D('m3',1,0,'m1'), D('m4',7,5,'m1')], [E('RIGHT',4)], 9, 'gears'),
  L(60, 9, 9, [O('o1',4,7), O('o2',2,6), O('o3',6,3), C('m1',3,4,'DOWN'), S('m2',2,8), D('m3',2,1,'m1'), D('m4',8,4,'m1')], [E('BOTTOM',3)], 11, 'gears'),
  L(61, 9, 9, [O('o1',3,6), O('o2',0,0), O('o3',6,3), C('m1',3,1,'RIGHT'), S('m2',5,0), S('m3',7,1)], [E('RIGHT',1)], 6, 'stones'),
  L(62, 9, 9, [O('o1',0,5), O('o2',7,6), O('o3',0,3), C('m1',6,3,'DOWN'), S('m2',7,0), S('m3',1,7)], [E('BOTTOM',6)], 10, 'stones'),
  L(63, 9, 9, [O('o1',8,3), O('o2',1,1), O('o3',7,7), C('m1',0,2,'LEFT'), S('m2',7,1), S('m3',2,2)], [E('LEFT',2)], 5, 'stones'),
  L(64, 9, 9, [O('o1',8,8), O('o2',0,7), O('o3',6,6), C('m1',5,8,'UP'), S('m2',4,8), S('m3',5,6)], [E('TOP',5)], 7, 'stones'),
  L(65, 9, 9, [O('o1',0,5), O('o2',6,4), O('o3',4,3), C('m1',7,6,'RIGHT'), S('m2',1,8), S('m3',1,6)], [E('RIGHT',6)], 5, 'stones'),
  L(66, 9, 9, [O('o1',8,1), O('o2',5,0), O('o3',8,2), O('o4',3,8), C('m1',4,7,'DOWN'), S('m2',3,4), S('m3',4,4), D('m4',4,6,'m1')], [E('BOTTOM',4)], 7, 'stones'),
  L(67, 9, 9, [O('o1',3,1), O('o2',0,3), O('o3',1,0), S('m1',1,4), S('m2',2,4), S('m3',7,0), D('m4',0,5,'m1')], [E('LEFT',4)], 8, 'stones'),
  L(68, 9, 9, [O('o1',1,7), O('o2',5,6), O('o3',0,5), O('o4',6,0), C('m1',1,4,'UP'), S('m2',1,1), S('m3',4,7), D('m4',1,8,'m1')], [E('TOP',1)], 13, 'stones'),
  L(69, 9, 9, [O('o1',4,6), O('o2',0,0), O('o3',3,3), S('m1',5,1), S('m2',4,1), S('m3',2,1), D('m4',7,1,'m1')], [E('RIGHT',1)], 12, 'stones'),
  L(70, 9, 9, [O('o1',5,6), O('o2',5,5), O('o3',1,2), O('o4',5,0), C('m1',4,8,'DOWN'), S('m2',7,6), S('m3',4,7), D('m4',4,0,'m1')], [E('BOTTOM',4)], 8, 'stones'),
  L(71, 10, 10, [O('o1',9,6), O('o2',0,9), O('o3',5,0), O('o4',4,0), C('m1',0,5,'LEFT'), S('m2',1,5), S('m3',4,1), D('m4',8,0,'m1')], [E('LEFT',5)], 8, 'stones'),
  L(72, 10, 10, [O('o1',4,5), O('o2',7,8), O('o3',1,9), O('o4',4,4), C('m1',3,8,'UP'), S('m2',4,3), S('m3',5,6), D('m4',7,5,'m1')], [E('TOP',3)], 14, 'stones'),
  L(73, 10, 10, [O('o1',9,3), O('o2',7,3), O('o3',6,1), O('o4',4,4), C('m1',7,4,'RIGHT'), S('m2',1,8), S('m3',6,4), D('m4',9,1,'m1')], [E('RIGHT',4)], 11, 'stones'),
  L(74, 10, 10, [O('o1',2,6), O('o2',0,4), O('o3',5,0), O('o4',9,7), C('m1',3,4,'DOWN'), S('m2',3,2), S('m3',3,3), D('m4',1,9,'m1')], [E('BOTTOM',3)], 9, 'stones'),
  L(75, 10, 10, [O('o1',0,9), O('o2',2,4), O('o3',9,8), O('o4',1,4), C('m1',1,7,'LEFT'), S('m2',5,7), S('m3',5,6), D('m4',3,4,'m1')], [E('LEFT',7)], 8, 'stones'),
  L(76, 10, 10, [O('o1',2,0), O('o2',7,0), O('o3',1,9), O('o4',7,2), C('m1',3,4,'UP'), S('m2',3,9), S('m3',3,5), D('m4',4,0,'m1'), D('m5',2,8,'m4')], [E('TOP',3)], 11, 'stones'),
  L(77, 10, 10, [O('o1',9,7), O('o2',3,3), O('o3',0,5), O('o4',1,3), C('m1',0,8,'RIGHT'), S('m2',6,8), S('m3',8,8), D('m4',1,7,'m1'), D('m5',5,3,'m4')], [E('RIGHT',8)], 11, 'stones'),
  L(78, 10, 10, [O('o1',5,8), O('o2',2,3), O('o3',8,9), O('o4',7,3), C('m1',7,9,'DOWN'), S('m2',9,6), S('m3',7,6), D('m4',7,5,'m1'), D('m5',7,1,'m4')], [E('BOTTOM',7)], 11, 'stones'),
  L(79, 10, 10, [O('o1',2,1), O('o2',1,7), O('o3',8,5), O('o4',0,5), C('m1',5,4,'LEFT'), S('m2',2,7), S('m3',1,6), D('m4',9,6,'m1'), D('m5',7,4,'m4')], [E('LEFT',4)], 14, 'stones'),
  L(80, 10, 10, [O('o1',2,5), O('o2',8,9), O('o3',3,0), O('o4',9,7), C('m1',7,0,'UP'), S('m2',7,2), S('m3',7,1), D('m4',7,9,'m1'), D('m5',7,8,'m4')], [E('TOP',7)], 16, 'stones'),
  L(81, 10, 10, [O('o1',4,6), O('o2',9,0), O('o3',5,5), O('o4',6,7), O('o5',1,6), C('m1',2,1,'RIGHT'), S('m2',5,1), S('m3',5,2), D('m4',2,7,'m1'), D('m5',9,8,'m1')], [E('RIGHT',1)], 11, 'stones'),
  L(82, 10, 10, [O('o1',7,5), O('o2',0,2), O('o3',1,9), O('o4',9,3), O('o5',7,6), C('m1',3,2,'DOWN'), S('m2',6,1), S('m3',6,0), D('m4',4,2,'m1'), D('m5',6,6,'m1')], [E('BOTTOM',3), E('BOTTOM',6)], 13, 'stones'),
  L(83, 10, 10, [O('o1',4,2), O('o2',2,6), O('o3',4,0), O('o4',0,6), O('o5',9,9), C('m1',1,5,'LEFT'), S('m2',7,7), S('m3',0,5), D('m4',6,5,'m1'), D('m5',8,7,'m1')], [E('LEFT',5)], 13, 'stones'),
  L(84, 10, 10, [O('o1',7,7), O('o2',9,4), O('o3',0,7), O('o4',0,8), O('o5',3,8), C('m1',7,4,'UP'), S('m2',7,0), S('m3',5,9), D('m4',7,9,'m1'), D('m5',7,8,'m1')], [E('TOP',7), E('LEFT',6)], 13, 'stones'),
  L(85, 10, 10, [O('o1',6,6), O('o2',9,9), O('o3',7,0), O('o4',8,7), O('o5',7,9), C('m1',5,5,'RIGHT'), S('m2',2,4), S('m3',2,5), D('m4',0,5,'m1'), D('m5',0,7,'m1')], [E('RIGHT',5)], 11, 'stones'),
  L(86, 10, 10, [O('o1',5,9), O('o2',2,6), O('o3',7,9), O('o4',1,0), O('o5',6,1), C('m1',8,0,'DOWN'), S('m2',8,8), S('m3',8,6), D('m4',6,9,'m1'), D('m5',2,0,'m1')], [E('BOTTOM',8)], 12, 'stones'),
  L(87, 10, 10, [O('o1',0,8), O('o2',9,5), O('o3',4,8), O('o4',1,4), O('o5',7,0), C('m1',9,7,'LEFT'), S('m2',8,7), S('m3',5,7), D('m4',8,8,'m1'), D('m5',3,8,'m1')], [E('LEFT',7)], 12, 'stones'),
  L(88, 10, 10, [O('o1',9,7), O('o2',2,4), O('o3',9,5), O('o4',9,0), O('o5',2,1), C('m1',3,5,'UP'), S('m2',3,6), S('m3',3,3), D('m4',3,7,'m1'), D('m5',7,8,'m1')], [E('TOP',3)], 15, 'stones'),
  L(89, 10, 10, [O('o1',2,4), O('o2',6,3), O('o3',9,0), O('o4',3,8), O('o5',7,3), C('m1',6,4,'RIGHT'), S('m2',9,4), S('m3',3,4), D('m4',9,2,'m1'), D('m5',4,2,'m1')], [E('RIGHT',4)], 14, 'stones'),
  L(90, 10, 10, [O('o1',4,1), O('o2',3,0), O('o3',7,7), O('o4',8,2), O('o5',6,9), C('m1',5,0,'DOWN'), S('m2',5,7), S('m3',5,6), D('m4',1,4,'m1'), D('m5',9,2,'m1')], [E('BOTTOM',5)], 13, 'stones'),
  L(91, 10, 10, [O('o1',2,3), O('o2',0,1), O('o3',2,9), C('m1',9,2,'RIGHT'), S('m2',7,2), D('m3',6,2,'m1'), D('m4',5,2,'m1'), D('m5',3,0,'m1')], [E('RIGHT',2)], 13, 'master'),
  L(92, 10, 10, [O('o1',9,4), O('o2',2,3), O('o3',9,9), C('m1',8,2,'DOWN'), S('m2',8,5), D('m3',2,1,'m1'), D('m4',0,4,'m1'), D('m5',4,1,'m1')], [E('BOTTOM',8)], 12, 'master'),
  L(93, 10, 10, [O('o1',1,8), O('o2',3,2), O('o3',2,6), C('m1',3,7,'LEFT'), S('m2',6,7), D('m3',6,3,'m1'), D('m4',7,7,'m1'), D('m5',9,7,'m1')], [E('LEFT',7)], 12, 'master'),
  L(94, 10, 10, [O('o1',1,6), O('o2',6,1), O('o3',3,9), C('m1',4,0,'UP'), S('m2',4,5), D('m3',4,4,'m1'), D('m4',0,6,'m1'), D('m5',1,4,'m1')], [E('TOP',4)], 12, 'master'),
  L(95, 10, 10, [O('o1',1,5), O('o2',2,6), O('o3',1,8), C('m1',8,7,'RIGHT'), S('m2',0,7), D('m3',6,0,'m1'), D('m4',4,1,'m1'), D('m5',2,7,'m1')], [E('RIGHT',7)], 12, 'master'),
  L(96, 10, 10, [O('o1',9,9), O('o2',6,2), O('o3',1,0), O('o4',4,2), C('m1',2,9,'DOWN'), S('m2',2,4), D('m3',9,2,'m1'), D('m4',2,3,'m1'), D('m5',2,8,'m3')], [E('BOTTOM',2)], 14, 'master'),
  L(97, 10, 10, [O('o1',0,3), O('o2',0,5), O('o3',4,4), O('o4',7,2), C('m1',6,2,'LEFT'), S('m2',5,2), D('m3',2,5,'m1'), D('m4',9,6,'m1'), D('m5',9,2,'m3')], [E('LEFT',2)], 14, 'master'),
  L(98, 10, 10, [O('o1',3,0), O('o2',0,3), O('o3',0,2), O('o4',5,3), C('m1',1,1,'UP'), S('m2',1,5), D('m3',8,1,'m1'), D('m4',1,9,'m1'), D('m5',5,5,'m3')], [E('TOP',1)], 18, 'master'),
  L(99, 10, 10, [O('o1',0,8), O('o2',0,5), O('o3',7,4), O('o4',7,7), C('m1',9,6,'RIGHT'), S('m2',8,6), D('m3',7,6,'m1'), D('m4',6,6,'m1'), D('m5',1,5,'m3')], [E('RIGHT',6)], 16, 'master'),
  L(100, 10, 10, [O('o1',5,9), O('o2',7,8), O('o3',1,6), O('o4',2,3), C('m1',6,3,'DOWN'), S('m2',6,8), D('m3',7,4,'m1'), D('m4',3,7,'m1'), D('m5',8,9,'m3')], [E('BOTTOM',6)], 14, 'master'),
  L(101, 10, 10, [O('o1',1,5), O('o2',2,3), O('o3',0,7), O('o4',7,4), C('m1',6,6,'LEFT'), S('m2',6,3), S('m3',7,3), D('m4',1,4,'m1'), D('m5',0,3,'m1')], [E('LEFT',3), E('LEFT',6)], 13, 'master'),
  L(102, 10, 10, [O('o1',3,7), O('o2',5,9), O('o3',9,6), O('o4',1,3), C('m1',6,8,'UP'), S('m2',8,5), S('m3',0,1), D('m4',7,9,'m1'), D('m5',2,5,'m1')], [E('TOP',2), E('TOP',6)], 13, 'master'),
  L(103, 10, 10, [O('o1',8,1), O('o2',8,2), O('o3',7,2), O('o4',5,3), C('m1',9,6,'RIGHT'), S('m2',9,5), S('m3',3,3), D('m4',8,3,'m1'), D('m5',6,6,'m1')], [E('RIGHT',3), E('RIGHT',6)], 13, 'master'),
  L(104, 10, 10, [O('o1',7,2), O('o2',0,3), O('o3',8,6), O('o4',7,5), C('m1',6,6,'DOWN'), S('m2',3,2), S('m3',7,6), D('m4',9,5,'m1'), D('m5',3,3,'m1')], [E('BOTTOM',3), E('BOTTOM',6)], 14, 'master'),
  L(105, 10, 10, [O('o1',1,1), O('o2',1,8), O('o3',2,3), O('o4',2,6), C('m1',7,2,'LEFT'), S('m2',4,2), S('m3',8,4), D('m4',8,2,'m1'), D('m5',9,8,'m1')], [E('LEFT',2), E('TOP',1)], 13, 'master'),
  L(106, 10, 10, [O('o1',9,4), O('o2',5,0), O('o3',0,1), O('o4',2,4), C('m1',6,7,'UP'), S('m2',6,6), D('m3',5,5,'m1'), D('m4',2,5,'m3'), D('m5',3,2,'m4')], [E('TOP',6)], 19, 'master'),
  L(107, 10, 10, [O('o1',6,4), O('o2',0,1), O('o3',5,9), O('o4',0,2), C('m1',8,3,'RIGHT'), S('m2',5,3), D('m3',0,3,'m1'), D('m4',9,6,'m3'), D('m5',2,3,'m4')], [E('RIGHT',3)], 17, 'master'),
  L(108, 10, 10, [O('o1',4,0), O('o2',1,6), O('o3',1,9), O('o4',7,0), C('m1',6,6,'DOWN'), S('m2',6,1), D('m3',0,1,'m1'), D('m4',6,0,'m3'), D('m5',8,2,'m4')], [E('BOTTOM',6)], 22, 'master'),
  L(109, 10, 10, [O('o1',2,4), O('o2',5,6), O('o3',1,1), O('o4',6,2), C('m1',0,5,'LEFT'), S('m2',7,5), D('m3',6,5,'m1'), D('m4',9,5,'m3'), D('m5',8,5,'m4')], [E('LEFT',5)], 15, 'master'),
  L(110, 10, 10, [O('o1',6,2), O('o2',6,3), O('o3',8,9), O('o4',9,3), C('m1',5,3,'UP'), S('m2',5,0), D('m3',5,9,'m1'), D('m4',5,8,'m3'), D('m5',0,5,'m4')], [E('TOP',5)], 17, 'master'),
  L(111, 10, 10, [O('o1',5,5), O('o2',4,1), O('o3',3,9), O('o4',0,7), O('o5',2,9), C('m1',6,2,'RIGHT'), S('m2',1,3), D('m3',4,5,'m1'), D('m4',7,3,'m1'), D('m5',2,0,'m3')], [E('RIGHT',2)], 16, 'master'),
  L(112, 10, 10, [O('o1',6,6), O('o2',4,5), O('o3',7,1), O('o4',9,0), O('o5',0,4), C('m1',1,9,'DOWN'), C('m2',1,8,'DOWN'), D('m3',2,0,'m1'), D('m4',1,5,'m1'), D('m5',1,2,'m3')], [E('BOTTOM',1), E('RIGHT',5)], 15, 'master'),
  L(113, 10, 10, [O('o1',9,5), O('o2',8,9), O('o3',2,1), O('o4',5,1), O('o5',5,0), C('m1',5,4,'LEFT'), S('m2',7,5), D('m3',9,4,'m1'), D('m4',8,6,'m1'), D('m5',6,4,'m3')], [E('LEFT',4)], 16, 'master'),
  L(114, 10, 10, [O('o1',7,0), O('o2',8,9), O('o3',0,9), O('o4',6,9), O('o5',8,0), C('m1',2,3,'UP'), C('m2',2,7,'UP'), D('m3',1,0,'m1'), D('m4',7,5,'m1'), D('m5',6,6,'m3')], [E('TOP',2), E('TOP',5)], 17, 'master'),
  L(115, 10, 10, [O('o1',9,4), O('o2',0,8), O('o3',8,9), O('o4',4,1), O('o5',3,3), C('m1',9,3,'RIGHT'), S('m2',0,3), D('m3',1,6,'m1'), D('m4',1,5,'m1'), D('m5',1,3,'m3')], [E('RIGHT',3)], 18, 'master'),
  L(116, 10, 10, [O('o1',6,1), O('o2',7,5), O('o3',9,2), O('o4',0,7), O('o5',1,6), C('m1',6,6,'DOWN'), S('m2',6,0), D('m3',9,5,'m1'), D('m4',4,8,'m1'), D('m5',0,8,'m3')], [E('BOTTOM',6), E('RIGHT',1)], 18, 'master'),
  L(117, 10, 10, [O('o1',8,8), O('o2',7,6), O('o3',7,7), O('o4',2,7), O('o5',1,5), C('m1',0,6,'LEFT'), S('m2',3,3), D('m3',1,6,'m1'), D('m4',3,7,'m1'), D('m5',8,6,'m3')], [E('LEFT',3), E('LEFT',6)], 16, 'master'),
  L(118, 10, 10, [O('o1',5,1), O('o2',7,2), O('o3',1,2), O('o4',1,8), O('o5',5,5), C('m1',6,1,'UP'), S('m2',6,8), D('m3',3,0,'m1'), D('m4',0,7,'m1'), D('m5',6,6,'m3')], [E('TOP',3), E('TOP',6)], 17, 'master'),
  L(119, 10, 10, [O('o1',3,2), O('o2',8,0), O('o3',7,0), O('o4',8,5), O('o5',7,5), C('m1',2,6,'RIGHT'), S('m2',6,6), D('m3',2,2,'m1'), D('m4',7,2,'m1'), D('m5',0,2,'m3')], [E('RIGHT',2), E('RIGHT',6)], 18, 'master'),
  L(120, 10, 10, [O('o1',9,8), O('o2',6,4), O('o3',7,6), O('o4',4,9), O('o5',2,7), C('m1',5,7,'DOWN'), S('m2',2,4), D('m3',2,0,'m1'), D('m4',2,5,'m1'), D('m5',2,1,'m3')], [E('BOTTOM',2), E('BOTTOM',5)], 16, 'master'),

  // === FIXTURE LEVELS (hand-authored: ice + lock mechanics) ===
  L(121, 7, 7, [SC('m1',1,3,'red')], [E('RIGHT',3)], 1, 'master', [[3,3],[4,3]]),
  L(122, 7, 7, [SC('m1',0,2,'red'), SC('m2',0,4,'blue')], [E('RIGHT',2), E('RIGHT',4)], 2, 'master', [[3,2],[3,4]]),
  L(123, 8, 8, [SC('m1',1,4,'green'), O('o1',5,2)], [E('RIGHT',4)], 1, 'master', [[3,4],[4,4],[5,4],[6,4]]),
  L(124, 7, 7, [SC('m1',0,3,'red'), K('k1',5,3,'red')], [E('RIGHT',3)], 2, 'master'),
  L(125, 8, 8, [SC('m1',0,1,'blue'), K('k1',3,5,'blue'), O('o1',5,5)], [E('RIGHT',1), E('RIGHT',5)], 3, 'master'),
  L(126, 9, 9, [SC('m1',0,4,'red'), K('k1',4,4,'red'), K('k2',7,4,'red')], [E('RIGHT',4)], 4, 'master'),
];

export type SolutionMove = { blockId: string; dir: Direction };

export const SOLUTIONS: Record<number, SolutionMove[]> = {
  1: [{blockId:'m1',dir:'RIGHT'}],
  2: [{blockId:'m1',dir:'DOWN'}],
  3: [{blockId:'m1',dir:'LEFT'}],
  4: [{blockId:'m1',dir:'UP'}],
  5: [{blockId:'m1',dir:'RIGHT'}],
  6: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'DOWN'}],
  7: [{blockId:'m1',dir:'LEFT'}],
  8: [{blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'UP'}],
  9: [{blockId:'m1',dir:'RIGHT'}],
  10: [{blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}],
  11: [{blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'LEFT'}],
  12: [{blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'UP'}],
  13: [{blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}],
  14: [{blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}],
  15: [{blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}],
  16: [{blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}],
  17: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}],
  18: [{blockId:'m3',dir:'DOWN'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}],
  19: [{blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}],
  20: [{blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'UP'}],
  21: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}],
  22: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}],
  23: [{blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}],
  24: [{blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}],
  25: [{blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}],
  26: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}],
  27: [{blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}],
  28: [{blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}],
  29: [{blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}],
  30: [{blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}],
  31: [{blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}],
  32: [{blockId:'m1',dir:'LEFT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}],
  33: [{blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}],
  34: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'UP'}],
  35: [{blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}],
  36: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}],
  37: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}],
  38: [{blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}],
  39: [{blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}],
  40: [{blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}],
  41: [{blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}],
  42: [{blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'UP'}],
  43: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}],
  44: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}],
  45: [{blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}],
  46: [{blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}],
  47: [{blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}],
  48: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}],
  49: [{blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}],
  50: [{blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}],
  51: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}],
  52: [{blockId:'m1',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}],
  53: [{blockId:'m1',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}],
  54: [{blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}],
  55: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}],
  56: [{blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}],
  57: [{blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}],
  58: [{blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}],
  59: [{blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}],
  60: [{blockId:'m1',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}],
  61: [{blockId:'m3',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}],
  62: [{blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}],
  63: [{blockId:'m1',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}],
  64: [{blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}],
  65: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}],
  66: [{blockId:'m1',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}],
  67: [{blockId:'m1',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}],
  68: [{blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}],
  69: [{blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m1',dir:'UP'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}],
  70: [{blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}],
  71: [{blockId:'m1',dir:'LEFT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}],
  72: [{blockId:'m1',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}],
  73: [{blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}],
  74: [{blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}],
  75: [{blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}],
  76: [{blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'UP'}],
  77: [{blockId:'m3',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}],
  78: [{blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}],
  79: [{blockId:'m1',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}],
  80: [{blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}],
  81: [{blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}],
  82: [{blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}],
  83: [{blockId:'m3',dir:'LEFT'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}],
  84: [{blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}],
  85: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}],
  86: [{blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}],
  87: [{blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}],
  88: [{blockId:'m3',dir:'LEFT'}, {blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m3',dir:'UP'}],
  89: [{blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}],
  90: [{blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}],
  91: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}],
  92: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}],
  93: [{blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}],
  94: [{blockId:'m1',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'UP'}],
  95: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}],
  96: [{blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}],
  97: [{blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}],
  98: [{blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m4',dir:'UP'}],
  99: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}],
  100: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}],
  101: [{blockId:'m1',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}],
  102: [{blockId:'m1',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'UP'}],
  103: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}],
  104: [{blockId:'m1',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}],
  105: [{blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}],
  106: [{blockId:'m2',dir:'UP'}, {blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'UP'}],
  107: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}],
  108: [{blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}],
  109: [{blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}],
  110: [{blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}],
  111: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}],
  112: [{blockId:'m1',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}],
  113: [{blockId:'m1',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}],
  114: [{blockId:'m1',dir:'UP'}, {blockId:'m2',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m4',dir:'UP'}],
  115: [{blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m4',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}],
  116: [{blockId:'m1',dir:'DOWN'}, {blockId:'m4',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}],
  117: [{blockId:'m1',dir:'LEFT'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}],
  118: [{blockId:'m1',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m4',dir:'UP'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m2',dir:'UP'}, {blockId:'m5',dir:'UP'}, {blockId:'m4',dir:'DOWN'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m4',dir:'UP'}],
  119: [{blockId:'m2',dir:'DOWN'}, {blockId:'m1',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'UP'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m2',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m2',dir:'RIGHT'}],
  120: [{blockId:'m1',dir:'DOWN'}, {blockId:'m2',dir:'RIGHT'}, {blockId:'m2',dir:'DOWN'}, {blockId:'m3',dir:'LEFT'}, {blockId:'m4',dir:'LEFT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m3',dir:'RIGHT'}, {blockId:'m3',dir:'DOWN'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'RIGHT'}, {blockId:'m5',dir:'UP'}, {blockId:'m4',dir:'RIGHT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m5',dir:'LEFT'}, {blockId:'m5',dir:'DOWN'}, {blockId:'m4',dir:'DOWN'}],
  121: [{blockId:'m1',dir:'RIGHT'}],
  122: [{blockId:'m1',dir:'RIGHT'},{blockId:'m2',dir:'RIGHT'}],
  123: [{blockId:'m1',dir:'RIGHT'}],
  124: [{blockId:'m1',dir:'RIGHT'},{blockId:'k1',dir:'RIGHT'}],
  125: [{blockId:'m1',dir:'RIGHT'},{blockId:'k1',dir:'RIGHT'},{blockId:'k1',dir:'DOWN'}],
  126: [{blockId:'m1',dir:'RIGHT'},{blockId:'k1',dir:'RIGHT'},{blockId:'k2',dir:'RIGHT'}],
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
