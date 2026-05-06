import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TOTAL_LEVELS } from '../config/Constants';

export const WATCH_COOLDOWN_MS = 3 * 60 * 1000;

interface GameState {
  currentLevel: number;
  unlockedLevel: number;
  movesThisLevel: number;
  sfxEnabled: boolean;
  audioEnabled: boolean; // alias of sfxEnabled (kept for legacy reads)
  tutorialDone: boolean;

  watchCooldownUntil: number;

  setCurrentLevel: (n: number) => void;
  unlockNext: () => void;
  incMoves: () => void;
  resetMoves: () => void;
  toggleAudio: () => void;
  setTutorialDone: (v: boolean) => void;
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
      tutorialDone: false,

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
      setTutorialDone: (v) => set({ tutorialDone: v }),
      resetProgress: () =>
        set({
          currentLevel: 1, unlockedLevel: 1, movesThisLevel: 0, tutorialDone: false,
          watchCooldownUntil: 0,
        }),
      unlockAll: () => set({ unlockedLevel: TOTAL_LEVELS }),

      startWatchCooldown: () => set({ watchCooldownUntil: Date.now() + WATCH_COOLDOWN_MS }),
      isWatchOnCooldown: () => Date.now() < get().watchCooldownUntil,
      getWatchCooldownSecondsLeft: () => {
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
        tutorialDone: s.tutorialDone,
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
