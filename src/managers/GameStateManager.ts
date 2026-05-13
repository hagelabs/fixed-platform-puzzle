import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TOTAL_LEVELS } from '../config/Constants';

declare const __DEV__: boolean;
const DEV = typeof __DEV__ !== 'undefined' && __DEV__;

export const WATCH_COOLDOWN_MS = 3 * 60 * 1000;

export function todayISO(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function isYesterday(last: string, today: string): boolean {
  const d = new Date(today + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  return todayISO(d) === last;
}

export type StarCount = 1 | 2 | 3;

interface GameState {
  currentLevel: number;
  unlockedLevel: number;
  movesThisLevel: number;
  sfxEnabled: boolean;
  audioEnabled: boolean; // alias of sfxEnabled (kept for legacy reads)
  tutorialSeenLevels: number[];

  bestStars: Record<number, StarCount>;

  streak: number;
  lastPlayDate: string;
  dailyHistory: Record<string, { completed: boolean; stars: StarCount }>;
  dailyMode: boolean;
  dailyLevelId: number;

  equippedSkin: string;

  watchCooldownUntil: number;

  setCurrentLevel: (n: number) => void;
  unlockNext: () => void;
  incMoves: () => void;
  resetMoves: () => void;
  toggleAudio: () => void;
  hasSeenTutorial: (level: number) => boolean;
  markTutorialSeen: (level: number) => void;
  recordStars: (levelId: number, stars: StarCount) => StarCount;
  starsFor: (levelId: number) => StarCount | 0;
  totalStars: () => number;

  tickStreakOnWin: () => { streak: number; milestone: boolean };
  recordDailyResult: (date: string, completed: boolean, stars: StarCount) => void;
  isDailyDoneToday: () => boolean;
  startDaily: (levelId: number) => void;
  endDaily: () => void;

  setEquippedSkin: (id: string) => void;
  resetProgress: () => void;
  unlockAll: () => void;

  startWatchCooldown: () => void;
  isWatchOnCooldown: () => boolean;
  getWatchCooldownSecondsLeft: () => number;
}

const store = createStore<GameState>()(
  persist(
    (set, get) => ({
      currentLevel: 1,
      unlockedLevel: 1,
      movesThisLevel: 0,
      sfxEnabled: true,
      audioEnabled: true,
      tutorialSeenLevels: [],

      bestStars: {},

      streak: 0,
      lastPlayDate: '',
      dailyHistory: {},
      dailyMode: false,
      dailyLevelId: 0,

      equippedSkin: 'default',

      watchCooldownUntil: 0,

      setCurrentLevel: (n) => set({ currentLevel: n, movesThisLevel: 0 }),
      unlockNext: () =>
        set((s) => ({
          unlockedLevel: Math.min(TOTAL_LEVELS, Math.max(s.unlockedLevel, s.currentLevel + 1)),
        })),
      incMoves: () => set((s) => ({ movesThisLevel: s.movesThisLevel + 1 })),
      resetMoves: () => set({ movesThisLevel: 0 }),
      toggleAudio: () =>
        set((s) => {
          const next = !s.sfxEnabled;
          return { sfxEnabled: next, audioEnabled: next };
        }),
      hasSeenTutorial: (level) => get().tutorialSeenLevels.includes(level),
      markTutorialSeen: (level) =>
        set((s) =>
          s.tutorialSeenLevels.includes(level)
            ? s
            : { tutorialSeenLevels: [...s.tutorialSeenLevels, level] },
        ),
      recordStars: (levelId, stars) => {
        const prev = get().bestStars[levelId] ?? 0;
        const next: StarCount = (Math.max(prev, stars) as StarCount);
        if (next !== prev) {
          set((s) => ({ bestStars: { ...s.bestStars, [levelId]: next } }));
        }
        return next;
      },
      starsFor: (levelId) => get().bestStars[levelId] ?? 0,
      totalStars: () =>
        Object.values(get().bestStars).reduce((sum, s) => sum + (s as number), 0),
      tickStreakOnWin: () => {
        const today = todayISO();
        const last = get().lastPlayDate;
        if (last === today) return { streak: get().streak, milestone: false };
        let next: number;
        if (last && isYesterday(last, today)) {
          next = get().streak + 1;
        } else {
          next = 1;
        }
        set({ streak: next, lastPlayDate: today });
        const milestone = next === 3 || next === 7 || next === 14 || next === 30 || (next > 30 && next % 30 === 0);
        return { streak: next, milestone };
      },
      recordDailyResult: (date, completed, stars) =>
        set((s) => ({ dailyHistory: { ...s.dailyHistory, [date]: { completed, stars } } })),
      isDailyDoneToday: () => {
        const today = todayISO();
        return get().dailyHistory[today]?.completed === true;
      },
      startDaily: (levelId) =>
        set({ dailyMode: true, dailyLevelId: levelId, currentLevel: levelId, movesThisLevel: 0 }),
      endDaily: () => set({ dailyMode: false, dailyLevelId: 0 }),
      setEquippedSkin: (id) => set({ equippedSkin: id }),
      resetProgress: () =>
        set({
          currentLevel: 1, unlockedLevel: 1, movesThisLevel: 0, tutorialSeenLevels: [],
          bestStars: {}, streak: 0, lastPlayDate: '', dailyHistory: {}, watchCooldownUntil: 0,
        }),
      unlockAll: () => set({ unlockedLevel: TOTAL_LEVELS }),

      startWatchCooldown: () => {
        if (DEV) return; // dev: no cooldown
        set({ watchCooldownUntil: Date.now() + WATCH_COOLDOWN_MS });
      },
      isWatchOnCooldown: () => {
        if (DEV) return false;
        return Date.now() < get().watchCooldownUntil;
      },
      getWatchCooldownSecondsLeft: () => {
        if (DEV) return 0;
        const remain = get().watchCooldownUntil - Date.now();
        return Math.max(0, Math.ceil(remain / 1000));
      },
    }),
    {
      name: 'fpp-game-state-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        currentLevel: s.currentLevel,
        unlockedLevel: s.unlockedLevel,
        sfxEnabled: s.sfxEnabled,
        audioEnabled: s.audioEnabled,
        tutorialSeenLevels: s.tutorialSeenLevels,
        bestStars: s.bestStars,
        streak: s.streak,
        lastPlayDate: s.lastPlayDate,
        dailyHistory: s.dailyHistory,
        equippedSkin: s.equippedSkin,
        watchCooldownUntil: s.watchCooldownUntil,
      }) as Partial<GameState>,
      migrate: (persisted: unknown) => {
        if (persisted && typeof persisted === 'object') {
          const p = persisted as Record<string, unknown>;
          if (p.sfxEnabled === undefined && typeof p.audioEnabled === 'boolean') {
            p.sfxEnabled = p.audioEnabled;
          }
          if (p.audioEnabled === undefined && typeof p.sfxEnabled === 'boolean') {
            p.audioEnabled = p.sfxEnabled;
          }
          if (!Array.isArray(p.tutorialSeenLevels)) {
            p.tutorialSeenLevels = p.tutorialDone === true ? [1, 3, 5] : [];
          }
          if (!p.bestStars || typeof p.bestStars !== 'object') {
            p.bestStars = {};
          }
          if (typeof p.streak !== 'number') p.streak = 0;
          if (typeof p.lastPlayDate !== 'string') p.lastPlayDate = '';
          if (!p.dailyHistory || typeof p.dailyHistory !== 'object') p.dailyHistory = {};
          if (typeof p.equippedSkin !== 'string') p.equippedSkin = 'default';
          delete p.tutorialDone;
        }
        return persisted as GameState;
      },
    }
  )
);

export const useGameStore = {
  getState: () => store.getState(),
  setState: store.setState,
  subscribe: store.subscribe,
};
