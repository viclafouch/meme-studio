import * as React from 'react'
import { ReactSVG } from 'react-svg'
import { useRef } from 'react'
import './customization.scss'
import { CanvasProperties, TextCustomization } from '@shared/validators'
import Accordion from '@components/Accordion/Accordion'
import TextareaExtended from '@components/TextareaExpended/TextareaExtended'
import ColorPicker from '@components/ColorPicker/ColorPicker'
import { ColorResult } from 'react-color'
import InputRangeSlider from '@components/InputRangeSlider/InputRangeSlider'
import TextBox from '@shared/models/TextBox'
import { randomID } from '@utils/index'

type CustomizationProps = {
  canvasProperties: CanvasProperties
  onCustomize: Function
}

function Customization({ canvasProperties, onCustomize }: CustomizationProps): JSX.Element {
  const colorPicker = useRef(null)
  const refs = useRef(
    Array.from({ length: canvasProperties.texts.length }).map(() => ({
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

  const handleCustom = (customization: TextCustomization): void => {
    const textsUpdated = [...canvasProperties.texts] as any
    const textIndex = textsUpdated.findIndex((t: TextBox) => t.id === customization.textId)
    textsUpdated[textIndex][customization.type] = customization.value
    onCustomize(textsUpdated)
  }

  const addText = (): void => {
    const textsUpdated = [...canvasProperties.texts] as any
    const text = {
      transform: '',
      centerY: 50,
      centerX: 340,
      height: 100,
      width: 680,
      base: {
        centerY: 50,
        centerX: 340,
        height: 100,
        width: 680
      },
      fontSize: 22,
      fontFamily: 'impact',
      textAlign: 'center',
      alignVertical: 'middle',
      value: '',
      id: randomID(),
      color: '#ffffff',
      isUppercase: false
    }
    text.height = text.base.height * canvasProperties.scale
    text.width = text.base.width * canvasProperties.scale
    text.centerY = canvasProperties.height / 2
    text.centerX = canvasProperties.width / 2
    textsUpdated.push(text)
    onCustomize(textsUpdated)
    updateAccordionRefs(textsUpdated.length)
    setTimeout(async () => {
      await (refs.current[textsUpdated.length - 1].accordion.current as any).open()
      ;(refs.current[textsUpdated.length - 1].textarea.current as any).focus()
    }, 0)
  }

  const removeText = (textId: string): void => {
    const textsUpdated = [...canvasProperties.texts] as any
    const textIndex = textsUpdated.findIndex((t: TextBox) => t.id === textId)
    textsUpdated.splice(textIndex, 1)
    onCustomize(textsUpdated)
    updateAccordionRefs(textsUpdated.length)
    console.log(refs)
  }

  return (
    <div className="customization-not-empty">
      <h2>Edit {canvasProperties.name}</h2>
      {canvasProperties.texts.map(
        ({ value, id, color, fontSize, alignVertical, textAlign, isUppercase }, i): React.ReactNode => (
          <Accordion
            ref={refs.current[i].accordion}
            title={value.trim() || `Text #${i + 1}`}
            key={id}
            removeText={(): void => removeText(id)}
          >
            <div className="customization-textbox-section">
              <div className="field-customization">
                <TextareaExtended
                  rows={1}
                  ref={refs.current[i].textarea}
                  placeholder={`Text #${i + 1}`}
                  defaultValue={value}
                  onChange={(value: any): void =>
                    handleCustom({
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
                    handleCustom({
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
                    handleCustom({
                      textId: id,
                      type: 'color',
                      value: hex
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <span>Align vertical</span>
                <select
                  value={alignVertical}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleCustom({
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
                    handleCustom({
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
                    handleCustom({
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
      <button className="add-text" onClick={(): void => addText()}>
        Add Text
      </button>
    </div>
  )
}

export default (props: CustomizationProps): JSX.Element => {
  return (
    <div className="Customization">
      {props.canvasProperties ? (
        <Customization {...props} />
      ) : (
        <div className="customization-empty">
          <ReactSVG src="images/sad.svg" wrapper="span" className="wrapper-sad-svg" />
          <h3>No template selected</h3>
        </div>
      )}
    </div>
  )
}
