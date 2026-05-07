export interface JournalEntry {
  id: string;
  readingId: string;
  cardIds: string[];
  note: string;
  mood?: string;
  createdAt: Date;
}
