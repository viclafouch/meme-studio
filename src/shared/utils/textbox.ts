import { Meme } from '@models/Meme'
import { TextBox } from '@shared/schemas/textbox'
import { Dimensions } from '@stores/Editor/editor.types'

export function preventEmptyTextValue(value: string, index: number) {
  return value || `Texte #${index + 1}`
}

export function calculBaseByMemeSize(
  textbox: TextBox,
  canvasDimensions: Dimensions,
  meme: Meme
): TextBox['properties']['base'] {
  const { width, height, centerX, centerY } = textbox.properties
  const { width: canvasWidth, height: canvasHeight } = canvasDimensions
  const { width: memeWidth, height: memeHeight } = meme

  return {
    centerX: (centerX / canvasWidth) * memeWidth,
    centerY: (centerY / canvasHeight) * memeHeight,
    width: (width / canvasWidth) * memeWidth,
    height: (height / canvasHeight) * memeHeight
  }
}

export function calculScaledValues(
  textbox: TextBox,
  calculByAspectRatio: (value: number) => number
) {
  return {
    height: calculByAspectRatio(textbox.properties.base.height),
    width: calculByAspectRatio(textbox.properties.base.width),
    centerY: calculByAspectRatio(textbox.properties.base.centerY),
    centerX: calculByAspectRatio(textbox.properties.base.centerX)
  }
}
