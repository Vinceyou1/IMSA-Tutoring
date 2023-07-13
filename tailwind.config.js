/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors:{
      'primary': '#e2e8f0',
      'secondary': '#374151',
      'primary-dark': '#334155',
      'secondary-dark': '#e7e5e4',
      'request': 'white',
      'request-dark': '#475569',
      'filter-active': '#bae6fd',
      'filter-active-dark': '#0369a1'
    }
  },
  plugins: [],
}
