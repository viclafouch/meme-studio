/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { useTranslations } from 'next-intl'
import { css } from '@styled-system/css'
import { Box } from '@styled-system/jsx'
import {
  ALIGN_VERTICAL,
  FONTS_FAMILY,
  TEXT_ALIGN
} from '@viclafouch/meme-studio-utilities/constants'
import { useGlobalInputsRef } from '@viclafouch/meme-studio-utilities/hooks'
import { TextBox } from '@viclafouch/meme-studio-utilities/schemas'
import { preventEmptyTextValue } from '@viclafouch/meme-studio-utilities/utils'
import { Fieldset } from './TextCustomisation.styles'

export type TextCustomisationProps = {
  textbox: TextBox
  index: number
  onUpdateTextProperties: (
    textId: TextBox['id'],
    values: Partial<TextBox['properties']>
  ) => void
}

const TextCustomisation = ({
  textbox,
  index,
  onUpdateTextProperties
}: TextCustomisationProps) => {
  const t = useTranslations()

  const { setRef } = useGlobalInputsRef()

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

  const verticalAligns = {
    top: t('common.top'),
    middle: t('common.center'),
    bottom: t('common.bottom')
  } as const satisfies { [key in (typeof ALIGN_VERTICAL)[number]]: string }

  const horizontalAligns = {
    left: t('common.left'),
    center: t('common.center'),
    right: t('common.right')
  } as const satisfies { [key in (typeof TEXT_ALIGN)[number]]: string }

  return (
    <Box>
      <Box p="0.8125rem 0.875rem 1.4375rem 0.875rem">
        <Fieldset>
          <textarea
            className={css({
              w: 'full',
              fontFamily: 'Arial',
              resize: 'none',
              borderRadius: 'xs',
              padding: '2',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'ButtonHighlight'
            })}
            spellCheck="false"
            onChange={handleEditText('value')}
            value={properties.value}
            rows={5}
            ref={setRef(textbox.id)}
            placeholder={preventEmptyTextValue(
              properties.value,
              index,
              `${t('common.text')} #`
            )}
          />
        </Fieldset>
        <Fieldset>
          <label htmlFor="font-size">{t('common.fontSize')}</label>
          <input
            type="range"
            id="font-size"
            min="1"
            max="100"
            step="1"
            value={properties.fontSize}
            onChange={handleEditText('fontSize')}
          />
        </Fieldset>
        <Fieldset>
          <label htmlFor="box-shadow">{t('common.boxShadow')}</label>
          <input
            type="range"
            id="box-shadow"
            min="1"
            max="100"
            step="1"
            value={properties.boxShadow}
            onChange={handleEditText('boxShadow')}
          />
        </Fieldset>
        <Fieldset>
          <label htmlFor="box-shadow">{t('common.color')}</label>
          <input
            type="color"
            id="color"
            value={properties.color}
            onChange={handleEditText('color')}
          />
        </Fieldset>
        <Fieldset>
          <label htmlFor="fontFamily">{t('common.fontFamily')}</label>
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
        </Fieldset>
        <Fieldset>
          <label htmlFor="alignVertical">{t('common.verticalAlign')}</label>
          <select
            id="alignVertical"
            value={properties.alignVertical}
            onChange={handleEditText('alignVertical')}
          >
            {ALIGN_VERTICAL.map((alignVertical) => {
              return (
                <option key={alignVertical} value={alignVertical}>
                  {verticalAligns[alignVertical]}
                </option>
              )
            })}
          </select>
        </Fieldset>
        <Fieldset>
          <label htmlFor="textAlign">{t('common.horizontalAlignment')}</label>
          <select
            id="textAlign"
            value={properties.textAlign}
            onChange={handleEditText('textAlign')}
          >
            {TEXT_ALIGN.map((textAlign) => {
              return (
                <option key={textAlign} value={textAlign}>
                  {horizontalAligns[textAlign]}
                </option>
              )
            })}
          </select>
        </Fieldset>
        <Fieldset>
          <label htmlFor="isUppercase">{t('common.textInUppercase')}</label>
          <input
            type="checkbox"
            onChange={handleEditText('isUppercase')}
            checked={properties.isUppercase}
            id="isUppercase"
          />
        </Fieldset>
      </Box>
    </Box>
  )
}

export default React.memo(TextCustomisation)
