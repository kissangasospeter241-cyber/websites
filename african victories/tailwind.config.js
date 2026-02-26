module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8f2',
          100: '#e6eedf',
          600: '#486b3a',
          700: '#39562f'
        },
        sand: '#c69c6d',
        ink: '#1f2937'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0, 0, 0, 0.08)'
      },
      borderRadius: {
        xl2: '1rem'
      }
    }
  },
  plugins: []
}
