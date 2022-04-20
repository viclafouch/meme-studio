import { Meme } from '@models/Meme'
import * as R from 'ramda'

import data from './meme.json'

export async function getMemes() {
  return Promise.resolve(
    R.slice(
      0,
      10,
      R.map((memeData) => {
        return memeData
      }, data.memes)
    )
  )
}

export async function getMeme(memeId: Meme['id']) {
  const dataMeme = data.memes.find((meme) => {
    return meme.id === memeId
  })
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return dataMeme
}
