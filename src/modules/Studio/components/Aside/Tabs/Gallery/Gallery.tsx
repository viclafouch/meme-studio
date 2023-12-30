'use client'

import React from 'react'
import { useLocale } from 'next-intl'
import MemesList from '@components/MemesList'
import { getMemes } from '@shared/api/memes'
import { styled, VStack } from '@styled-system/jsx'
import { Locales } from '@viclafouch/meme-studio-utilities/constants'
import { useSuspenseQuery } from '@tanstack/react-query'

const Gallery = () => {
  const locale = useLocale() as Locales

  const { data: memes } = useSuspenseQuery({
    queryKey: ['memes'],
    queryFn: () => {
      return getMemes({ locale })
    }
  })

  return (
    <VStack gap="0" h="full">
      <styled.div overflowY="auto" w="full">
        <MemesList disableHoverShowTitle memes={memes} />
      </styled.div>
    </VStack>
  )
}

export default Gallery
