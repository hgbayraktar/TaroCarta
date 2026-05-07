import type { ICardRepository } from '../repositories/ICardRepository';
import type { TarotCard } from '../entities/TarotCard';

export class GetDailyCard {
  constructor(private readonly cardRepository: ICardRepository) {}

  execute(date: Date = new Date()): TarotCard {
    return this.cardRepository.getDailyCard(date);
  }
}
