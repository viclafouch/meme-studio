import TextBox from '../models/TextBox'
import ImageBox from '../models/ImageBox'
import { EditorState } from '@client/store/EditorContext'

export interface DrawProperties {
  height: number
  width: number
  image: Promise<HTMLImageElement>
  scale: number
}

export interface TextCustomization {
  value: any
  textId: string
  type: typeString
}

export interface ImageCustomization {
  value: any
  imageId: string
  type: typeString
}

export interface Line {
  x: number
  y: number
  value: string
  lineHeight: () => number
  lineWidth: () => number
}

export interface HistoryInt {
  drawProperties: DrawProperties
  itemIdSelected: TextBox['id']
  texts: Array<TextBox>
  images: Array<ImageBox>
  type: string
}

export type typeString =
  | 'initial'
  | 'resize'
  | 'move'
  | 'rotate'
  | 'fontFamily'
  | 'fontSize'
  | 'color'
  | 'value'
  | 'textAlign'
  | 'isUppercase'
  | 'alignVertical'
  | 'boxShadow'
  | 'keepRatio'

export interface RecoverVersionInt {
  memeSelected: EditorState['memeSelected']
  history: EditorState['history']
  lastEditDate: Date
}
