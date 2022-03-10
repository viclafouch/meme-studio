import React from 'react'
import { useWindowSizeCallback } from '@shared/hooks/useWindowSizeCallback'
import { useCanvasDimensions } from '@stores/Editor/hooks/useCanvasDimensions'
import { useMeme } from '@stores/Editor/hooks/useMeme'

import EmptyContainer from '../EmptyContainer/EmptyContainer'
import Styled from './meme-container.styled'

type MemeContainerProps = {
  children: React.ReactNode
}

const MemeContainer = (props: MemeContainerProps) => {
  const { children } = props
  const meme = useMeme()
  const [, resize] = useCanvasDimensions()
  useWindowSizeCallback(resize)

  if (!meme) {
    return <EmptyContainer />
  }

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
