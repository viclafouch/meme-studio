export default class TextBox {
  public id: string
  public value: string
  public y: number
  public x: number
  public transform: string
  public fontSize: number
  public fontFamily: string
  public color: string

  constructor(text: any) {
    this.id = text.id
    this.value = text.value
    this.y = text.y
    this.x = text.x
    this.transform = text.transform
    this.fontSize = text.fontSize
    this.fontFamily = text.fontFamily
    this.color = text.color
  }
}
