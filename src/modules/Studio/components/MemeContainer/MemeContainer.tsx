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
      h="full"
      w="full"
      padding="3.125rem 6.25rem"
      bgColor="secondary"
      className={!meme ? particulesBg() : ''}
    >
      {!meme ? (
        <EmptyContainer />
      ) : (
        <>
          <Box
            inset="-0.25rem"
            position="absolute"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgSize="cover"
            filter="opacity(0.4) brightness(88%) blur(0.25rem)"
            style={{
              backgroundImage: `url('https://www.meme-studio.io/templates/${meme.filename}')`
            }}
          />
          {children}
        </>
      )}
    </Center>
  )
}

export default MemeContainer
