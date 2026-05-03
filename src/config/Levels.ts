import { LevelData } from '../types/Game';
import baked from './levels-baked.json';

export const LEVELS: LevelData[] = baked as LevelData[];

export function getLevel(id: number): LevelData {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, id - 1))];
}
