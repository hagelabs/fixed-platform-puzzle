import { LEVELS } from '../config/Levels';

export function pickDailyLevel(dateISO: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < dateISO.length; i++) {
    h ^= dateISO.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h % LEVELS.length) + 1;
}
