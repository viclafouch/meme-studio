import type { MetadataRoute } from 'next'
import { getMemes } from '@shared/api/memes'
import { baseURL } from '@shared/constants/env'
import { getMemeSlug } from '@viclafouch/meme-studio-utilities/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const memes = await getMemes({ locale: 'en' })

  return memes
    .flatMap((meme) => {
      return [
        {
          slug: getMemeSlug(meme),
          locale: 'en'
        },
        ...meme.translations.map((translation) => {
          return {
            slug: getMemeSlug({ name: translation.name, id: meme.id }),
            locale: translation.locale
          }
        })
      ]
    })
    .map((params) => {
      const url = new URL(baseURL)

      url.pathname = `/${params.locale}/create/${params.slug}`

      return {
        url: url.toString(),
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7
      }
    })
}
