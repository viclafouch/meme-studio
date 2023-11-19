/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import InputSlider from '@components/InputSlider/InputSlider'
import {
  ALIGN_VERTICAL,
  FONTS_FAMILY,
  TEXT_ALIGN
} from '@shared/constants/fonts'
import { TextBox } from '@shared/schemas/textbox'
import { preventEmptyTextValue } from '@shared/utils/textbox'
import Styled from './TextCustomisation.styled'

export type TextCustomisationProps = {
  textbox: TextBox
  index: number
  inputRef: React.RefObject<HTMLTextAreaElement> | undefined
  onUpdateTextProperties: (
    textId: TextBox['id'],
    values: Partial<TextBox['properties']>
  ) => void
}

const TextCustomisation = ({
  textbox,
  index,
  inputRef,
  onUpdateTextProperties
}: TextCustomisationProps) => {
  const handleEditText = (key: keyof TextBox['properties']) => {
    return (
      event: React.ChangeEvent<
        HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
      >
    ) => {
      let value = event.target.value as string | boolean

      if (event.target.getAttribute('type') === 'checkbox') {
        value = (event.target as HTMLInputElement).checked
      }

      onUpdateTextProperties(textbox.id, {
        [key]: value
      })
    }
  }

  const { properties } = textbox

  return (
    <Styled.TextCustomisation>
      <Styled.TextToolsContainer>
        <Styled.Fieldset>
          <Styled.Textarea
            spellCheck="false"
            onChange={handleEditText('value')}
            value={properties.value}
            rows={5}
            ref={inputRef}
            placeholder={preventEmptyTextValue(properties.value, index)}
          />
        </Styled.Fieldset>
        <Styled.Fieldset>
          <label htmlFor="font-size">Font Size</label>
          <InputSlider
            id="font-size"
            min="1"
            max="100"
            step="1"
            value={properties.fontSize}
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
            value={properties.boxShadow}
            onChange={handleEditText('boxShadow')}
          />
        </Styled.Fieldset>
        <Styled.Fieldset>
          <label htmlFor="box-shadow">Color</label>
          <input
            type="color"
            id="box-shadow"
            value={properties.color}
            onChange={handleEditText('color')}
          />
        </Styled.Fieldset>
        <Styled.Fieldset>
          <label htmlFor="fontFamily">Police d&apos;écriture</label>
          <select
            id="fontFamily"
            value={properties.fontFamily}
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
            value={properties.alignVertical}
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
            value={properties.textAlign}
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
            checked={properties.isUppercase}
            id="isUppercase"
          />
        </Styled.Fieldset>
      </Styled.TextToolsContainer>
    </Styled.TextCustomisation>
  )
}

export default React.memo(TextCustomisation)
