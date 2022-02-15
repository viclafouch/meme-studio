import data from './meme.json'

export async function getMemes(): Promise<Meme[]> {
  return Promise.resolve(data.memes.slice(0, 10))
}
