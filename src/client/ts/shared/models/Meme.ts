export default class Meme {
  public id: string
  public name: string
  public filename: string
  public width: number
  public height: number
  public boxCount: number
  public localImageUrl: string

  constructor(meme: any) {
    this.id = meme.id
    this.name = meme.name
    this.filename = meme.filename
    this.width = meme.width
    this.height = meme.height
    this.boxCount = meme.boxCount
    this.localImageUrl = meme.localImageUrl || null
  }

  public url(): string {
    return this.localImageUrl || `/templates/${this.filename}`
  }

  get image(): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const image = new Image()
      image.src = this.url()
      image.onload = (): void => resolve(image)
    })
  }
}
