import type { TarotCard } from '../entities/TarotCard';

export interface ICardRepository {
  getAllCards(): TarotCard[];
  getCardById(id: string): TarotCard | undefined;
  getRandomCard(excludeIds?: string[]): TarotCard;
  getRandomCards(count: number): TarotCard[];
  getDailyCard(date: Date): TarotCard;
}
