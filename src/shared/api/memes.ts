import wretch from 'wretch'
import { z } from 'zod'
import {
  LightMeme,
  lightMemeSchema,
  Meme,
  memeSchema
} from '@viclafouch/meme-studio-utilities/schemas'

const request = wretch('http://localhost:3000/api').options({
  // see https://nextjs.org/docs/app/api-reference/functions/fetch
  cache: 'no-store'
})

export async function getMemes() {
  return request
    .url('/memes')
    .get()
    .json<LightMeme[]>(z.array(lightMemeSchema).parse)
}

export async function getMeme(memeId: Meme['id']) {
  return request.url(`/memes/${memeId}`).get().json<Meme>(memeSchema.parse)
}
