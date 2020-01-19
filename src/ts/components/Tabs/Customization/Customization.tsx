import * as React from 'react'
import { ColorResult } from 'react-color'
import { ReactSVG } from 'react-svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef, useLayoutEffect, useContext } from 'react'
import { TextCustomization, typeString } from '@shared/validators'
import { Translation, useTranslation } from 'react-i18next'
import Accordion from '@components/Accordion/Accordion'
import TextareaExtended from '@components/TextareaExpended/TextareaExtended'
import ColorPicker from '@components/ColorPicker/ColorPicker'
import InputRangeSlider from '@components/InputRangeSlider/InputRangeSlider'
import TextBox from '@shared/models/TextBox'
import { wait } from '@utils/index'
import { fontsFamily, createText } from '@shared/config-editor'
import { EditorContext, EditorState } from '@store/EditorContext'
import { SET_TEXT_ID_SELECTED } from '@store/reducer/constants'
import { toHistoryType } from '@utils/helpers'
import { ADD_TEXT, REMOVE_TEXT } from '@shared/constants'
import './customization.scss'

type CustomizationProps = {
  onCustomizeTexts: Function
}

function Customization({ onCustomizeTexts }: CustomizationProps): JSX.Element {
  const { t } = useTranslation()
  const colorPicker = useRef<any>(null)
  const [{ textIdSelected, texts, drawProperties, memeSelected }, dispatchEditor]: [EditorState, Function] = useContext(
    EditorContext
  )

  const handleEdit = (customization: TextCustomization): void => {
    const textsUpdated = [...texts] as any
    const textIndex = textsUpdated.findIndex((t: TextBox) => t.id === customization.textId)
    const text = { ...textsUpdated[textIndex] }
    const type = customization.type as typeString
    text[type] = customization.value
    textsUpdated[textIndex] = text
    onCustomizeTexts(textsUpdated, toHistoryType(type))
  }

  const addText = (): void => {
    const textsUpdated = [...texts] as Array<TextBox>
    const text = createText({
      centerY: 50,
      centerX: 340,
      height: 100,
      width: 680
    })
    text.height = text.base.height * drawProperties.scale
    text.width = text.base.width * drawProperties.scale
    text.centerY = drawProperties.height / 2
    text.centerX = drawProperties.width / 2
    textsUpdated.push(text)
    onCustomizeTexts(textsUpdated, ADD_TEXT)
    wait(0).then(() => {
      for (let index = 0; index < textsUpdated.length; index++) {
        const text = textsUpdated[index]
        if (textsUpdated.length - 1 !== index) text.refs.accordion.current.close()
        else text.refs.accordion.current.open()
      }
    })
  }

  useLayoutEffect(() => {
    if (textIdSelected) {
      for (const text of texts) {
        if (text.id === textIdSelected) text.refs.accordion.current.open()
        else text.refs.accordion.current.close()
      }
    }
  }, [textIdSelected, texts])

  const removeText = (textId: string): void => {
    const textsUpdated = [...texts] as any
    const textIndex = textsUpdated.findIndex((t: TextBox) => t.id === textId)
    textsUpdated.splice(textIndex, 1)
    if (textId === textIdSelected)
      dispatchEditor({
        type: SET_TEXT_ID_SELECTED,
        textIdSelected: null
      })
    onCustomizeTexts(textsUpdated, REMOVE_TEXT)
  }

  return (
    <div className="customization-not-empty">
      <h2>{t('studio.editMeme', { name: memeSelected.name })}</h2>
      {texts.map(
        (
          { value, id, uuid, color, fontSize, alignVertical, textAlign, isUppercase, fontFamily, boxShadow, refs },
          i
        ): React.ReactNode => (
          <Accordion
            defaultOpened={id === textIdSelected}
            ref={refs.accordion}
            title={value.trim() || `${t('studio.text')} #${i + 1}`}
            key={uuid}
            removeText={(): void => removeText(id)}
            afterImmediateOpening={(): void =>
              dispatchEditor({
                type: SET_TEXT_ID_SELECTED,
                textIdSelected: id
              })
            }
            afterOpening={(): void => (refs.textarea.current as any).focus()}
          >
            <div className="customization-textbox-section">
              <div className="field-customization">
                <TextareaExtended
                  rows={1}
                  ref={refs.textarea}
                  placeholder={`${t('studio.text')} #${i + 1}`}
                  value={value}
                  onChange={(value: any): void =>
                    handleEdit({
                      textId: id,
                      type: 'value',
                      value
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="font-size">{t('studio.maxFontSize')}</label>
                <InputRangeSlider
                  id="font-size"
                  max={50}
                  width={98}
                  min={0}
                  step={1}
                  value={fontSize}
                  onChange={(value: number): void =>
                    handleEdit({
                      textId: id,
                      type: 'fontSize',
                      value
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="box-shadow">{t('studio.boxShadow')}</label>
                <InputRangeSlider
                  id="box-shadow"
                  max={10}
                  width={98}
                  min={0}
                  step={1}
                  value={boxShadow}
                  onChange={(value: number): void =>
                    handleEdit({
                      textId: id,
                      type: 'boxShadow',
                      value
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="color" onClick={(): void => colorPicker.current.open()}>
                  {t('studio.color')}
                </label>
                <ColorPicker
                  ref={colorPicker}
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
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'fontFamily',
                      value: event.target.value
                    })
                  }
                >
                  {fontsFamily.map((font: string) => (
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
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'alignVertical',
                      value: event.target.value
                    })
                  }
                >
                  <option value="top">{t('studio.top')}</option>
                  <option value="middle">{t('studio.middle')}</option>
                  <option value="bottom">{t('studio.bottom')}</option>
                </select>
              </div>
              <div className="field-customization">
                <span>{t('studio.textAlign')}</span>
                <select
                  value={textAlign}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEdit({
                      textId: id,
                      type: 'textAlign',
                      value: event.target.value
                    })
                  }
                >
                  <option value="left">{t('studio.left')}</option>
                  <option value="center">{t('studio.center')}</option>
                  <option value="right">{t('studio.right')}</option>
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

export default (props: any): JSX.Element => {
  return (
    <EditorContext.Consumer>
      {([{ memeSelected }]: [EditorState]): JSX.Element => (
        <div className="customization">
          {memeSelected ? (
            <Customization {...props} />
          ) : (
            <div className="customization-empty">
              <ReactSVG src="images/sad.svg" wrapper="span" className="wrapper-sad-svg" />
              <Translation>{(t): any => <h3>{t('studio.noMemeSelected')}</h3>}</Translation>
            </div>
          )}
        </div>
      )}
    </EditorContext.Consumer>
  )
}
