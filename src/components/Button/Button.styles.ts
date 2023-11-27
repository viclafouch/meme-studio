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
      lineHeight: '22px',
      textDecoration: 'none',
      boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.14)',
      fontWeight: '500',
      transition: 'background-color 0.3s',
      '&:not(:disabled)': {
        cursor: 'pointer'
      },
      '&:has(.start-adornment)': {
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
      primaryDark: {
        root: {
          color: 'white',
          bg: 'primary.dark',
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
    size: {
      medium: {
        root: {
          paddingX: '2.5',
          paddingY: '2.5',
          fontSize: '1rem'
        }
      },
      large: {
        root: {
          fontWeight: '600',
          paddingX: '5',
          paddingY: '5',
          fontSize: '1.2rem'
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
    color: 'primary',
    size: 'medium'
  }
})

export type ButtonVariants = RecipeVariantProps<typeof button>
