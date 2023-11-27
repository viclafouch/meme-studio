import { defineConfig, defineGlobalStyles } from '@pandacss/dev'

const globalCss = defineGlobalStyles({
  html: {
    fontSize: '16px'
  },
  '*': {
    colorScheme: 'dark'
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
            DEFAULT: { value: 'rgb(48, 48, 48)' }
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
            backgroundImage:
              "url('https://www.meme-studio.io/images/particles.svg')"
          }
        }
      }
    }
  },

  // The output directory for your css system
  outdir: 'styled-system'
})
