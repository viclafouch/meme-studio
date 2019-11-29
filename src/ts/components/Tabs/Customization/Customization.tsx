import * as React from 'react'
import ReactSVG from 'react-svg'
import { memo } from 'react'
import Meme from '@shared/models/Meme'
import './customization.scss'
import { CanvasProperties } from '@shared/validators'

type CustomizationProps = {
  memeSelected: Meme | null
  canvasProperties: CanvasProperties
  onCustomize: Function
}

function Customization({ memeSelected, canvasProperties, onCustomize }: CustomizationProps): JSX.Element {
  const handleChangeText = (textId: string, event: React.ChangeEvent<HTMLInputElement>): void => {
    const textsUpdated = [...canvasProperties.texts]
    const textIndex = textsUpdated.findIndex(t => t.id === textId)
    textsUpdated[textIndex].value = event.target.value
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
            ({ value, id }): React.ReactNode => (
              <input value={value} type="text" key={id} onChange={(e): void => handleChangeText(id, e)} />
            )
          )}
        </div>
      )}
    </div>
  )
}

export default memo(Customization)
