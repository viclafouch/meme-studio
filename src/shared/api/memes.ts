import wretch from 'wretch'
import QueryStringAddon from 'wretch/addons/queryString'
import { z } from 'zod'
import { IS_PROD } from '@shared/constants/env'
import type { Locales } from '@viclafouch/meme-studio-utilities/constants'
import {
  type LightMeme,
  lightMemeSchema,
  type Meme,
  memeSchema
} from '@viclafouch/meme-studio-utilities/schemas'

const request = wretch('https://meme-studio-admin.vercel.app/api')
  .options({
    // See here https://nextjs.org/docs/app/api-reference/functions/fetch
    cache: IS_PROD ? 'force-cache' : 'no-store'
  })
  .addon(QueryStringAddon)

export function getMemes({ locale }: { locale: Locales }) {
  return request
    .url('/memes')
    .query({ locale })
    .get()
    .json<LightMeme[]>(z.array(lightMemeSchema).parse)
}

export function getMeme(memeId: Meme['id'], { locale }: { locale: Locales }) {
  return request
    .url(`/memes/${memeId}`)
    .query({ locale })
    .get()
    .json<Meme>(memeSchema.parse)
}
