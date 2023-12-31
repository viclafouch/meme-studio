import { cva } from '@styled-system/css'
import { styled } from '@styled-system/jsx'

export const ToolsListItem = styled('li', {
  base: {
    w: 'full',
    '&:not(:last-of-type)': {
      borderBottom: '1px solid rgba(200, 200, 200, 0.397)'
    }
  }
})

export const buttonRecipe = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    w: 'full',
    h: '54px',
    cursor: 'pointer',
    color: 'white',
    fontSize: 'sm',
    p: '1px 7px 2px',

    '&:disabled': {
      cursor: 'not-allowed',
      color: 'rgb(146, 146, 146)'
    },

    '&:not(:disabled):hover': {
      cursor: 'pointer',
      color: '#c5c5c5'
    }
  }
})

export const ToolsButton = styled('button', buttonRecipe)
