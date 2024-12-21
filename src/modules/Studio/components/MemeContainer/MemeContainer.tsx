'use client'

import React from 'react'
import { Box, Center } from '@styled-system/jsx'
import { particulesBg } from '@styled-system/patterns'
import { useMeme } from '@viclafouch/meme-studio-utilities/hooks'
import type { Meme } from '@viclafouch/meme-studio-utilities/schemas'
import EmptyContainer from '../EmptyContainer'

export type MemeContainerProps = {
  memesPromise: Promise<Meme[]>
  children: React.ReactNode
}

const MemeContainer = ({ children, memesPromise }: MemeContainerProps) => {
  const meme = useMeme()

  return (
    <Center
      minH="full"
      w="full"
      md={{
        p: '3.125rem 6.25rem'
      }}
      bgColor="secondary"
      position="relative"
      className={!meme ? particulesBg() : ''}
    >
      {meme ? (
        <Box
          w="full"
          h="full"
          position="absolute"
          inset="-0.25rem"
          filter="opacity(0.4) brightness(88%) blur(0.25rem)"
          bgAttachment="fixed"
          bgSize="cover"
          bgRepeat="no-repeat"
          bgPosition="center"
          style={{ backgroundImage: `url(${meme.imageUrl}` }}
        />
      ) : null}
      {!meme ? <EmptyContainer memesPromise={memesPromise} /> : children}
    </Center>
  )
}

export default MemeContainer
