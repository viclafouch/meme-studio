import * as React from 'react'
import { ColorResult } from 'react-color'
import { ReactSVG } from 'react-svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef, memo, useMemo, createRef, useLayoutEffect } from 'react'
import { TextCustomization, UseEditorInt } from '@client/ts/shared/validators'
import { Translation, useTranslation } from 'react-i18next'
import Accordion from '@client/components/Accordion/Accordion'
import TextareaExtended from '@client/components/TextareaExpended/TextareaExtended'
import ColorPicker from '@client/components/ColorPicker/ColorPicker'
import InputRangeSlider from '@client/components/InputRangeSlider/InputRangeSlider'
import TextBox from '@client/ts/shared/models/TextBox'
import { createText, fontSizeConfig, boxShadowConfig } from '@client/ts/shared/config-editor'
import { EditorContext, EditorState } from '@client/store/EditorContext'
import { CUSTOM_TEXT, ADD_TEXT, REMOVE_TEXT, SET_TEXT_ID_SELECTED } from '@client/store/reducer/constants'
import { useEditor, useWindowWidth } from '@client/ts/shared/hooks'
import { toHistoryType } from '@client/utils/helpers'
import { wait, randomID } from '@shared/utils'
import { FONTS_FAMILY, ALIGN_VERTICAL, TEXT_ALIGN } from '@shared/config'
import './customization.scss'

