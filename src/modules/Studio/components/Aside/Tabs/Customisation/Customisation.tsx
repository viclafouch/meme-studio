import React from 'react'
import { useEditorStore } from '@stores/Editor/editor.store'
import { useMeme } from '@stores/Editor/hooks/useMeme'

import Styled from './customisation.styled'
import EmptyCustom from './EmptyCustom/EmptyCustom'
import TextCustomisation from './TextCustomisation/TextCustomisation'

const Customisation = () => {
  const meme = useMeme()

  if (!meme) {
    return <EmptyCustom />
  }

  return (
    <div>
      <Styled.BlockTitle>
        <Styled.Legend>Customization</Styled.Legend>
        <Styled.MemeName>{meme.translations.en.name}</Styled.MemeName>
      </Styled.BlockTitle>
      <Styled.TextBlocks>
        <TextCustomisation />
      </Styled.TextBlocks>
    </div>
  )
}

export default Customisation
