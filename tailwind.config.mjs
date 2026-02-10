import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'shake': 'shake 0.2s ease-in-out 0s 2',
      },
      fontFamily: {
        sans: ['var(--font-open-sans)'],
        mono: ['var(--font-fira-code)'],
      },
      typography: ({ theme }) => ({
        // Default prose styles
        DEFAULT: {
          css: {
            strong: {
              color: theme('colors.blue.400'), // Example: blue-400 for bold text
            },
          },
        },
        // Inverse prose styles (for prose-invert)
        invert: {
          css: {
            strong: {
              color: theme('colors.blue.300'), // Example: blue-300 for bold text in inverse mode
            },
          },
        },
      }),
    },
  },
  plugins: [
    typography,
  ],
};