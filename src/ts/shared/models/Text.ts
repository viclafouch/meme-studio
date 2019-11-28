export default class Text {
  public id: string
  public value: string
  public staticStyles: string
  public color: string

  constructor(text: any) {
    this.id = text.id
    this.value = text.value
    this.staticStyles = text.staticStyles
    this.color = text.color
  }
}
