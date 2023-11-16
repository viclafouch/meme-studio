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
): TextBox['base'] {
  const { width, height, centerX, centerY } = textbox
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
    height: calculByAspectRatio(textbox.base.height),
    width: calculByAspectRatio(textbox.base.width),
    centerY: calculByAspectRatio(textbox.base.centerY),
    centerX: calculByAspectRatio(textbox.base.centerX)
  }
}
