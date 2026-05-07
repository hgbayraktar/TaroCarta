import { create } from 'zustand';
import type { Reading } from '../domain/entities/Reading';

interface ReadingStore {
  currentReading: Reading | null;
  setCurrentReading: (reading: Reading) => void;
  aiInterpretation: string | null;
  setAIInterpretation: (text: string) => void;
  isLoadingAI: boolean;
  setIsLoadingAI: (loading: boolean) => void;
  clearReading: () => void;
}

export const useReadingStore = create<ReadingStore>((set) => ({
  currentReading: null,
  setCurrentReading: (reading) => set({ currentReading: reading }),
  aiInterpretation: null,
  setAIInterpretation: (text) => set({ aiInterpretation: text }),
  isLoadingAI: false,
  setIsLoadingAI: (loading) => set({ isLoadingAI: loading }),
  clearReading: () =>
    set({ currentReading: null, aiInterpretation: null, isLoadingAI: false }),
}));
