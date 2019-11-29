import * as React from 'react'
import ReactSVG from 'react-svg'
import { memo } from 'react'
import { SketchPicker, ColorResult } from 'react-color'
import Meme from '@shared/models/Meme'
import './customization.scss'
import { CanvasProperties } from '@shared/validators'
import Accordion from '@components/Accordion/Accordion'
import TextareaExtended from '@components/TextareaExpended/TextareaExtended'

type CustomizationProps = {
  memeSelected: Meme | null
  canvasProperties: CanvasProperties
  onCustomize: Function
}

function Customization({ memeSelected, canvasProperties, onCustomize }: CustomizationProps): JSX.Element {
  const handleChangeText = (textId: string, event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const textsUpdated = [...canvasProperties.texts]
    const textIndex = textsUpdated.findIndex(t => t.id === textId)
    textsUpdated[textIndex].value = event.target.value
    onCustomize(textsUpdated)
  }

  const handleChangeColor = (textId: string, color: ColorResult): void => {
    const textsUpdated = [...canvasProperties.texts]
    const textIndex = textsUpdated.findIndex(t => t.id === textId)
    textsUpdated[textIndex].color = color.hex
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
            ({ value, id, color }, i): React.ReactNode => (
              <Accordion title={value.trim() || `Text #${i + 1}`} key={id}>
                <div className="customization-textbox-section">
                  <TextareaExtended rows={1} defaultValue={value} onChange={(e): void => handleChangeText(id, e)} />
                  <SketchPicker color={color} onChangeComplete={(color): void => handleChangeColor(id, color)} />
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
