import type { ICardRepository } from '../repositories/ICardRepository';
import type { Reading, SpreadType, DrawnCard } from '../entities/Reading';
import { generateId } from '../../data/local/database';

const SPREAD_CARD_COUNTS: Record<SpreadType, number> = {
  daily: 1,
  three_card: 3,
  celtic_cross: 10,
  relationship: 5,
};

export class PerformReading {
  constructor(private readonly cardRepository: ICardRepository) {}

  execute(spreadType: SpreadType, question?: string): Reading {
    const count = SPREAD_CARD_COUNTS[spreadType];
    const cards = this.cardRepository.getRandomCards(count);

    const drawnCards: DrawnCard[] = cards.map((card) => ({
      card,
      isReversed: Math.random() < 0.3,
    }));

    return {
      id: generateId(),
      spreadType,
      cards: drawnCards,
      question,
      createdAt: new Date(),
    };
  }
}
