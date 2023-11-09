/* eslint-disable @typescript-eslint/no-explicit-any */
export class Meme {
  public id: string

  public filename: string

  public width: number

  public height: number

  public centerX: number

  public centerY: number

  public rotate: number

  public boxCount: number

  public localImageUrl: string

  translations: {
    en: {
      name: string
    }
  }

  texts: any

  constructor(meme: Record<string, any>) {
    this.id = meme.id
    this.filename = meme.filename
    this.width = meme.width
    this.translations = meme.translations
    this.height = meme.height
    this.centerX = meme.centerX
    this.rotate = meme.rotate
    this.centerY = meme.centerY
    this.boxCount = meme.boxCount
    this.localImageUrl = meme.localImageUrl || null
  }

  public url(format = '.webp'): string {
    return (
      this.localImageUrl ||
      `/templates/${this.filename}`.replace('.jpg', format)
    )
  }

  get image(): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const image = new Image()
      // eslint-disable-next-line id-denylist
      image.src = this.url()

      image.onload = (): void => {
        return resolve(image)
      }
    })
  }
}
