/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        portfolio: {
          bg: {
            hero: '#F5F0EB',
            about: '#F0E8E2',
            skills: '#EBE0DA',
            projects: '#E5D5CC',
            contact: '#F2ECE7',
          },
          accent: {
            hero: '#C4A68A',
            about: '#B8877A',
            skills: '#A86E62',
            projects: '#9B5B50',
            contact: '#8B6B5E',
          },
          text: {
            primary: '#2A2420',
            secondary: '#6B5E55',
            tertiary: '#9B8E85',
          },
          line: '#D5C9C0',
        },
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
    },
  },
  plugins: [],
};
