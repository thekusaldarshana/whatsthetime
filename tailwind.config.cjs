/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables `dark:` classes
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}',
    './components/**/*.{astro,html,js}',
    './pages/**/*.{astro,html,js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"San Francisco"',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      fontSize: {
      'xxs': '0.65rem',
      '3xl': '1.75rem',
      'hero': '5rem',
    },
      colors: {
        baseDark: '#0b0f19', // Deep modern dark
        glow: '#0fffc3',      // For green-glow effects
        sunny: {
          50:  '#fffcf5',     // Background
          100: '#fff8e7',     // Card/Container
          200: '#fff2cc',     // Hover / border
          300: '#ffe79f',     // Active
          400: '#ffda75',     // Accent
          500: '#ffc940',     // Primary golden sunshine
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', // Glassmorphism shadow
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Optional: enhances <input>, <select>, <textarea>
  ],
};
