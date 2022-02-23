import React from 'react'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useTexts } from '@stores/Editor/hooks/useTexts'

import Styled from './customisation.styled'
import EmptyCustom from './EmptyCustom/EmptyCustom'
import TextCustomisation from './TextCustomisation/TextCustomisation'

const Customisation = () => {
  const meme = useMeme()
  const [texts, updateText] = useTexts()

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
        {texts.map((text, index) => {
          return (
            <TextCustomisation
              onUpdateText={updateText}
              text={text}
              index={index}
              key={text.id}
            />
          )
        })}
      </Styled.TextBlocks>
    </div>
  )
}

export default Customisation
