'use client'

import React from 'react'
import * as R from 'remeda'
import { useTextboxes } from '@stores/Editor/hooks/useTextboxes'
import Aside from '@studio/components/Aside'
import Canvas from '@studio/components/Canvas'
import MemeContainer from '@studio/components/MemeContainer'
import Tools from '@studio/components/Tools'
import { Box, Grid } from '@styled-system/jsx'

const StudioBody = () => {
  const { textboxes } = useTextboxes()

  const textboxRefs = React.useMemo(() => {
    return R.mapToObj(textboxes, (textbox) => {
      return [String(textbox.id), React.createRef<HTMLTextAreaElement>()]
    })
  }, [textboxes])

  return (
    <Grid
      width="full"
      overflow="hidden"
      gridTemplateColumns="3.375rem auto 20rem"
      bg="secondary"
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
      <Aside textboxRefs={textboxRefs} />
    </Grid>
  )
}

export default StudioBody
