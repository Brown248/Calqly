import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // next-themes ใช้ class strategy
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sarabun)', 'Sarabun', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // เพิ่มบรรทัดนี้เข้ามาเพื่อให้ Tailwind รู้จักสี border
        border: 'hsl(var(--border))', 
        brand: {
          50:  '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6df',
          300: '#5febc8',
          400: '#2dd4aa',
          500: '#14b88f',
          600: '#0d9373',
          700: '#0f745d',
          800: '#115c4b',
          900: '#124c3f',
          950: '#042c25',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: 'inherit',
            a: { color: 'inherit' },
            strong: { color: 'inherit' },
            'h1,h2,h3,h4': { color: 'inherit' },
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config