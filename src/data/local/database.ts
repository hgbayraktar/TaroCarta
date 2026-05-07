import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('tarocarta.db');
    await initializeSchema(db);
  }
  return db;
}

async function initializeSchema(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS readings (
      id TEXT PRIMARY KEY,
      spread_type TEXT NOT NULL,
      cards_json TEXT NOT NULL,
      question TEXT,
      ai_interpretation TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      reading_id TEXT NOT NULL,
      card_ids_json TEXT NOT NULL,
      note TEXT NOT NULL,
      mood TEXT,
      created_at INTEGER NOT NULL
    );
  `);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
