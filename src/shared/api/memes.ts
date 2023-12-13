import wretch from 'wretch'
import { Meme } from '@viclafouch/meme-studio-utilities/schemas'

const request = wretch('http://localhost:3000/api')

export async function getMemes() {
  return request.url('/memes').get().json<Meme[]>()
}

export async function getMeme(memeId: Meme['id']) {
  const meme = await request.url(`/memes/${memeId}`).get().json<Meme>()

  return Promise.resolve({
    meme,
    textboxes: []
  })
}
