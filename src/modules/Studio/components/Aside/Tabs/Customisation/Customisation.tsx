import React from 'react'
import Button from '@components/Button'
import Tooltip from '@components/Tooltip'
import { Meme } from '@models/Meme'
import { useEvent } from '@shared/hooks/useEvent'
import { TextBox } from '@shared/schemas/textbox'
import { preventEmptyTextValue } from '@shared/utils/textbox'
import { useItemIdSelected } from '@stores/Editor/hooks/useItemIdSelected'
import { useTextboxes } from '@stores/Editor/hooks/useTextboxes'
import Accordion from '@studio/components/Accordion'
import { Box, HStack, styled, VStack } from '@styled-system/jsx'
import { faClone, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Styled from './Customisation.styled'
import TextCustomisation from './TextCustomisation'

export type CustomisationProps = {
  meme: Meme
  textboxes: TextBox[]
  textboxRefs: Record<TextBox['id'], React.RefObject<HTMLTextAreaElement>>
}

const Customisation = ({
  textboxRefs,
  meme,
  textboxes
}: CustomisationProps) => {
  const { updateTextbox, addTextbox, removeItem, duplicateItem } =
    useTextboxes()
  const { itemIdSelected, toggleItemIdSelected } = useItemIdSelected()

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

  const handleAfterOpenAccordion = (item: TextBox) => {
    return () => {
      const inputElement = textboxRefs[item.id]?.current

      if (inputElement) {
        const { length } = inputElement.value
        inputElement.focus()
        // set cursor at the end of value
        inputElement.setSelectionRange(length, length)
      }
    }
  }

  const handleToggleAccordion = (item: TextBox) => {
    return () => {
      toggleItemIdSelected(item.id)
    }
  }

  const handleKeypress = useEvent(() => {
    if (itemIdSelected) {
      const inputElement = textboxRefs[itemIdSelected]?.current

      if (inputElement) {
        inputElement.focus()
      }
    }
  })

  React.useEffect(() => {
    window.addEventListener('keypress', handleKeypress, false)

    return () => {
      window.removeEventListener('keypress', handleKeypress, false)
    }
  }, [handleKeypress])

  return (
    <Box overflowY="auto">
      <Styled.BlockTitle>
        <Styled.Legend>Customization</Styled.Legend>
        <Styled.MemeName>{meme.translations.en.name}</Styled.MemeName>
      </Styled.BlockTitle>
      <VStack gap={0}>
        {textboxes.map((textbox, index) => {
          const inputRef = textboxRefs[textbox.id]

          return (
            <Accordion
              onToggle={handleToggleAccordion(textbox)}
              title={preventEmptyTextValue(textbox.properties.value, index)}
              isOpened={itemIdSelected === textbox.id}
              key={textbox.id}
              onAfterOpen={handleAfterOpenAccordion(textbox)}
              action={
                <HStack gap={3}>
                  <Tooltip text="Dupliquer" position="top">
                    <styled.button
                      aria-label="Dupliquer"
                      onClick={handleDuplicateItem(textbox.id)}
                      type="button"
                      cursor="pointer"
                    >
                      <FontAwesomeIcon icon={faClone} />
                    </styled.button>
                  </Tooltip>
                  <Tooltip text="Supprimer" position="top">
                    <styled.button
                      aria-label="Supprimer"
                      onClick={handleRemoveItem(textbox.id)}
                      type="button"
                      cursor="pointer"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </styled.button>
                  </Tooltip>
                </HStack>
              }
            >
              <TextCustomisation
                onUpdateTextProperties={updateTextbox}
                textbox={textbox}
                index={index}
                inputRef={inputRef}
              />
            </Accordion>
          )
        })}
      </VStack>
      <Button rounded={false} fullWidth onClick={handleAddTextbox}>
        Ajouter un texte
      </Button>
    </Box>
  )
}

export default Customisation
