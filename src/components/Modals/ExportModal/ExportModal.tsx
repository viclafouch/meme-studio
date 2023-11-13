import React from 'react'
import Button from '@components/Button'
import LinkButton from '@components/LinkButton'
import { useClipboard } from '@shared/hooks/useClipboard'
import {
  faArrowCircleDown,
  faClipboard
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

  const { copy } = useClipboard()

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    copy({
      blob: canvasBlob
    })
  }

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
      <Styled.SizeText>
        Taille réelle : {width} x {height}
      </Styled.SizeText>
      <Styled.Actions>
        <LinkButton
          startAdornment={<FontAwesomeIcon icon={faArrowCircleDown} />}
          fullWidth
          href={imageSrc}
          download="meme.png"
        >
          Télécharger
        </LinkButton>
        <Button
          startAdornment={<FontAwesomeIcon icon={faClipboard} />}
          fullWidth
          onClick={handleCopy}
        >
          Copier
        </Button>
      </Styled.Actions>
    </Styled.Container>
  )
}

export default ExportModal
