import React from 'react'
import Styled from './ExportModal.styled'

export type ExportModalProps = {
  canvasBlob: Blob
  height: number
  width: number
}

const ExportModal = ({ canvasBlob, height, width }: ExportModalProps) => {
  const imageSrc = React.useMemo(() => {
    return URL.createObjectURL(canvasBlob)
  }, [canvasBlob])

  return (
    <Styled.Container>
      <Styled.Title>Prévisualisation</Styled.Title>
      <div
        onContextMenu={(
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ): void => {
          return event.preventDefault()
        }}
      >
        <Styled.Image src={imageSrc} className="meme-img" alt="" />
      </div>
      <span>
        Taille réelle : {width} x {height}
      </span>
    </Styled.Container>
  )
}

export default ExportModal
