/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#030712',
        secondaryBackground: '#0F172A',
        card: '#111827',
        border: 'rgba(255,255,255,0.08)',
        primary: '#2563EB',
        accent: '#06B6D4',
        success: '#10B981',
        danger: '#EF4444',
        text: '#FFFFFF',
        subtext: '#94A3B8',
        secondary: '#0EA5E9'
      },
      backgroundImage: (theme) => ({
        'gradient-primary': `linear-gradient(135deg, ${theme('colors.primary')}, ${theme('colors.accent')})`,
        'gradient-glass': `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))`
      }),
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px'
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0,0,0,0.5)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
