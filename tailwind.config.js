/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
    require('@tailwindcss/typography'),
  ],
};
