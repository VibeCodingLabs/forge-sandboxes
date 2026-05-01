import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-sans)', ...fontFamily.sans] },
      colors: {
        neon: { cyan: '#00f5ff', purple: '#a855f7', green: '#00ff88' }
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        glow: { '0%,100%': { textShadow: '0 0 5px currentColor' }, '50%': { textShadow: '0 0 25px currentColor' } },
        slideUp: { from: { transform: 'translateY(10px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } }
      }
    }
  },
  plugins: []
}
export default config
