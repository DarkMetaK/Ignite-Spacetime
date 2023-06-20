/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-roboto)',
        alt: 'var(--font-baijamjuree)',
      },

      colors: {
        gray: {
          50: '#eaeaea',
          100: '#bebebf',
          200: '#9e9ea0',
          300: '#727275',
          400: '#56565a',
          500: '#2c2c31',
          600: '#28282d',
          700: '#1f1f23',
          800: '#18181b',
          900: '#121215',
        },
        purple: {
          50: '#f3eefc',
          100: '#d8cbf7',
          200: '#c6b2f3',
          300: '#ab8eee',
          400: '#9b79ea',
          500: '#8257e5',
          600: '#764fd0',
          700: '#5c3ea3',
          800: '#48307e',
          900: '#372560',
        },
        green: {
          50: '#e6fbef',
          100: '#b1f1ce',
          200: '#8cebb6',
          300: '#57e295',
          400: '#36dc81',
          500: '#04d361',
          600: '#04c058',
          700: '#039645',
          800: '#027435',
          900: '#025929',
        },
      },

      fontSize: {
        '5xl': '2.5rem',
      },

      backgroundImage: {
        stripes:
          'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 12.5%, transparent 12.5%, transparent)',
      },

      backgroundSize: {
        stripes: '100% 8px',
      },

      blur: {
        full: '194px',
      },

      keyframes: {
        'toast-slide-in': {
          from: {
            transform: 'translateX(calc(100% + 24px))',
          },
          to: {
            transform: 'translateX(0)',
          },
        },
        'toast-slide-out': {
          from: {
            transform: 'translateX(var(--radix-toast-swipe-end-x))',
          },
          to: {
            transform: 'translateX(calc(100% + 24px))',
          },
        },
        'toast-hide': {
          from: {
            opacity: 1,
          },
          to: {
            opacity: 0,
          },
        },
      },

      animation: {
        'toast-open': 'toast-slide-in 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-closed': 'toast-hide 100ms ease-in',
        'toast-end': 'toast-slide-out 100ms ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
