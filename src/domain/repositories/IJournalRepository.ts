import type { JournalEntry } from '../entities/JournalEntry';

export interface IJournalRepository {
  saveEntry(entry: JournalEntry): Promise<void>;
  getEntries(limit?: number): Promise<JournalEntry[]>;
  getEntryByReadingId(readingId: string): Promise<JournalEntry | undefined>;
  deleteEntry(id: string): Promise<void>;
}
