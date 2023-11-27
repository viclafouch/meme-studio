import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getMemes } from '@shared/api/memes'
import { css } from '@styled-system/css'
import { flex } from '@styled-system/patterns'

export type MemeListProps = {
  limit?: number
}

const MemeList = async ({ limit = 3 }) => {
  const memes = await getMemes()

  const memesSliced = memes.slice(0, limit)

  return (
    <ul className={flex({ align: 'start', justify: 'center' })}>
      {memesSliced.map((meme) => {
        return (
          <li key={meme.id} className={css({ maxW: '200px', px: '3' })}>
            <article>
              <Link href={`/create/${meme.id}`}>
                <Image
                  alt={meme.translations.en.name}
                  className={css({
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'white'
                  })}
                  width={meme.width / 2}
                  height={meme.height / 2}
                  src={`https://www.meme-studio.io/templates/${meme.filename}`}
                />
              </Link>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

export default MemeList
