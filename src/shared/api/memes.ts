import wretch from 'wretch'
import QueryStringAddon from 'wretch/addons/queryString'
import { z } from 'zod'
import { Locale } from '@i18n/config'
import {
  LightMeme,
  lightMemeSchema,
  Meme,
  memeSchema
} from '@viclafouch/meme-studio-utilities/schemas'

const request = wretch('http://localhost:3000/api')
  .options({
    // see https://nextjs.org/docs/app/api-reference/functions/fetch
    cache: 'no-store'
  })
  .addon(QueryStringAddon)

export async function getMemes({ locale }: { locale: Locale }) {
  return request
    .url('/memes')
    .query({ locale })
    .get()
    .json<LightMeme[]>(z.array(lightMemeSchema).parse)
}

export async function getMeme(
  memeId: Meme['id'],
  { locale }: { locale: Locale }
) {
  return request
    .url(`/memes/${memeId}`)
    .query({ locale })
    .get()
    .json<Meme>(memeSchema.parse)
}
