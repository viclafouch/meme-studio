import { isSafari } from '@client/utils/index'

export default class Meme {
  public id: string
  public filename: string
  public width: number
  public height: number
  public boxCount: number
  public localImageUrl: string
  public translations: Array<{
    lang: string
    keywords: string
    id: number
    name: string
  }>

  constructor(meme: Record<string, any>) {
    this.id = meme.id
    this.filename = meme.filename
    this.width = meme.width
    this.height = meme.height
    this.boxCount = meme.boxCount
    this.localImageUrl = meme.localImageUrl || null
    this.translations = meme.translations || []
  }

  name(lang: string): string {
    const currentTranslation = this.translations.find(t => t.lang === lang)
    if (currentTranslation) return currentTranslation.name
    return this.filename || ''
  }

  keywords(lang: string): string {
    const currentTranslation = this.translations.find(t => t.lang === lang)
    if (currentTranslation) return currentTranslation.keywords
    return ''
  }

  public url(format: '.jpg' | '.webp' = isSafari ? '.jpg' : '.webp'): string {
    return this.localImageUrl || `/templates/${this.filename}`.replace('.jpg', format)
  }

  get image(): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const image = new Image()
      image.src = this.url()
      image.onload = (): void => resolve(image)
    })
  }
}
