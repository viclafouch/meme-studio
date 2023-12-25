import wretch from 'wretch'
import QueryStringAddon from 'wretch/addons/queryString'
import { z } from 'zod'
import {
  Meme,
  memeSchema,
  memeWithMetadataSchema,
  MemeWithMetatada
} from '@viclafouch/meme-studio-utilities/schemas'
import { Locales } from '@viclafouch/meme-studio-utilities/shared/constants/locales'

const request = wretch('http://localhost:3000/api')
  .options({
    // see https://nextjs.org/docs/app/api-reference/functions/fetch
    cache: 'no-store'
  })
  .addon(QueryStringAddon)

export async function getMemes({ locale }: { locale: Locales }) {
  return request
    .url('/memes')
    .query({ locale })
    .get()
    .json<MemeWithMetatada[]>(z.array(memeWithMetadataSchema).parse)
}

export async function getMeme(
  memeId: Meme['id'],
  { locale }: { locale: Locales }
) {
  return request
    .url(`/memes/${memeId}`)
    .query({ locale })
    .get()
    .json<Meme>(memeSchema.parse)
}

export async function getMemeWithMetadata(
  memeId: Meme['id'],
  { locale }: { locale: Locales }
) {
  return request
    .url(`/memes/metadata/${memeId}`)
    .query({ locale })
    .get()
    .json<MemeWithMetatada>(memeWithMetadataSchema.parse)
}
