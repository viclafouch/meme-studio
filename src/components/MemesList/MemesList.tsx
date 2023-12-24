import React from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { Locale } from '@i18n/config'
import { Link } from '@i18n/navigation'
import { getMemes } from '@shared/api/memes'
import { css } from '@styled-system/css'
import { flex } from '@styled-system/patterns'
import { getMemeSlug } from '@viclafouch/meme-studio-utilities/utils'

export type MemeListProps = {
  limit?: number
}

const MemeList = async ({ limit = 3 }) => {
  const locale = useLocale() as Locale

  const memes = await getMemes({ locale })

  const memesSliced = memes.slice(0, limit)

  return (
    <ul className={flex({ align: 'start', justify: 'center' })}>
      {memesSliced.map((meme) => {
        return (
          <li key={meme.id} className={css({ maxW: '200px', px: '3' })}>
            <article>
              <Link href={`/create/${getMemeSlug(meme)}`}>
                <Image
                  // TODO: i18n
                  alt={meme.name}
                  className={css({
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'white'
                  })}
                  width={meme.width / 2}
                  height={meme.height / 2}
                  src={meme.imageUrl}
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
