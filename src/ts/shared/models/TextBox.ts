export default class TextBox {
  public id: string
  public value: string
  public width: number
  public height: number
  public centerX: number
  public centerY: number
  public transform: string
  public fontSize: number
  public fontFamily: string
  public color: string
  public alignVertical: string
  public textAlign: string
  public isUppercase: boolean

  constructor(text: any) {
    this.id = text.id
    this.value = text.value
    this.width = text.width
    this.height = text.height
    this.centerX = text.centerX
    this.centerY = text.centerY
    this.transform = text.transform
    this.fontSize = text.fontSize
    this.fontFamily = text.fontFamily
    this.color = text.color
    this.alignVertical = text.alignVertical
    this.textAlign = text.textAlign
    this.isUppercase = text.isUppercase
  }
}
