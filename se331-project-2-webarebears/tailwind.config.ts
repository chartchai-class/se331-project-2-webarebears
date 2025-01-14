/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        sp: '0 3px 12px 0 rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        sans: ['Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        fade: 'yellowFade 3s ease-in-out',
      },
      keyframes: {
        yellowFade: {
          '0%': { backgroundColor: 'yellow' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      colors: {
        customRed: '#AB3428',
        customOrange: '#F49E4C',
        customBlue:'#3B8EA5',
        customYellow:'#f5ee9e',
        customDarkBlue:'#2D728F'


      },
    },
  },
  plugins: [],
} satisfies Config
