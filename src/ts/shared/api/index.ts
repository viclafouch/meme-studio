import Meme from '@shared/models/Meme'
import { fetchApi } from '@utils/index'

export const API_URL = 'https://meme-studio.herokuapp.com'

/**
 * getMemes
 * @params object - fetch params
 * @return Promise<GetMemesInt> - Pagination of memes
 */

export interface GetMemesInt {
  memes: Array<Meme>
  cursor: {
    before: string | null
    after: string | null
  }
}

export const getMemes = (params: object): Promise<GetMemesInt> =>
  fetchApi('/memes', params).then((response: any) => ({
    memes: response.items.map((item: object) => new Meme(item)),
    cursor: response.cursor
  }))
