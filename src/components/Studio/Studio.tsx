import React from 'react'
import Aside from '@components/Aside/Aside'
import Tools from '@components/Tools/Tools'

import EmptyMeme from './EmptyMeme/EmptyMeme'
import Styled from './studio.styled'

const Studio = () => {
  return (
    <Styled.Studio>
      <Tools />
      <Styled.DefaultContainer>
        <EmptyMeme />
      </Styled.DefaultContainer>
      <Aside />
    </Styled.Studio>
  )
}

export default Studio
