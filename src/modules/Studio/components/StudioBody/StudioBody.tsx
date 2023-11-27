import React from 'react'
import Aside from '@studio/components/Aside'
import Canvas from '@studio/components/Canvas'
import MemeContainer from '@studio/components/MemeContainer'
import Tools from '@studio/components/Tools'
import { Box, Grid } from '@styled-system/jsx'

const StudioBody = () => {
  return (
    <Grid
      width="full"
      overflow="hidden"
      gridTemplateColumns="3.375rem auto 20rem"
      bgColor="secondary"
      gap="0"
      height="calc(calc(100vh - 5rem))"
    >
      <Tools />
      <Box
        width="full"
        height="full"
        position="relative"
        borderRight="0.125rem solid rgb(88, 88, 88)"
      >
        <MemeContainer>
          <Canvas />
        </MemeContainer>
      </Box>
      <Aside />
    </Grid>
  )
}

export default StudioBody
