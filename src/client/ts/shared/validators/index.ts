import TextBox from '@client/shared/models/TextBox'
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

export interface Line {
  x: number
  y: number
  value: string
  lineHeight: Function
  lineWidth: Function
}

export interface HistoryInt {
  drawProperties: DrawProperties
  texts: Array<TextBox>
  type: string
}

export interface UseEditorInt extends EditorState {
  canUndo: boolean
  canRedo: boolean
  saveToEditor: Function
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
