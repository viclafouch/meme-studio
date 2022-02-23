/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import InputSlider from '@components/InputSlider/InputSlider'

import Styled from './text-customisation.styled'

type TextCustomisationProps = {
  text: MemeText
  index: number
  onUpdateText: (textId: MemeText['id'], text: MemeText) => void
}

function getUpdatedText(text: MemeText, values: Partial<MemeText>): MemeText {
  return {
    ...text,
    ...values
  }
}

const TextCustomisation = (props: TextCustomisationProps) => {
  const { text, index, onUpdateText } = props

  const handleEditText = (key: keyof MemeText) => {
    return (
      event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      const { value } = event.target
      const newText = getUpdatedText(text, {
        [key]: value
      })
      onUpdateText(text.id, newText)
    }
  }

  return (
    <Styled.TextCustomisation>
      <Styled.TextToolsHeader>Hello world</Styled.TextToolsHeader>
      <Styled.TextToolsContainer>
        <Styled.Fieldset>
          <Styled.Textarea
            spellCheck="false"
            onChange={handleEditText('value')}
            value={text.value}
            placeholder={`Text #${index + 1}`}
          />
        </Styled.Fieldset>
        <Styled.Fieldset>
          <label htmlFor="font-size">Font Size</label>
          <InputSlider
            id="font-size"
            min="1"
            max="100"
            step="1"
            value={text.fontSize}
            onChange={handleEditText('fontSize')}
          />
        </Styled.Fieldset>
        <Styled.Fieldset>
          <label htmlFor="box-shadow">Box Shadow</label>
          <InputSlider
            id="box-shadow"
            min="1"
            max="100"
            step="1"
            value={text.boxShadow}
            onChange={handleEditText('boxShadow')}
          />
        </Styled.Fieldset>
        <Styled.Fieldset>
          <label htmlFor="box-shadow">Color</label>
          <input
            type="color"
            id="box-shadow"
            value={text.color}
            onChange={handleEditText('color')}
          />
        </Styled.Fieldset>
      </Styled.TextToolsContainer>
    </Styled.TextCustomisation>
  )
}

export default React.memo(TextCustomisation)
