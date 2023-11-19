import { Meme } from '@models/Meme'
import { textboxSchema } from '@shared/schemas/textbox'
import data from './meme.json'

export async function getMemes() {
  return Promise.resolve(data.memes)
}

export function getMeme(memeId: Meme['id']) {
  const meme = data.memes.find(({ id }) => {
    return id === memeId
  })

  return {
    meme: meme ? meme : null,
    textboxes: meme
      ? meme.texts.map((text) => {
          return textboxSchema.parse({
            ...text,
            properties: text
          })
        })
      : []
  }
}
