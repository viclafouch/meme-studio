import React from 'react'
import Button from '@components/Button/Button'
import { preventEmptyTextValue } from '@shared/utils/textbox'
import { useItemIdSelected } from '@stores/Editor/hooks/useItemIdSelected'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useTexts } from '@stores/Editor/hooks/useTexts'
import Accordion from '@studio/components/Accordion'
import Styled from './customisation.styled'
import EmptyCustom from './EmptyCustom'
import TextCustomisation from './TextCustomisation'

const Customisation = () => {
  const meme = useMeme()
  const { texts, updateText, addText } = useTexts()
  const { itemIdSelected, toggleItemIdSelected } = useItemIdSelected()

  if (!meme) {
    return <EmptyCustom />
  }

  const handleAddTextbox = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    addText()
  }

  return (
    <Styled.Scrollable>
      <Styled.BlockTitle>
        <Styled.Legend>Customization</Styled.Legend>
        <Styled.MemeName>{meme.translations.en.name}</Styled.MemeName>
      </Styled.BlockTitle>
      <Styled.TextBlocks>
        {texts.map((text, index) => {
          return (
            <Accordion
              onToggle={toggleItemIdSelected}
              title={preventEmptyTextValue(text.value, index)}
              id={text.id}
              isOpened={itemIdSelected === text.id}
              key={text.id}
            >
              <TextCustomisation
                onUpdateText={updateText}
                text={text}
                index={index}
              />
            </Accordion>
          )
        })}
      </Styled.TextBlocks>
      <Button rounded={false} fullWidth onClick={handleAddTextbox}>
        Ajouter un texte
      </Button>
    </Styled.Scrollable>
  )
}

export default Customisation
