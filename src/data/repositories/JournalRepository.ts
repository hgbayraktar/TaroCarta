import type { IJournalRepository } from '../../domain/repositories/IJournalRepository';
import type { JournalEntry } from '../../domain/entities/JournalEntry';
import { getDatabase, generateId } from '../local/database';

export class JournalRepository implements IJournalRepository {
  async saveEntry(entry: JournalEntry): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT OR REPLACE INTO journal_entries
       (id, reading_id, card_ids_json, note, mood, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        entry.id,
        entry.readingId,
        JSON.stringify(entry.cardIds),
        entry.note,
        entry.mood ?? null,
        entry.createdAt.getTime(),
      ]
    );
  }

  async getEntries(limit: number = 50): Promise<JournalEntry[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{
      id: string;
      reading_id: string;
      card_ids_json: string;
      note: string;
      mood: string | null;
      created_at: number;
    }>('SELECT * FROM journal_entries ORDER BY created_at DESC LIMIT ?', [limit]);

    return rows.map((row) => ({
      id: row.id,
      readingId: row.reading_id,
      cardIds: JSON.parse(row.card_ids_json) as string[],
      note: row.note,
      mood: row.mood ?? undefined,
      createdAt: new Date(row.created_at),
    }));
  }

  async getEntryByReadingId(readingId: string): Promise<JournalEntry | undefined> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{
      id: string;
      reading_id: string;
      card_ids_json: string;
      note: string;
      mood: string | null;
      created_at: number;
    }>('SELECT * FROM journal_entries WHERE reading_id = ?', [readingId]);

    if (!row) return undefined;

    return {
      id: row.id,
      readingId: row.reading_id,
      cardIds: JSON.parse(row.card_ids_json) as string[],
      note: row.note,
      mood: row.mood ?? undefined,
      createdAt: new Date(row.created_at),
    };
  }

  async deleteEntry(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM journal_entries WHERE id = ?', [id]);
  }
}

export const journalRepository = new JournalRepository();
