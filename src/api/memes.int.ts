// ./memes.json
export interface TextBoxIJson {
  height: number
  width: number
  fontSize: number
  fontFamily: string
  boxShadow: number
  color: string
  centerY: number
  centerX: number
  textAlign: 'left' | 'center' | 'right'
  alignVertical: 'top' | 'middle' | 'bottom'
  isUppercase?: boolean
}

export interface MemeIJson {
  name: string
  width: number
  height: number
  boxCount: number
  src: string
  texts: Array<TextBoxIJson>
}
