import Meme from '@client/ts/shared/models/Meme'
import { fetchApi } from '@client/utils/index'
import TextBox from '@client/ts/shared/models/TextBox'

interface ResponseAPI extends Response {
  data: any
  success: boolean
  message?: string
}

export const getMemes = (
  { page, search, lang }: { page: number; search: string; lang: string },
  params?: RequestInit
): Promise<{ memes: Array<Meme>; pages: number }> =>
  fetchApi(`/memes`, {
    method: 'POST',
    body: JSON.stringify({ page, search, lang }),
    ...params
  }).then((response: ResponseAPI) => ({
    memes: response.data.memes.map((meme: Meme) => new Meme(meme)),
    pages: response.data.pages
  }))

export interface ResultMemeShowInt {
  success: boolean
  data: {
    meme: Meme
    texts: Array<TextBox>
  }
}

export const getMeme = (id: string, params?: RequestInit): Promise<{ texts: Array<TextBox>; meme: Meme }> =>
  fetchApi(`/memes/${id}`, { method: 'POST', ...params }).then((response: ResponseAPI) => ({
    texts: response.data.texts.map((text: TextBox) => new TextBox(text)),
    meme: new Meme(response.data.meme)
  }))

export const updateMeme = ({ meme, texts }: { meme: Meme; texts: Array<TextBox> }): Promise<Response> =>
  fetchApi(`/memes/${meme.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      texts
    })
  })

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
  }).then((response: ResponseAPI) => {
    if (!response.success) throw new Error(response.message)
    else return response.data.url
  })
