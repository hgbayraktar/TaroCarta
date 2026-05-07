export type CardSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
  id: string;
  nameKey: string;
  suit: CardSuit;
  number: number;
  imageUrl?: string;
  keywords: string[];
  uprightMeaningKey: string;
  reversedMeaningKey: string;
}
