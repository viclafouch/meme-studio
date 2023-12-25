import { getMemeWithMetadata } from '@shared/api/memes'
import { baseURL } from '@shared/constants/env'
import { LightMeme, Meme } from '@viclafouch/meme-studio-utilities/schemas'
import { Locales } from '@viclafouch/meme-studio-utilities/shared/constants/locales'
import { getMemeSlug } from '@viclafouch/meme-studio-utilities/utils'

type Metadata = {
  name: Meme['name']
  keywords: Meme['keywords']
  slug: ReturnType<typeof getMemeSlug>
  url: string
  locale: Locales
}

type MetadataByLocale = {
  meme: LightMeme
  metadata: {
    [Locales.en]: Metadata
  } & {
    [key in Exclude<Locales, Locales.en>]?: Metadata
  }
}

export async function getMemeMetadata(
  id: string,
  locale: Locales
): Promise<MetadataByLocale> {
  const meme = await getMemeWithMetadata(id, { locale })
  const slug = getMemeSlug({ name: meme.name, id: meme.id })

  const urlEn = new URL(baseURL)
  urlEn.pathname = `/en/create/${slug}`

  return meme.translations.reduce(
    (accumulator, translation) => {
      const localeURL = new URL(baseURL)
      const intlSlug = getMemeSlug({ name: translation.name, id: meme.id })
      localeURL.pathname = `/${translation.locale}/create/${intlSlug}`
      accumulator.metadata[translation.locale] = {
        name: translation.name,
        keywords: translation.keywords,
        slug: intlSlug,
        locale: translation.locale,
        url: localeURL.toString()
      }

      return accumulator
    },
    {
      meme,
      metadata: {
        en: {
          name: meme.name,
          keywords: meme.keywords,
          slug,
          locale: Locales.en,
          url: urlEn.toString()
        } satisfies MetadataByLocale['metadata'][Locales.en]
      }
    } as MetadataByLocale
  )
}
