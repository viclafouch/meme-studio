export default class Meme {
  public id: string
  public name: string
  public url: string
  public width: number
  public height: number
  public boxCount: number

  constructor(meme: any) {
    this.id = meme.id
    this.name = meme.name
    this.url = meme.url
    this.width = meme.width
    this.height = meme.height
    this.boxCount = meme.boxCount || meme.box_count
  }

  get image(): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const image = new Image()
      image.src = this.url
      image.onload = (): void => resolve(image)
    })
  }
}
