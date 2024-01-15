import React from 'react'
import Aside from '@studio/components/Aside'
import Canvas from '@studio/components/Canvas'
import MemeContainer from '@studio/components/MemeContainer'
import Tools from '@studio/components/Tools'
import { Box } from '@styled-system/jsx'

const StudioBody = () => {
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
        <MemeContainer>
          <Canvas />
        </MemeContainer>
      </Box>
      <Box display={{ mdDown: 'none' }}>
        <Aside />
      </Box>
    </Box>
  )
}

export default StudioBody
