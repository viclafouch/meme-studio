import React from 'react'
import Button from '@components/Button'
import Tooltip from '@components/Tooltip'
import Accordion from '@studio/components/Accordion'
import { Box, HStack, styled, VStack } from '@styled-system/jsx'
import {
  useEvent,
  useGlobalInputsRef,
  useItemIdSelected,
  useTextboxes
} from '@viclafouch/meme-studio-utilities/hooks'
import { TextBox } from '@viclafouch/meme-studio-utilities/schemas'
import { preventEmptyTextValue } from '@viclafouch/meme-studio-utilities/utils'
import { faClone, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TextCustomisation from './TextCustomisation'

const Customisation = () => {
  const { textboxes, updateTextbox, addTextbox, removeItem, duplicateItem } =
    useTextboxes()
  const { itemIdSelected, toggleItemIdSelected } = useItemIdSelected()
  const { getRef } = useGlobalInputsRef()

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
      const inputElement = getRef(item.id)?.current

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
      const inputElement = getRef(itemIdSelected)?.current

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
      <VStack textAlign="center" p="2" m="2" gap={2}>
        <styled.span display="block">Customization</styled.span>
        <styled.h1
          fontSize="sm"
          lineClamp="1"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          maxW="full"
        >
          test
        </styled.h1>
      </VStack>
      <VStack gap={0}>
        {textboxes.map((textbox, index) => {
          return (
            <Accordion
              onToggle={handleToggleAccordion(textbox)}
              title={preventEmptyTextValue(textbox.properties.value, index)}
              isOpened={itemIdSelected === textbox.id}
              key={textbox.id}
              onAfterOpen={handleAfterOpenAccordion(textbox)}
              action={
                <HStack gap={3} alignItems="center">
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
