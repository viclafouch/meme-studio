import { Request } from 'express'
import Meme from '../models/meme.model'
import TextBox from '../models/textbox.model'

export interface ReqMemeIndex extends Request {
  body: {
    page: string
  }
}

export interface ResultMemeIndex {
  memes: Array<Meme>
  pages: number
}

export interface ReqMemeShowInt extends Request {
  params: {
    id: string
  }
}

export interface ResultMemeShowInt {
  meme: Meme
  texts: Array<TextBox>
}

export interface ReqShareToTwitter extends Request {
  body: {
    image: string
  }
}

export interface ResultShareToTwitter {
  url: string
}
