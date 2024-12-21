import { z } from 'zod'
import type { Locales } from '@viclafouch/meme-studio-utilities/constants'
import {
  type Meme,
  memeSchema
} from '@viclafouch/meme-studio-utilities/schemas'
import memesEn from './memes-with-text-boxes-en.json'
import memesFr from './memes-with-text-boxes-fr.json'

export function getMemes({ locale }: { locale: Locales }) {
  return Promise.resolve(
    z.array(memeSchema).parse(locale === 'fr' ? memesFr : memesEn)
  )
}

export async function getMeme(
  memeId: Meme['id'],
  { locale }: { locale: Locales }
) {
  const memes = await getMemes({ locale })

  return memes.find((meme) => meme.id === memeId)!
}
