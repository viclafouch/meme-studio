import React from 'react'
import { getLocale } from 'next-intl/server'
import { getMemes } from '@shared/api/memes'
import Aside from '@studio/components/Aside'
import Canvas from '@studio/components/Canvas'
import MemeContainer from '@studio/components/MemeContainer'
import Tools from '@studio/components/Tools'
import { Box } from '@styled-system/jsx'
import type { Locales } from '@viclafouch/meme-studio-utilities/constants'

const StudioBody = async () => {
  const locale = (await getLocale()) as Locales
  const memesPromise = getMemes({ locale })

  return (
    <Box
      width="full"
      overflow="hidden"
      h="full"
      mdDown={{
        display: 'flex',
        flexDir: 'column'
      }}
      md={{
        display: 'grid',
        gridTemplateColumns: '3.375rem auto 20rem'
      }}
      bgColor="secondary"
    >
      <Tools />
      <Box
        width="full"
        height="full"
        position="relative"
        overflowY="scroll"
        borderRight={{
          md: '0.125rem solid rgb(88, 88, 88)'
        }}
      >
        <MemeContainer memesPromise={memesPromise}>
          <Canvas />
        </MemeContainer>
      </Box>
      <Box display={{ mdDown: 'none' }}>
        <Aside memesPromise={memesPromise} />
      </Box>
    </Box>
  )
}

export default StudioBody
