import React from 'react'
import Button from '@components/Button/Button'
import Tooltip from '@components/Tooltip'
import { preventEmptyTextValue } from '@shared/utils/textbox'
import { useItemIdSelected } from '@stores/Editor/hooks/useItemIdSelected'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useTexts } from '@stores/Editor/hooks/useTexts'
import Accordion from '@studio/components/Accordion'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Styled from './customisation.styled'
import EmptyCustom from './EmptyCustom'
import TextCustomisation from './TextCustomisation'

const Customisation = () => {
  const meme = useMeme()
  const { texts, updateText, addText, removeItem } = useTexts()
  const { itemIdSelected, toggleItemIdSelected } = useItemIdSelected()

  if (!meme) {
    return <EmptyCustom />
  }

  const handleAddTextbox = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    addText()
  }

  const handleRemoveItem = (itemId: string) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      removeItem(itemId)
    }
  }

  return (
    <Styled.Scrollable>
      <Styled.BlockTitle>
        <Styled.Legend>Customization</Styled.Legend>
        <Styled.MemeName>{meme.translations.en.name}</Styled.MemeName>
      </Styled.BlockTitle>
      <Styled.TextBlocks>
        {texts.map((textbox, index) => {
          return (
            <Accordion
              onToggle={toggleItemIdSelected}
              title={preventEmptyTextValue(textbox.value, index)}
              id={textbox.id}
              isOpened={itemIdSelected === textbox.id}
              key={textbox.id}
              action={
                <Tooltip text="Supprimer" position="top">
                  <Styled.ActionButton
                    aria-label="Supprimer"
                    onClick={handleRemoveItem(textbox.id)}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </Styled.ActionButton>
                </Tooltip>
              }
            >
              <TextCustomisation
                onUpdateText={updateText}
                text={textbox}
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
