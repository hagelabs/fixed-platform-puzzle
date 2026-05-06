import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TOTAL_LEVELS } from '../config/Constants';

export const WATCH_MAX = 5;
export const WATCH_RESET_MS = 10 * 60 * 1000;

interface GameState {
  currentLevel: number;
  unlockedLevel: number;
  movesThisLevel: number;
  audioEnabled: boolean;
  tutorialDone: boolean;

  watchCredits: number;
  watchLastConsumedAt: number;

  setCurrentLevel: (n: number) => void;
  unlockNext: () => void;
  incMoves: () => void;
  resetMoves: () => void;
  toggleAudio: () => void;
  setTutorialDone: (v: boolean) => void;
  resetProgress: () => void;
  unlockAll: () => void;

  refreshWatchCredits: () => void;
  consumeWatch: () => boolean;
  getWatchCredits: () => number;
  getWatchResetSecondsLeft: () => number;
}

const store = createStore<GameState>()(
  persist(
    (set, get) => ({
      currentLevel: 1,
      unlockedLevel: 1,
      movesThisLevel: 0,
      audioEnabled: true,
      tutorialDone: false,

      watchCredits: WATCH_MAX,
      watchLastConsumedAt: 0,

      setCurrentLevel: (n) => set({ currentLevel: n, movesThisLevel: 0 }),
      unlockNext: () =>
        set((s) => ({
          unlockedLevel: Math.min(TOTAL_LEVELS, Math.max(s.unlockedLevel, s.currentLevel + 1)),
        })),
      incMoves: () => set((s) => ({ movesThisLevel: s.movesThisLevel + 1 })),
      resetMoves: () => set({ movesThisLevel: 0 }),
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
      setTutorialDone: (v) => set({ tutorialDone: v }),
      resetProgress: () =>
        set({
          currentLevel: 1, unlockedLevel: 1, movesThisLevel: 0, tutorialDone: false,
          watchCredits: WATCH_MAX, watchLastConsumedAt: 0,
        }),
      unlockAll: () => set({ unlockedLevel: TOTAL_LEVELS }),

      refreshWatchCredits: () => {
        const s = get();
        if (s.watchCredits >= WATCH_MAX) return;
        const elapsed = Date.now() - s.watchLastConsumedAt;
        if (elapsed >= WATCH_RESET_MS) {
          set({ watchCredits: WATCH_MAX, watchLastConsumedAt: 0 });
        }
      },
      consumeWatch: () => {
        get().refreshWatchCredits();
        const s = get();
        if (s.watchCredits <= 0) return false;
        set({
          watchCredits: s.watchCredits - 1,
          watchLastConsumedAt: s.watchLastConsumedAt === 0 ? Date.now() : s.watchLastConsumedAt,
        });
        return true;
      },
      getWatchCredits: () => {
        get().refreshWatchCredits();
        return get().watchCredits;
      },
      getWatchResetSecondsLeft: () => {
        const s = get();
        if (s.watchCredits >= WATCH_MAX || s.watchLastConsumedAt === 0) return 0;
        const remain = WATCH_RESET_MS - (Date.now() - s.watchLastConsumedAt);
        return Math.max(0, Math.ceil(remain / 1000));
      },
    }),
    {
      name: 'fpp-game-state-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        currentLevel: s.currentLevel,
        unlockedLevel: s.unlockedLevel,
        audioEnabled: s.audioEnabled,
        tutorialDone: s.tutorialDone,
        watchCredits: s.watchCredits,
        watchLastConsumedAt: s.watchLastConsumedAt,
      }) as Partial<GameState>,
    }
  )
);

export const useGameStore = {
  getState: () => store.getState(),
  setState: store.setState,
  subscribe: store.subscribe,
};
