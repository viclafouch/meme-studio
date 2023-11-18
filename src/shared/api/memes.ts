import { Meme } from '@models/Meme'
import data from './meme.json'

export async function getMemes() {
  return Promise.resolve(data.memes)
}

export function getMeme(memeId: Meme['id']) {
  const dataMeme = data.memes.find((meme) => {
    return meme.id === memeId
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return dataMeme
}
