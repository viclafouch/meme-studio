import fsPromises from 'node:fs/promises'
import { z } from 'zod'
import type { Locales } from '@viclafouch/meme-studio-utilities/constants'
import {
  type Meme,
  memeSchema
} from '@viclafouch/meme-studio-utilities/schemas'

export async function getMemes({ locale }: { locale: Locales }) {
  const memes = await fsPromises.readFile(
    `${process.cwd()}/src/shared/api/memes-with-text-boxes-${locale}.json`,
    'utf8'
  )

  return z.array(memeSchema).parse(JSON.parse(memes))
}

export async function getMeme(
  memeId: Meme['id'],
  { locale }: { locale: Locales }
) {
  const memes = await getMemes({ locale })

  return memes.find((meme) => meme.id === memeId)!
}
