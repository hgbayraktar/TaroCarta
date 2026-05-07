import type { Reading } from '../entities/Reading';

export interface IReadingRepository {
  saveReading(reading: Reading): Promise<void>;
  getReadingById(id: string): Promise<Reading | undefined>;
  getReadings(limit?: number): Promise<Reading[]>;
  getTodaysReading(): Promise<Reading | undefined>;
}
