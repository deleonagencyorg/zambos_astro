module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  safelist: [
    'bg-primary', 'text-primary', 'border-primary',
    'bg-secondary', 'text-secondary', 'border-secondary',
    'bg-tertiary', 'text-tertiary', 'border-tertiary',
    'bg-red', 'text-red', 'border-red',
    'bg-white', 'text-white', 'border-white',
    'bg-blue', 'text-blue', 'border-blue',
    'bg-orange', 'text-orange', 'border-orange',
    'bg-yellow', 'text-yellow', 'border-yellow',
    'bg-pink', 'text-pink', 'border-pink',
    'bg-quinary', 'text-quinary', 'border-quinary',
    'bg-brown', 'text-brown', 'border-brown',
    'bg-green', 'text-green', 'border-green',
    ],
  theme: {
    screens: {
      'xs': '390px',      // Teléfono
      'sm': '640px',      // Teléfono grande
      'md': '768px',      // Tablet
      'lg': '1024px',     // Laptop
      'xl': '1440px',     // Desktop
      '2xl': '1920px',    // Desktop grande
    },
    extend: {
      colors: {
        // ES (default) palette
        primary: '#0DB14A',
        secondary: '#FFED7A',
        tertiary: '#FF0001',
        cuaternary: '#009337',
        quinary: '#0167F7',
        red: '#FF0001',
        white: '#FFFFFF',
        brown: '#5B3F2E',
        blue: '#0167F7',
        green: '#0DB14A',
        orange: '#FD6600',
        yellow: '#FFED7A',
        pink: '#FF4DFF',
        lemon: '#BEDE89',
        greenDark: '#009337',

        // US palette (use with bg-us-primary, text-us-secondary, etc.)
        'us-primary': '#0E6D20',
        'us-secondary': '#F5A623',
        'us-tertiary': '#B71C1C',
        'us-cuaternary': '#16A085',
        'us-quinary': '#2980B9',
        'us-red': '#B71C1C',
        'us-brown': '#6D4C41',
        'us-blue': '#2980B9',
        'us-green': '#0E6D20',
        'us-orange': '#E67E22',
        'us-yellow': '#F5A623',
        'us-pink': '#E91E63',
        'us-lemon': '#A8D648',
        'us-greenDark': '#145A32',
      },
      fontFamily: {
        // ES (default) fonts
        sans: ['Rockeby regular', 'sans-serif'],
        title: ['Rockeby black', 'serif'],
        heading: ['Rockeby regular', 'sans-serif'],
        text: ['Rockeby regular', 'sans-serif'],
        // US fonts
        'us-sans': ['Strelka Ultra', 'sans-serif'],
        'us-title': ['Strelka Ultra', 'sans-serif'],
        'us-heading': ['Strelka Ultra', 'sans-serif'],
        'us-text': ['Strelka Ultra', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ]
}