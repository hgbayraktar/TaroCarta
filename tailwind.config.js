/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
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
      },
      fontFamily: {
        heading: ['Cinzel_400Regular', 'serif'],
        'heading-bold': ['Cinzel_700Bold', 'serif'],
        body: ['Lato_400Regular', 'sans-serif'],
        'body-bold': ['Lato_700Bold', 'sans-serif'],
      },
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 28,
        xxl: 36,
      },
    },
  },
  plugins: [],
};
