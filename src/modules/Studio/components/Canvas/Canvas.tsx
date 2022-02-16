import React from 'react'

import Styled from './canvas.styled'

type CanvasProps = {
  meme: Meme
}

const Canvas = (props: CanvasProps) => {
  const { meme } = props
  return (
    <Styled.Container>
      <Styled.WrapperCanvas
        style={{
          height: meme.height,
          width: meme.width,
          backgroundImage: `url('https://www.meme-studio.io/templates/${meme.filename}')`
        }}
      >
        <Styled.Canvas />
      </Styled.WrapperCanvas>
    </Styled.Container>
  )
}

export default Canvas
