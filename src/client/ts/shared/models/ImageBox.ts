export default class ImageBox {
  readonly id: string
  public version: string
  public src: string
  public name: string
  public width: number
  public height: number
  public centerX: number
  public centerY: number
  public rotate: number
  public keepRatio: boolean
  public base: {
    width: number
    height: number
    centerX: number
    centerY: number
  }

  constructor(image: Record<string, any>) {
    this.id = image.id
    this.version = image.version || `${Date.now()}-${this.id}`
    this.src = image.src
    this.name = image.name
    this.width = image.width
    this.height = image.height
    this.centerX = image.centerX
    this.centerY = image.centerY
    this.rotate = image.rotate
    this.keepRatio = image.keepRatio
    this.base = image.base || {
      width: this.width,
      height: this.height,
      centerX: this.centerX,
      centerY: this.centerY
    }
  }
}
