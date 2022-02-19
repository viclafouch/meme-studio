import React from 'react'
import { calculateAspectRatioFit } from '@shared/helpers/dom'

import Styled from './canvas.styled'

type CanvasProps = {
  meme: Meme
  dimensions: Dimensions
}

const Canvas = (props: CanvasProps) => {
  const { meme, dimensions } = props

  const { height, width } = React.useMemo(() => {
    return calculateAspectRatioFit(
      meme.width,
      meme.height,
      dimensions.width,
      dimensions.height
    )
  }, [meme, dimensions])

  return (
    <Styled.Container>
      <Styled.WrapperCanvas
        style={{
          height,
          width,
          backgroundImage: `url('https://www.meme-studio.io/templates/${meme.filename}')`
        }}
      >
        <Styled.Canvas width={width} height={height} />
      </Styled.WrapperCanvas>
    </Styled.Container>
  )
}

export default Canvas
