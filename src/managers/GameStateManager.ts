import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TOTAL_LEVELS } from '../config/Constants';

interface GameState {
  currentLevel: number;
  unlockedLevel: number;
  totalScore: number;
  movesThisLevel: number;
  audioEnabled: boolean;

  setCurrentLevel: (n: number) => void;
  unlockNext: () => void;
  addScore: (n: number) => void;
  incMoves: () => void;
  resetMoves: () => void;
  toggleAudio: () => void;
  resetProgress: () => void;
}

const store = createStore<GameState>()(
  persist(
    (set) => ({
      currentLevel: 1,
      unlockedLevel: 1,
      totalScore: 0,
      movesThisLevel: 0,
      audioEnabled: true,

      setCurrentLevel: (n) => set({ currentLevel: n, movesThisLevel: 0 }),
      unlockNext: () =>
        set((s) => ({
          unlockedLevel: Math.min(TOTAL_LEVELS, Math.max(s.unlockedLevel, s.currentLevel + 1)),
        })),
      addScore: (n) => set((s) => ({ totalScore: s.totalScore + n })),
      incMoves: () => set((s) => ({ movesThisLevel: s.movesThisLevel + 1 })),
      resetMoves: () => set({ movesThisLevel: 0 }),
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
      resetProgress: () =>
        set({ currentLevel: 1, unlockedLevel: 1, totalScore: 0, movesThisLevel: 0 }),
    }),
    {
      name: 'fpp-game-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        currentLevel: s.currentLevel,
        unlockedLevel: s.unlockedLevel,
        totalScore: s.totalScore,
        audioEnabled: s.audioEnabled,
      }) as Partial<GameState>,
    }
  )
);

export const useGameStore = {
  getState: () => store.getState(),
  setState: store.setState,
  subscribe: store.subscribe,
};
