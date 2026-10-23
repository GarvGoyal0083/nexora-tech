/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          950: '#07090e',
          900: '#0b0f19',
          850: '#0f1626',
          800: '#141c30',
          700: '#1e2942',
          600: '#2d3b5b',
          blue: '#0070F3',
          cyan: '#00F0FF',
          neon: '#38BDF8',
          glow: '#0ea5e9'
        }
      },
      boxShadow: {
        'neon-blue': '0 0 20px -3px rgba(0, 112, 243, 0.45)',
        'neon-cyan': '0 0 25px -4px rgba(0, 240, 255, 0.4)',
        'cyber-card': '0 8px 32px 0 rgba(0, 14, 38, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2.5s infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { filter: 'drop-shadow(0 0 5px rgba(0, 240, 255, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.9))' }
        }
      }
    },
  },
  plugins: [],
}
