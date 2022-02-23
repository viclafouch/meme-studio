import React from 'react'
import { useDimensionsStore } from '@stores/Editor/dimensions.store'
import { useEditorStore } from '@stores/Editor/editor.store'

import EmptyContainer from '../EmptyContainer/EmptyContainer'
import Styled from './meme-container.styled'

type MemeContainerProps = {
  children: React.ReactNode
}

const MemeContainer = (props: MemeContainerProps) => {
  const { children } = props
  const meme = useEditorStore((state) => {
    return state.meme as Meme
  })
  const dimensions = useDimensionsStore((state) => {
    return state.dimensions
  })

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
      {dimensions.width && dimensions.height ? children : null}
    </Styled.Container>
  )
}

export default MemeContainer
