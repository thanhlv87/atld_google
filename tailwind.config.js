/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './**/*.{tsx,ts,jsx,js}',
    '!./node_modules/**',
    '!./functions/**',
    '!./dist/**',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#EA580C',
        'primary-dark': '#C2410C',
        secondary: '#FBBF24',
        accent: '#3B82F6',
        neutral: {
          light: '#f8fafc',
          DEFAULT: '#f1f5f9',
          dark: '#334155',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-up': 'fadeInUp 1s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
