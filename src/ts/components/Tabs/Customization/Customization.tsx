import * as React from 'react'
import { ColorResult } from 'react-color'
import { ReactSVG } from 'react-svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef, useLayoutEffect, useContext } from 'react'
import { TextCustomization } from '@shared/validators'
import Accordion from '@components/Accordion/Accordion'
import TextareaExtended from '@components/TextareaExpended/TextareaExtended'
import ColorPicker from '@components/ColorPicker/ColorPicker'
import InputRangeSlider from '@components/InputRangeSlider/InputRangeSlider'
import TextBox from '@shared/models/TextBox'
import { wait } from '@utils/index'
import { fontsFamily, createText } from '@shared/config-editor'
import { EditorContext, EditorState } from '@store/EditorContext'
import { SET_TEXT_ID_SELECTED } from '@store/reducer/constants'
import Meme from '@shared/models/Meme'
import './customization.scss'

type CustomizationProps = {
  onCustomizeTexts: Function
  memeSelected: Meme
}

function Customization({ onCustomizeTexts, memeSelected }: CustomizationProps): JSX.Element {
  const colorPicker = useRef<any>(null)
  const [{ textIdSelected, texts, drawProperties }, dispatchEditor]: [EditorState, Function] = useContext(EditorContext)
  const refs = useRef<Array<any>>(
    Array.from({ length: memeSelected.boxCount }).map(() => ({
      accordion: React.createRef(),
      textarea: React.createRef()
    }))
  )

  const updateAccordionRefs = (value: number): void => {
    refs.current = refs.current.splice(0, value)
    for (let i = 0; i < value; i++) {
      refs.current[i] = {
        accordion: React.createRef(),
        textarea: React.createRef()
      }
    }
  }

  const handleEdit = (customization: TextCustomization): void => {
    const textsUpdated = [...texts] as any
    const textIndex = textsUpdated.findIndex((t: TextBox) => t.id === customization.textId)
    textsUpdated[textIndex][customization.type] = customization.value
    onCustomizeTexts(textsUpdated)
  }

  const addText = (): void => {
    const textsUpdated = [...texts] as any
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
    onCustomizeTexts(textsUpdated)
    updateAccordionRefs(textsUpdated.length)
    wait(0).then(() => {
      for (let index = 0; index < refs.current.length; index++) {
        const ref = refs.current[index]
        if (refs.current.length - 1 !== index) ref.accordion.current.close()
        else ref.accordion.current.open()
      }
    })
  }

  useLayoutEffect(() => {
    if (refs.current.length && textIdSelected) {
      const textIndex = texts.findIndex((text: TextBox) => text.id === textIdSelected)
      for (let index = 0; index < refs.current.length; index++) {
        const ref = refs.current[index]
        if (textIndex !== index) ref.accordion.current.close()
        else ref.accordion.current.open()
      }
    }
  }, [textIdSelected])

  const removeText = (textId: string): void => {
    const textsUpdated = [...texts] as any
    const textIndex = textsUpdated.findIndex((t: TextBox) => t.id === textId)
    textsUpdated.splice(textIndex, 1)
    if (textId === textIdSelected)
      dispatchEditor({
        type: SET_TEXT_ID_SELECTED,
        textIdSelected: null
      })
    onCustomizeTexts(textsUpdated)
    updateAccordionRefs(textsUpdated.length)
  }

  return (
    <div className="customization-not-empty">
      <h2>Edit Name</h2>
      {texts.map(
        ({ value, id, color, fontSize, alignVertical, textAlign, isUppercase, fontFamily }, i): React.ReactNode => (
          <Accordion
            ref={refs.current[i].accordion}
            title={value.trim() || `Text #${i + 1}`}
            key={id}
            removeText={(): void => removeText(id)}
            afterImmediateOpening={(): void =>
              dispatchEditor({
                type: SET_TEXT_ID_SELECTED,
                textIdSelected: id
              })
            }
            afterOpening={(): void => (refs.current[i].textarea.current as any).focus()}
          >
            <div className="customization-textbox-section">
              <div className="field-customization">
                <TextareaExtended
                  rows={1}
                  ref={refs.current[i].textarea}
                  placeholder={`Text #${i + 1}`}
                  defaultValue={value}
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
                <label htmlFor="font-size">Max Font size</label>
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
                <label htmlFor="color" onClick={(): void => colorPicker.current.open()}>
                  Color
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
                <span>Font family</span>
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
                <span>Align vertical</span>
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
                  <option value="top">Top</option>
                  <option value="middle">Middle</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
              <div className="field-customization">
                <span>Text align</span>
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
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className="field-customization">
                <span>Text Uppercase</span>
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
        <span>Add Text</span>
      </button>
    </div>
  )
}

export default (props: any): JSX.Element => {
  return (
    <EditorContext.Consumer>
      {([{ memeSelected }]: [EditorState]): JSX.Element => (
        <div className="Customization">
          {memeSelected ? (
            <Customization {...props} memeSelected={memeSelected} />
          ) : (
            <div className="customization-empty">
              <ReactSVG src="images/sad.svg" wrapper="span" className="wrapper-sad-svg" />
              <h3>No template selected</h3>
            </div>
          )}
        </div>
      )}
    </EditorContext.Consumer>
  )
}
