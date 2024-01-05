'use client'

import React from 'react'
import { Box, Center } from '@styled-system/jsx'
import { particulesBg } from '@styled-system/patterns'
import { useMeme } from '@viclafouch/meme-studio-utilities/hooks'
import EmptyContainer from '../EmptyContainer'

export type MemeContainerProps = {
  children: React.ReactNode
}

const MemeContainer = ({ children }: MemeContainerProps) => {
  const meme = useMeme()

  return (
    <Center
      minH="full"
      w="full"
      padding={{
        mdDown: '1.125rem 1.25rem',
        md: '3.125rem 6.25rem'
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
      {!meme ? <EmptyContainer /> : children}
    </Center>
  )
}

export default MemeContainer
