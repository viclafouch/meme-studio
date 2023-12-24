import { locales } from '@i18n/config'
import { getMemes } from '@shared/api/memes'
import { getMemeSlug } from '@viclafouch/meme-studio-utilities/utils'

export default async function sitemap() {
  const memes = []

  const baseURL =
    process.env.NODE_ENV === 'production'
      ? 'https://www.meme-studio.io'
      : 'http://localhost:8080'

  for (const locale of locales) {
    // eslint-disable-next-line no-await-in-loop
    const memesByLocale = await getMemes({ locale })

    memes.push(
      ...memesByLocale.map((meme) => {
        const slug = getMemeSlug(meme)
        const url = new URL(baseURL)

        url.pathname = `/${locale}/create/${slug}`

        return {
          url: url.toString(),
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.7
        }
      })
    )
  }

  return memes
}
