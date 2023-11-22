import { defineConfig, defineGlobalStyles } from '@pandacss/dev'

const globalCss = defineGlobalStyles({
  html: {
    fontSize: '16px'
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
          primary: { value: 'rgb(100, 159, 255)' },
          secondary: { value: 'rgb(48, 48, 48)' }
        }
      }
    }
  },

  // The output directory for your css system
  outdir: 'styled-system'
})
