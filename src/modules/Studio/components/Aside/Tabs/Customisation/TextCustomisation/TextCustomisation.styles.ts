import { styled } from '@styled-system/jsx'

export const Fieldset = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4',
    '& > select': {
      padding: '1',
      minWidth: '90px'
    }
  }
})
