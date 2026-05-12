const KNOWN_NEW_MOON_MS = new Date(2000, 0, 6).getTime();
const LUNAR_CYCLE_DAYS = 29.53058867;

export interface MoonPhaseResult {
  nameKey: string;
  symbol: string;
}

export function getMoonPhase(date: Date = new Date()): MoonPhaseResult {
  const daysDiff = (date.getTime() - KNOWN_NEW_MOON_MS) / 86400000;
  const position = ((daysDiff % LUNAR_CYCLE_DAYS) + LUNAR_CYCLE_DAYS) % LUNAR_CYCLE_DAYS;

  if (position < 1.85) return { nameKey: 'moon.new', symbol: '●' };
  if (position < 7.38) return { nameKey: 'moon.waxing_crescent', symbol: '◑' };
  if (position < 9.22) return { nameKey: 'moon.first_quarter', symbol: '◑' };
  if (position < 14.77) return { nameKey: 'moon.waxing_gibbous', symbol: '◑' };
  if (position < 16.61) return { nameKey: 'moon.full', symbol: '○' };
  if (position < 22.15) return { nameKey: 'moon.waning_gibbous', symbol: '◐' };
  if (position < 23.99) return { nameKey: 'moon.last_quarter', symbol: '◐' };
  return { nameKey: 'moon.waning_crescent', symbol: '◐' };
}
