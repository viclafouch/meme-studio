/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import InputSlider from '@components/InputSlider/InputSlider'
import {
  ALIGN_VERTICAL,
  FONTS_FAMILY,
  TEXT_ALIGN
} from '@shared/constants/fonts'

import Styled from './text-customisation.styled'

type TextCustomisationProps = {
  text: TextBox
  index: number
  onUpdateText: (textId: TextBox['id'], text: TextBox) => void
}

function getUpdatedText(text: TextBox, values: Partial<TextBox>): TextBox {
  return {
    ...text,
    ...values
  }
}

const TextCustomisation = (props: TextCustomisationProps) => {
  const { text, index, onUpdateText } = props

  const handleEditText = (key: keyof TextBox) => {
    return (
      event: React.ChangeEvent<
        HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
      >
    ) => {
      let value = event.target.value as string | boolean
      if ('checked' in event.target) {
        value = event.target.checked
      }
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
        <Styled.Fieldset>
          <label htmlFor="fontFamily">Police d&apos;écriture</label>
          <select
            id="fontFamily"
            value={text.fontFamily}
            onChange={handleEditText('fontFamily')}
          >
            {FONTS_FAMILY.map((fontName) => {
              return (
                <option key={fontName} value={fontName}>
                  {fontName}
                </option>
              )
            })}
          </select>
        </Styled.Fieldset>
        <Styled.Fieldset>
          <label htmlFor="alignVertical">Alignement vertical</label>
          <select
            id="alignVertical"
            value={text.alignVertical}
            onChange={handleEditText('alignVertical')}
          >
            {ALIGN_VERTICAL.map((alignVertical) => {
              return (
                <option key={alignVertical} value={alignVertical}>
                  {alignVertical}
                </option>
              )
            })}
          </select>
        </Styled.Fieldset>
        <Styled.Fieldset>
          <label htmlFor="textAlign">Alignement horizontal</label>
          <select
            id="textAlign"
            value={text.textAlign}
            onChange={handleEditText('textAlign')}
          >
            {TEXT_ALIGN.map((textAlign) => {
              return (
                <option key={textAlign} value={textAlign}>
                  {textAlign}
                </option>
              )
            })}
          </select>
        </Styled.Fieldset>
        <Styled.Fieldset>
          <label htmlFor="isUppercase">Texte en majuscule</label>
          <input
            type="checkbox"
            onChange={handleEditText('isUppercase')}
            checked={text.isUppercase}
            id="isUppercase"
          />
        </Styled.Fieldset>
      </Styled.TextToolsContainer>
    </Styled.TextCustomisation>
  )
}

export default React.memo(TextCustomisation)
