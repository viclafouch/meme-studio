import data from './meme.json'

export async function getMemes(): Promise<Meme[]> {
  return Promise.resolve(data.memes.slice(0, 10))
}

export async function getMeme(memeId: Meme['id']): Promise<Meme> {
  return Promise.resolve(
    data.memes.find((meme) => {
      return meme.id === memeId
    }) as Meme
  )
}
