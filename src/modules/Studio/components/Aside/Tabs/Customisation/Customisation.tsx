import React from 'react'
import * as R from 'remeda'
import Button from '@components/Button/Button'
import Tooltip from '@components/Tooltip'
import { preventEmptyTextValue } from '@shared/utils/textbox'
import { useItemIdSelected } from '@stores/Editor/hooks/useItemIdSelected'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useTexts } from '@stores/Editor/hooks/useTexts'
import Accordion from '@studio/components/Accordion'
import { faClone, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Styled from './customisation.styled'
import EmptyCustom from './EmptyCustom'
import TextCustomisation from './TextCustomisation'

const Customisation = () => {
  const meme = useMeme()
  const { textboxes, updateTextbox, addTextbox, removeItem, duplicateItem } =
    useTexts()
  const { itemIdSelected, toggleItemIdSelected } = useItemIdSelected()

  const textboxRefs = R.mapToObj(textboxes, (textbox) => {
    return [String(textbox.id), React.createRef<HTMLTextAreaElement>()]
  })

  if (!meme) {
    return <EmptyCustom />
  }

  const handleAddTextbox = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    addTextbox()
  }

  const handleRemoveItem = (itemId: string) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      removeItem(itemId)
    }
  }

  const handleDuplicateItem = (itemId: string) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      duplicateItem(itemId)
    }
  }

  const handleAfterOpenAccordion = (itemId: string) => {
    const length = textboxRefs[itemId]?.current?.value?.length || 0
    textboxRefs[itemId]?.current?.focus()
    // set cursor at the end of value
    textboxRefs[itemId]?.current?.setSelectionRange(length, length)
  }

  return (
    <Styled.Scrollable>
      <Styled.BlockTitle>
        <Styled.Legend>Customization</Styled.Legend>
        <Styled.MemeName>{meme.translations.en.name}</Styled.MemeName>
      </Styled.BlockTitle>
      <Styled.TextBlocks>
        {textboxes.map((textbox, index) => {
          const inputRef = textboxRefs[textbox.id]

          return (
            <Accordion
              onToggle={toggleItemIdSelected}
              title={preventEmptyTextValue(textbox.properties.value, index)}
              id={textbox.id}
              isOpened={itemIdSelected === textbox.id}
              key={textbox.id}
              onAfterOpen={handleAfterOpenAccordion}
              action={
                <>
                  <Tooltip text="Dupliquer" position="top">
                    <Styled.ActionButton
                      aria-label="Dupliquer"
                      onClick={handleDuplicateItem(textbox.id)}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faClone} />
                    </Styled.ActionButton>
                  </Tooltip>
                  <Tooltip text="Supprimer" position="top">
                    <Styled.ActionButton
                      aria-label="Supprimer"
                      onClick={handleRemoveItem(textbox.id)}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Styled.ActionButton>
                  </Tooltip>
                </>
              }
            >
              <TextCustomisation
                onUpdateTextProperties={updateTextbox}
                text={textbox}
                inputRef={inputRef}
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
