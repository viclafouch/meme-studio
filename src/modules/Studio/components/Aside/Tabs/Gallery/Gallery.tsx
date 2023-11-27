import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getMemes } from '@shared/api/memes'
import { styled, VStack } from '@styled-system/jsx'
import { useSuspenseQuery } from '@tanstack/react-query'

const Gallery = () => {
  const { data: memes } = useSuspenseQuery({
    queryKey: ['memes'],
    queryFn: () => {
      return getMemes()
    }
  })

  return (
    <VStack gap="0" h="full">
      <styled.div overflowY="auto" w="full">
        <styled.ul px="1" w="full" bgColor="gray.300">
          {memes.map((meme) => {
            return (
              <li key={meme.id}>
                <Link href={`/create/${meme.id}`}>
                  <Image
                    alt={meme.translations.en.name}
                    width={meme.width}
                    height={meme.height}
                    loading="lazy"
                    style={{ width: '100%', height: 'auto' }}
                    src={`https://www.meme-studio.io/templates/${meme.filename}`}
                  />
                </Link>
              </li>
            )
          })}
        </styled.ul>
      </styled.div>
    </VStack>
  )
}

export default Gallery
