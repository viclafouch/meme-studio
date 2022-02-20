import React from 'react'
import Sad from '@components/icons/Sad'

import Styled from './empty-custom.styled'

const EmptyCustom = () => {
  return (
    <Styled.EmptyCustom>
      <Sad width={50} />
      <Styled.EmptyTypography>No meme selected</Styled.EmptyTypography>
    </Styled.EmptyCustom>
  )
}

export default EmptyCustom
