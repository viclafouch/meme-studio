'use client'

import React from 'react'
import MemesList from '@components/MemesList'
import { styled, VStack } from '@styled-system/jsx'
import type { Meme } from '@viclafouch/meme-studio-utilities/schemas'

export type GalleryProps = {
  memesPromise: Promise<Meme[]>
}

const Gallery = ({ memesPromise }: GalleryProps) => {
  const memes = React.use(memesPromise)

  return (
    <VStack gap="0" h="full">
      <styled.div overflowY="auto" w="full">
        <MemesList disableHoverShowTitle memes={memes} />
      </styled.div>
    </VStack>
  )
}

export default Gallery
