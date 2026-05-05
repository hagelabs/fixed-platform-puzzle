import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TOTAL_LEVELS } from '../config/Constants';

interface GameState {
  currentLevel: number;
  unlockedLevel: number;
  movesThisLevel: number;
  audioEnabled: boolean;
  tutorialDone: boolean;

  setCurrentLevel: (n: number) => void;
  unlockNext: () => void;
  incMoves: () => void;
  resetMoves: () => void;
  toggleAudio: () => void;
  setTutorialDone: (v: boolean) => void;
  resetProgress: () => void;
}

const store = createStore<GameState>()(
  persist(
    (set) => ({
      currentLevel: 1,
      unlockedLevel: 1,
      movesThisLevel: 0,
      audioEnabled: true,
      tutorialDone: false,

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
        set({ currentLevel: 1, unlockedLevel: 1, movesThisLevel: 0, tutorialDone: false }),
    }),
    {
      name: 'fpp-game-state-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        currentLevel: s.currentLevel,
        unlockedLevel: s.unlockedLevel,
        audioEnabled: s.audioEnabled,
        tutorialDone: s.tutorialDone,
      }) as Partial<GameState>,
    }
  )
);

export const useGameStore = {
  getState: () => store.getState(),
  setState: store.setState,
  subscribe: store.subscribe,
};