function Customization(): JSX.Element {
  const { t } = useTranslation()
  const { isMinLgSize } = useWindowWidth()
  const colorPicker = useRef<any>(null)
  const [{ textIdSelected, texts, drawProperties, memeSelected, saveToEditor }, dispatchEditor]: [
    UseEditorInt,
    Function
  ] = useEditor()

  const textsRef: Array<any> = useMemo(
    () =>
      Array.from({ length: texts.length }).map(() => ({
        textarea: createRef<HTMLTextAreaElement>(),
        accordion: createRef(),
        colorPicker: createRef()
      })),
    [texts.length]
  )

  const handleEdit = ({ textId, type, value }: TextCustomization): void => {
    const text: any = { ...texts.find((t: TextBox) => t.id === textId) }
    if (type in text) text[type] = value
    saveToEditor({ type: CUSTOM_TEXT, text, historyType: toHistoryType(type) })
  }

  const addText = (): void => {
    const text = createText({
      centerY: memeSelected.height / 2,
      centerX: memeSelected.width / 2,
      height: memeSelected.height * (33 / 100),
      width: memeSelected.width * (33 / 100)
    })
    text.height = text.base.height * drawProperties.scale
    text.width = text.base.width * drawProperties.scale
    text.centerY = text.base.centerY * drawProperties.scale
    text.centerX = text.base.centerX * drawProperties.scale
    saveToEditor({ type: ADD_TEXT, text })
  }

  const removeText = (textId: string): void => {
    const text = texts.find(t => t.id === textId)
    saveToEditor({ type: REMOVE_TEXT, text })
  }

  const duplicateText = (textId: string): void => {
    const textDuplicated = texts.find(t => t.id === textId)
    const text = new TextBox({
      ...textDuplicated,
      id: randomID()
    })
    text.base = textDuplicated.base
    saveToEditor({ type: ADD_TEXT, text })
  }

  useLayoutEffect(() => {
    if (textIdSelected) {
      const textIndex = texts.findIndex(text => text.id === textIdSelected)
      for (let index = 0; index < textsRef.length; index++) {
        const accordion: any = textsRef[index].accordion.current
        if (index === textIndex) accordion.open()
        else accordion.close()
      }
    }
  }, [textIdSelected, texts, textsRef])

  return (
    <div className="customization-not-empty">
      <h2>
        {t('studio.customization')} <br /> <span className="meme-name">{memeSelected.name}</span>
      </h2>
      {texts.map(
        (
          { value, id, uuid, color, fontSize, alignVertical, textAlign, isUppercase, fontFamily, boxShadow },
          textIndex
        ): React.ReactNode => (
          <Accordion
            defaultOpened={id === textIdSelected}
            ref={textsRef[textIndex].accordion}
            title={value.trim() || `${t('studio.text')} #${textIndex + 1}`}
            key={uuid}
            duplicateText={(): void => duplicateText(id)}
            removeText={(): void => removeText(id)}
            afterOpening={(): void => {
              const textarea: HTMLTextAreaElement = textsRef[textIndex].textarea.current
              if (isMinLgSize) textarea.focus()
              if (id !== textIdSelected) {
                dispatchEditor({
                  type: SET_TEXT_ID_SELECTED,
                  textIdSelected: id
                })
              }
            }}
          >
            <div className="customization-textbox-section">
              <div className="field-customization">
                <TextareaExtended
                  rows={1}
                  name="value"
                  ref={textsRef[textIndex].textarea}
                  placeholder={`${t('studio.text')} #${textIndex + 1}`}
                  value={value}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'value',
                      value: event.target.value
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="font-size">{t('studio.maxFontSize')}</label>
                <InputRangeSlider
                  id="font-size"
                  max={fontSizeConfig.max}
                  width={98}
                  min={fontSizeConfig.min}
                  step={1}
                  value={fontSize}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'fontSize',
                      value: parseInt(event.target.value)
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="box-shadow">{t('studio.boxShadow')}</label>
                <InputRangeSlider
                  id="box-shadow"
                  max={boxShadowConfig.max}
                  width={98}
                  min={boxShadowConfig.min}
                  step={1}
                  value={boxShadow}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'boxShadow',
                      value: parseInt(event.target.value)
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="color" onClick={(): void => colorPicker.current.open()}>
                  {t('studio.color')}
                </label>
                <ColorPicker
                  ref={textsRef[textIndex].colorPicker}
                  color={color}
                  setColor={({ hex }: ColorResult): void =>
                    handleEdit({
                      textId: id,
                      type: 'color',
                      value: hex
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <span>{t('studio.fontFamily')}</span>
                <select
                  value={fontFamily}
                  name="font-family"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'fontFamily',
                      value: event.target.value
                    })
                  }
                >
                  {FONTS_FAMILY.map((font: string) => (
                    <option value={font} key={font.replace(/ /g, '+')}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-customization">
                <span>{t('studio.alignVertical')}</span>
                <select
                  value={alignVertical}
                  name="align-vertical"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'alignVertical',
                      value: event.target.value
                    })
                  }
                >
                  {ALIGN_VERTICAL.map(value => (
                    <option key={value} value={value}>
                      {t(`studio.${value}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-customization">
                <span>{t('studio.textAlign')}</span>
                <select
                  value={textAlign}
                  name="text-align"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'textAlign',
                      value: event.target.value
                    })
                  }
                >
                  {TEXT_ALIGN.map(value => (
                    <option key={value} value={value}>
                      {t(`studio.${value}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-customization">
                <span>{t('studio.textUppercase')}</span>
                <input
                  type="checkbox"
                  name="uppercase"
                  checked={isUppercase}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'isUppercase',
                      value: event.target.checked
                    })
                  }
                />
              </div>
            </div>
          </Accordion>
        )
      )}
      <button className="add-text-button" onClick={(): void => addText()}>
        <FontAwesomeIcon className="icon-plus" icon={['fas', 'plus']} />
        <span>{t('studio.addText')}</span>
      </button>
    </div>
  )
}

export default memo(
  (props: any): JSX.Element => {
    return (
      <EditorContext.Consumer>
        {([{ memeSelected }]: [EditorState]): JSX.Element => (
          <div className="customization">
            {memeSelected ? (
              <Customization {...props} />
            ) : (
              <div className="customization-empty">
                <ReactSVG src="/images/sad.svg" wrapper="span" className="wrapper-sad-svg" />
                <Translation>{(t): any => <h3>{t('studio.noMemeSelected')}</h3>}</Translation>
              </div>
            )}
          </div>
        )}
      </EditorContext.Consumer>
    )
  }
)
