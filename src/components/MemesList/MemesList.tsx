import React from 'react'
import Image from 'next/image'
import { useCloseModal } from '@stores/Modal/Modal.provider'
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
  const closeModal = useCloseModal()

  return (
    <styled.ul className={className}>
      {memes.map((meme) => {
        return (
          <li key={meme.id}>
            <Styled.MemeLink
              disableHoverShowTitle={disableHoverShowTitle}
              href={`/create/${getMemeSlug(meme)}`}
              onClick={() => {
                return closeModal()
              }}
            >
              <Image
                alt={meme.name}
                width={meme.width}
                height={meme.height}
                loading="lazy"
                unoptimized
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
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
