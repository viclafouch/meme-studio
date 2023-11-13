import React from 'react'
import { useMutation } from 'react-query'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@components/Button'
import { Meme } from '@models/Meme'
import { exportCanvasBlob } from '@shared/helpers/canvas'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useRatiotedTexts } from '@stores/Editor/hooks/useTexts'
import { useShowModal } from '@stores/Modal/Modal.provider'
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Styled from './Header.styled'

const Header = () => {
  const meme = useMeme()
  const showModal = useShowModal()
  const getRatiotedTexts = useRatiotedTexts()

  const exportCanvasMutation = useMutation(
    (body: { meme: Meme }) => {
      return exportCanvasBlob({
        ...body,
        texts: getRatiotedTexts()
      })
    },
    {
      onSuccess: (blob: Blob, variables) => {
        showModal('export', {
          canvasBlob: blob,
          width: variables.meme.width,
          height: variables.meme.height
        })
      }
    }
  )

  const handleOpenExportModal = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()

    if (!meme) {
      return
    }

    exportCanvasMutation.mutate({
      meme
    })
  }

  return (
    <Styled.Header>
      <div />
      <Styled.LogoBlock>
        <Link href="/">
          <Image
            alt="Meme Studio logo"
            width={250}
            height={67}
            priority
            src="/images/logo-meme-studio-light.png"
          />
        </Link>
      </Styled.LogoBlock>
      <Styled.RightBlock>
        <Button
          disabled={!meme}
          color="secondary"
          onClick={handleOpenExportModal}
          startAdornment={<FontAwesomeIcon icon={faArrowCircleDown} />}
        >
          Exporter
        </Button>
      </Styled.RightBlock>
    </Styled.Header>
  )
}

export default Header
