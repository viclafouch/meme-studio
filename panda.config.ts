import { defineConfig, defineGlobalStyles } from '@pandacss/dev'

const globalCss = defineGlobalStyles({
  html: {
    fontSize: '16px',
    mdDown: {
      '&:has( #studio)': {
        overflow: 'hidden',
        overscrollBehavior: 'none'
      }
    }
  },
  '*': {
    colorScheme: 'dark'
  },
  iframe: {
    colorScheme: 'initial'
  }
})

export default defineConfig({
  globalCss,
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  jsxFramework: 'react',

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          primary: {
            DEFAULT: { value: 'rgb(100, 159, 255)' },
            dark: { value: 'rgb(48, 91, 161)' }
          },
          secondary: {
            dark: { value: 'rgb(48, 48, 48)' },
            DEFAULT: { value: 'rgb(68, 68, 68)' },
            light: { value: 'rgb(88, 88, 88)' },
            textContrast: { value: '#f0f0f0' }
          }
        }
      },
      keyframes: {
        skeletonLoading: {
          to: {
            backgroundPositionX: '-200%'
          }
        },
        octocat: {
          '0%, 100%': {
            transform: 'rotate(0)'
          },
          '20%, 60%': {
            transform: 'rotate(-25deg)'
          },
          '40%, 80%': {
            transform: 'rotate(10deg)'
          }
        }
      }
    }
  },

  patterns: {
    extend: {
      particulesBg: {
        properties: {},
        transform() {
          return {
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'repeat-y',
            backgroundImage: "url('/images/particles.svg')"
          }
        }
      },
      skeleton: {
        properties: {},
        transform(props) {
          return {
            background:
              'linear-gradient(to right, #656871 0%, #888b94 20%, #656871 40%, #656871 100%)',
            backgroundSize: '200% 100%',
            animation: '1.5s skeletonLoading linear infinite',
            ...props
          }
        }
      }
    }
  },

  // The output directory for your css system
  outdir: 'styled-system'
})
