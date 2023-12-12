import { Meme, textboxSchema } from '@viclafouch/meme-studio-utilities/schemas'
import data from './meme.json'

export async function getMemes() {
  return Promise.resolve(data.memes)
}

export function getMeme(memeId: Meme['id']) {
  const meme = data.memes.find(({ id }) => {
    return id === memeId
  })!

  return Promise.resolve({
    meme,
    textboxes: meme.texts.map((text) => {
      return textboxSchema.parse({
        ...text,
        properties: text
      })
    })
  })
}
