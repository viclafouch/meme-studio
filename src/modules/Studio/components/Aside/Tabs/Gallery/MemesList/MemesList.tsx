import React from 'react'
import Image from 'next/image'
import { styled } from '@styled-system/jsx'
import { LightMeme } from '@viclafouch/meme-studio-utilities/schemas'
import { getMemeSlug } from '@viclafouch/meme-studio-utilities/utils'
import * as Styled from './MemesList.styles'

export type MemesListProps = {
  memes: LightMeme[]
  className?: string
  disableHoverShowTitle?: boolean
}

const MemesList = ({
  memes,
  className = '',
  disableHoverShowTitle = false
}: MemesListProps) => {
  return (
    <styled.ul className={className}>
      {memes.map((meme) => {
        return (
          <li key={meme.id}>
            <Styled.MemeLink
              disableHoverShowTitle={disableHoverShowTitle}
              href={`/create/${getMemeSlug(meme)}`}
            >
              <Image
                alt={meme.name}
                width={meme.width}
                height={meme.height}
                loading="lazy"
                unoptimized
                style={{ width: '100%', height: 'auto' }}
                src={meme.imageUrl}
              />
              <Styled.MemeTitle>{meme.name}</Styled.MemeTitle>
            </Styled.MemeLink>
          </li>
        )
      })}
    </styled.ul>
  )
}

export default MemesList
