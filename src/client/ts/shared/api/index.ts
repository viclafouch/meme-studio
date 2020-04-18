import Meme from '@client/ts/shared/models/Meme'
import { fetchApi } from '@client/utils/index'
import TextBox from '@client/ts/shared/models/TextBox'

interface ResultMemeIndex {
  success: boolean
  data: {
    memes: Array<object>
    pages: number
  }
}

export const getMemes = (page: number, params?: object): Promise<{ memes: Array<Meme>; pages: number }> =>
  fetchApi(`/memes`, {
    method: 'POST',
    body: JSON.stringify({ page }),
    ...params
  }).then((response: ResultMemeIndex) => ({
    memes: response.data.memes.map((meme: object) => new Meme(meme)),
    pages: response.data.pages
  }))

export interface ResultMemeShowInt {
  success: boolean
  data: {
    meme: object
    texts: Array<object>
  }
}

export const getMeme = (id: string): Promise<{ texts: Array<TextBox>; meme: Meme }> =>
  fetchApi(`/memes/${id}`, { method: 'POST' }).then((response: ResultMemeShowInt) => ({
    texts: response.data.texts.map((text: object) => new TextBox(text)),
    meme: new Meme(response.data.meme)
  }))

export interface ResultPostToTwitter {
  success: boolean
  message?: string
  data?: {
    url: string
  }
}

export const postToTwitter = (img64: string): any =>
  fetchApi(`/share`, {
    method: 'POST',
    body: JSON.stringify({
      image: img64
    })
  }).then((response: ResultPostToTwitter) => {
    if (!response.success) throw new Error(response.message)
    else return response.data.url
  })
