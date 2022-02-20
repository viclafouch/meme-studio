import React from 'react'
import { getAspectRatio } from '@shared/helpers/dom'
import * as R from 'ramda'

import Draggable from '../Draggable/Draggable'
import TextBox from '../TextBox/TextBox'
import Styled from './canvas.styled'

type CanvasProps = {
  meme: Meme
  dimensions: Dimensions
}

const Canvas = (props: CanvasProps) => {
  const { meme, dimensions } = props

  const ratio = React.useMemo(() => {
    const aspectRatio = getAspectRatio(
      meme.width,
      meme.height,
      dimensions.width,
      dimensions.height
    )
    return R.pipe(R.multiply(aspectRatio), Math.round)
  }, [meme, dimensions])

  const height = ratio(meme.height)
  const width = ratio(meme.width)

  return (
    <Styled.Container>
      <Styled.WrapperCanvas
        style={{
          height,
          width,
          backgroundImage: `url('https://www.meme-studio.io/templates/${meme.filename}')`
        }}
      >
        {meme.texts.map((text) => {
          const boxHeight = ratio(text.height)
          const boxWidth = ratio(text.width)

          return (
            <Draggable
              key={text.id}
              height={boxHeight}
              width={boxWidth}
              canvasHeight={height}
              canvasWidth={width}
              x={ratio(text.centerX) - R.divide(boxWidth, 2)}
              y={ratio(text.centerY) - R.divide(boxHeight, 2)}
              rotate={text.rotate}
            >
              <TextBox text={text} />
            </Draggable>
          )
        })}
        <Styled.Canvas width={width} height={height} />
      </Styled.WrapperCanvas>
    </Styled.Container>
  )
}

export default Canvas
