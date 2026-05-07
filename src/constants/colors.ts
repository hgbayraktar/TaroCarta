export const colors = {
  background: '#0D1117',
  surface: '#161B22',
  surfaceAlt: '#1C2333',
  gold: '#C9A84C',
  goldLight: '#E8C96A',
  purple: '#9B7FD4',
  purpleLight: '#B9A0E8',
  text: '#F0E6D3',
  textMuted: '#8B8FA8',
  border: '#2D3748',
} as const;

export type ColorKey = keyof typeof colors;
