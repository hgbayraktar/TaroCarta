import type { TarotCard } from './TarotCard';

export type SpreadType = 'daily' | 'three_card' | 'celtic_cross';

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position?: string;
}

export interface Reading {
  id: string;
  spreadType: SpreadType;
  cards: DrawnCard[];
  question?: string;
  aiInterpretation?: string;
  createdAt: Date;
}
