import { RecipeVariantProps, sva } from '@styled-system/css'

export const button = sva({
  slots: ['root', 'start-adornment'],
  base: {
    root: {
      fontFamily: 'inherit',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      letterSpacing: '0.5px',
      fontSize: '1rem',
      lineHeight: '22px',
      textDecoration: 'none',
      boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.14)',
      padding: '14px 18px',
      fontWeight: '500',
      transition: 'background-color 0.3s',
      '&:not(:disabled)': {
        cursor: 'pointer'
      },
      '&:has(.button-start-adornment)': {
        gap: '8px'
      }
    },
    'start-adornment': {}
  },
  variants: {
    color: {
      primary: {
        root: {
          color: 'white',
          bg: 'primary',
          border: '1px solid transparent',
          '&:not(:disabled):hover': {
            bg: '#649fff'
          }
        }
      },
      secondary: {
        root: {
          color: 'white',
          bg: 'secondary',
          border: '1px solid rgba(189, 189, 189, 0.541)',
          '&:not(:disabled):hover': {
            bg: '#535353'
          }
        }
      }
    },
    rounded: {
      true: {
        root: {
          borderRadius: '8px'
        }
      },
      false: {
        root: {
          borderRadius: '0'
        }
      }
    },
    fullWidth: {
      true: {
        root: {
          width: 'full'
        }
      },
      false: {
        root: {
          width: 'auto'
        }
      }
    }
  },
  defaultVariants: {
    fullWidth: false,
    rounded: false,
    color: 'primary'
  }
})

export type ButtonVariants = RecipeVariantProps<typeof button>
