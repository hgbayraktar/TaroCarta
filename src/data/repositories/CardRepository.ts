import type { ICardRepository } from '../../domain/repositories/ICardRepository';
import type { TarotCard } from '../../domain/entities/TarotCard';
import { TAROT_CARDS } from '../../constants/tarotCards';

export class CardRepository implements ICardRepository {
  private readonly cards: TarotCard[] = TAROT_CARDS;

  getAllCards(): TarotCard[] {
    return this.cards;
  }

  getCardById(id: string): TarotCard | undefined {
    return this.cards.find((c) => c.id === id);
  }

  getRandomCard(excludeIds: string[] = []): TarotCard {
    const available = this.cards.filter((c) => !excludeIds.includes(c.id));
    const index = Math.floor(Math.random() * available.length);
    // available is guaranteed non-empty since deck has 78 cards
    return available[index]!;
  }

  getRandomCards(count: number): TarotCard[] {
    const shuffled = [...this.cards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  getDailyCard(date: Date): TarotCard {
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = dayOfYear % this.cards.length;
    return this.cards[index]!;
  }
}

export const cardRepository = new CardRepository();
