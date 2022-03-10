import React from 'react'
import { drawText } from '@shared/helpers/canvas'
import { getAspectRatio } from '@shared/helpers/dom'
import { useCanvasDimensions } from '@stores/Editor/hooks/useCanvasDimensions'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useTexts } from '@stores/Editor/hooks/useTexts'
import * as R from 'ramda'

import Draggable from '../Draggable/Draggable'
import TextBox from '../TextBox/TextBox'
import Styled from './canvas.styled'

const Canvas = () => {
  const meme = useMeme() as Meme
  const canvasElRef = React.useRef<HTMLCanvasElement>(null)
  const [texts] = useTexts()
  const [dimensions] = useCanvasDimensions()

  const ratio = React.useMemo(() => {
    const aspectRatio = getAspectRatio(
      meme.width,
      meme.height,
      dimensions.width,
      dimensions.height
    )
    return R.pipe(R.multiply(aspectRatio), Math.round)
  }, [meme, dimensions])

  React.useLayoutEffect(() => {
    const canvasElement = canvasElRef.current
    if (canvasElement === null) {
      return () => {}
    }

    const draw = (): void => {
      const ctx = canvasElement.getContext('2d', {
        alpha: true
      }) as CanvasRenderingContext2D
      canvasElement.width = ratio(meme.width)
      canvasElement.height = ratio(meme.height)
      for (let index = 0; index < texts.length; index += 1) {
        const text = texts[index]
        drawText(
          {
            ...text,
            fontSize: ratio(text.fontSize),
            value: text.isUppercase ? R.toUpper(text.value) : text.value
          },
          ctx
        )
      }
    }

    const frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [texts, canvasElRef, ratio, meme])

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
          return (
            <Draggable
              key={text.id}
              textId={text.id}
              canvasHeight={height}
              canvasWidth={width}
              ratio={ratio}
            >
              <TextBox text={text} />
            </Draggable>
          )
        })}
        <Styled.Canvas ref={canvasElRef} width={width} height={height} />
      </Styled.WrapperCanvas>
    </Styled.Container>
  )
}

export default Canvas
