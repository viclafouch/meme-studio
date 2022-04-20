/* eslint-disable @typescript-eslint/no-explicit-any */
export class TextBox {
  public isUppercase: boolean

  public id: string

  public value: string

  public width: number

  public height: number

  public centerX: number

  public centerY: number

  public rotate: number

  public fontSize: number

  public fontFamily: string

  public boxShadow: number

  public color: string

  public alignVertical: string

  public textAlign: string

  constructor(data: Record<string, any>) {
    this.textAlign = data.textAlign
    this.color = data.color
    this.centerX = data.centerX
    this.centerY = data.centerY
    this.fontFamily = data.fontFamily
    this.rotate = data.rotate
    this.boxShadow = data.boxShadow
    this.fontSize = data.fontSize
    this.value = data.value
    this.width = data.width
    this.height = data.height
    this.id = data.id
    this.isUppercase = data.isUppercase
    this.alignVertical = data.alignVertical
  }
}
