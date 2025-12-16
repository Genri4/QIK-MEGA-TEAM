/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        grey: {
          1000: '#101010',
          950: '#1A1A1A',
          900: '#2D2D2D',
          800: '#5A5A5A',
          700: '#878787',
          600: '#B4B4B4',
          500: '#E1E1E1',
          400: '#E7E7E7',
          300: '#EDEDED',
          200: '#F3F3F3',
          100: '#F9F9F9',
          0: '#FFFFFF',
        },
        primary: {
          600: '#3340BA',
          500: '#4050E9',
          400: '#6673ED',
          300: '#8C96F2',
        },
        info: {
          600: '#3340BA',
          300: '#858CD6',
        },
        danger: {
          600: '#B10000',
          300: '#D06666',
        },
        warning: {
          600: '#E28706',
          300: '#EEB76A',
        },
        success: {
          600: '#00660E',
          300: '#66A36E',
        },
        background: {
          dark: '#101010',
          light: '#FFFFFF',
        },
      },
      spacing: {
        sm: '2px',
        md: '4px',
        lg: '8px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '40px',
        '5xl': '56px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '20px',
      },
    },
  },
}
