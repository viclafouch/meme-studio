import React from 'react'

import Styled from './meme-container.styled'

type MemeContainerProps = {
  meme: Meme
}

const MemeContainer = (props: MemeContainerProps) => {
  const { meme } = props
  return (
    <Styled.Container>
      <Styled.Overlay
        style={{
          backgroundImage: `url('https://www.meme-studio.io/templates/${meme.filename}')`
        }}
      />
    </Styled.Container>
  )
}

export default MemeContainer
