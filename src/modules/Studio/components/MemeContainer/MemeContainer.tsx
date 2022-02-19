import React from 'react'

import Styled from './meme-container.styled'

type MemeContainerProps = {
  meme: Meme
  children: React.ReactNode
}

const MemeContainer = (props: MemeContainerProps) => {
  const { meme, children } = props

  return (
    <Styled.Container>
      <Styled.Overlay
        style={{
          backgroundImage: `url(https://www.meme-studio.io/templates/${meme.filename})`
        }}
      />
      {children}
    </Styled.Container>
  )
}

export default MemeContainer
