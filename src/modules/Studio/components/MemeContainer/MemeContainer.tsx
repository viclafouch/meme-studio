import React from 'react'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import EmptyContainer from '../EmptyContainer/EmptyContainer'
import Styled from './MemeContainer.styled'

export type MemeContainerProps = {
  children: React.ReactNode
}

const MemeContainer = (props: MemeContainerProps) => {
  const { children } = props
  const meme = useMeme()

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
