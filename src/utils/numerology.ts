function digitSum(n: number): number {
  return String(n)
    .split('')
    .reduce((acc, d) => acc + parseInt(d, 10), 0);
}

export function getLifePathNumber(birthDate: Date): number {
  const digits = [
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate(),
  ]
    .join('')
    .split('')
    .reduce((acc, d) => acc + parseInt(d, 10), 0);

  let n = digits;
  while (n > 22) n = digitSum(n);
  return n === 0 ? 22 : n;
}

// Maps life path number (1-22) to Major Arcana nameKey
const MAJOR_ARCANA_KEYS = [
  'major_00', 'major_01', 'major_02', 'major_03', 'major_04',
  'major_05', 'major_06', 'major_07', 'major_08', 'major_09',
  'major_10', 'major_11', 'major_12', 'major_13', 'major_14',
  'major_15', 'major_16', 'major_17', 'major_18', 'major_19',
  'major_20', 'major_21',
] as const;

export function getBirthCardKey(birthDate: Date): string {
  const n = getLifePathNumber(birthDate);
  return `cards.${MAJOR_ARCANA_KEYS[n % 22] ?? 'major_00'}`;
}
