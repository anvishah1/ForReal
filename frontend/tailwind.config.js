/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'syne': ['Syne', 'sans-serif'],
        'space': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'forreal': {
          red: '#e74c3c',
          dark: '#0a0a0a',
          gray: '#1a1a1a',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(231, 76, 60, 0.3)' },
          'to': { boxShadow: '0 0 40px rgba(231, 76, 60, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
