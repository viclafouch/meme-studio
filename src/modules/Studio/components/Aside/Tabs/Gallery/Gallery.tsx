import React from 'react'
import { useQuery } from 'react-query'
import Image from 'next/image'
import Link from 'next/link'
import { getMemes } from '@shared/api/memes'

import Styled from './gallery.styled'

const Gallery = () => {
  const { data } = useQuery('memes', getMemes)

  console.log(data)

  return (
    <Styled.GalleryContainer>
      <Styled.GalleryScrollable>
        <Styled.GalleryList>
          {data?.map((meme) => {
            return (
              <Styled.GalleryListItem key={meme.id}>
                <Link href={`/create/${meme.id}`} passHref shallow>
                  <Styled.ItemLink>
                    <Image
                      alt={meme.translations.en.name}
                      width={meme.width}
                      height={meme.height}
                      loading="lazy"
                      src={`https://www.meme-studio.io/templates/${meme.filename}`}
                    />
                  </Styled.ItemLink>
                </Link>
              </Styled.GalleryListItem>
            )
          })}
        </Styled.GalleryList>
      </Styled.GalleryScrollable>
    </Styled.GalleryContainer>
  )
}

export default Gallery
