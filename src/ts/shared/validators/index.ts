import TextBox from '../models/TextBox'

export interface CanvasProperties {
  texts: Array<TextBox>
  height: number
  width: number
  image: Promise<HTMLImageElement>
  scale: number
}
