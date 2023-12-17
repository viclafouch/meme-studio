import { getMemes } from '@shared/api/memes'
import { getMemeSlug } from '@viclafouch/meme-studio-utilities/utils'

export default async function sitemap() {
  const memes = await getMemes()

  return memes.map((meme) => {
    const url = new URL(
      process.env.NODE_ENV === 'production'
        ? 'https://www.meme-studio.io'
        : 'http://localhost:8080'
    )

    url.pathname = `/create/${getMemeSlug(meme)}`

    return {
      url: url.toString(),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7
    }
  })
}
