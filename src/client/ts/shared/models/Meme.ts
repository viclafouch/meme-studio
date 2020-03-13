export default class Meme {
  public id: string
  public uuid: string
  public name: string
  public ext: string
  public width: number
  public height: number
  public boxCount: number

  constructor(meme: any) {
    this.id = meme.id
    this.uuid = meme.uuid
    this.name = meme.name
    this.ext = meme.ext
    this.width = meme.width
    this.height = meme.height
    this.boxCount = meme.boxCount
  }

  public url(): string {
    return `static/templates/${this.uuid}.${this.ext}`
  }

  get image(): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const image = new Image()
      image.src = this.url()
      image.onload = (): void => resolve(image)
    })
  }
}
