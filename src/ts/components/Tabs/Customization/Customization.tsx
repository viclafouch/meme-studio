import * as React from 'react'
import ReactSVG from 'react-svg'
import { memo } from 'react'
import Meme from '@shared/models/Meme'
import './customization.scss'
import { CanvasProperties, TextCustomization } from '@shared/validators'
import Accordion from '@components/Accordion/Accordion'
import TextareaExtended from '@components/TextareaExpended/TextareaExtended'
import ColorPicker from '@components/ColorPicker/ColorPicker'
import { ColorResult } from 'react-color'
import InputRangeSlider from '@components/InputRangeSlider/InputRangeSlider'
import TextBox from '@shared/models/TextBox'

type CustomizationProps = {
  memeSelected: Meme | null
  canvasProperties: CanvasProperties
  onCustomize: Function
}

function Customization({ memeSelected, canvasProperties, onCustomize }: CustomizationProps): JSX.Element {
  const handleCustom = (customization: TextCustomization): void => {
    const textsUpdated = [...canvasProperties.texts] as any
    const textIndex = textsUpdated.findIndex((t: TextBox) => t.id === customization.textId)
    textsUpdated[textIndex][customization.type] = customization.value
    onCustomize(textsUpdated)
  }

  return (
    <div className="Customization">
      {!memeSelected && (
        <div className="customization-empty">
          <ReactSVG src="images/sad.svg" wrapper="span" className="wrapper-sad-svg" />
          <h3>No template selected</h3>
        </div>
      )}
      {canvasProperties && (
        <div className="customization-not-empty">
          <h2>Edit {memeSelected.name}</h2>
          {canvasProperties.texts.map(
            ({ value, id, color, fontSize, alignVertical, textAlign }, i): React.ReactNode => (
              <Accordion title={value.trim() || `Text #${i + 1}`} key={id}>
                <div className="customization-textbox-section">
                  <div className="field-customization">
                    <TextareaExtended
                      rows={1}
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
                    <ColorPicker
                      color={color}
                      setColor={(color: ColorResult): void =>
                        handleCustom({
                          textId: id,
                          type: 'color',
                          value: color
                        })
                      }
                    />
                  </div>
                  <div className="field-customization">
                    <InputRangeSlider
                      max={50}
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
                </div>
              </Accordion>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default memo(Customization)
