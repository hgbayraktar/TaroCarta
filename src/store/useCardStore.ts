import { create } from 'zustand';
import type { TarotCard } from '../domain/entities/TarotCard';
import type { DrawnCard } from '../domain/entities/Reading';

interface CardStore {
  dailyCard: DrawnCard | null;
  setDailyCard: (card: DrawnCard) => void;
  selectedCards: DrawnCard[];
  setSelectedCards: (cards: DrawnCard[]) => void;
  revealedCardIds: Set<string>;
  revealCard: (cardId: string) => void;
  resetReveal: () => void;
}

export const useCardStore = create<CardStore>((set) => ({
  dailyCard: null,
  setDailyCard: (card) => set({ dailyCard: card }),
  selectedCards: [],
  setSelectedCards: (cards) => set({ selectedCards: cards }),
  revealedCardIds: new Set(),
  revealCard: (cardId) =>
    set((state) => ({
      revealedCardIds: new Set([...state.revealedCardIds, cardId]),
    })),
  resetReveal: () => set({ revealedCardIds: new Set() }),
}));
