import Meme from '@shared/models/Meme'
import { fetchApi, parseSearchParams } from '@utils/index'

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

export const getMemes = (query: object, params: object): Promise<GetMemesInt> =>
  fetchApi(`/memes?${parseSearchParams(query)}`, params).then((response: any) => ({
    memes: response.items.map((item: object) => new Meme(item)),
    cursor: response.cursor
  }))
