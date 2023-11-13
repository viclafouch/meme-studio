import React from 'react'
import { useMutation } from 'react-query'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@components/Button'
import { Meme } from '@models/Meme'
import { exportCanvasBlob } from '@shared/helpers/canvas'
import { TextBox } from '@shared/schemas/textbox'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useTexts } from '@stores/Editor/hooks/useTexts'
import { useShowModal } from '@stores/Modal/Modal.provider'
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Styled from './Header.styled'

const Header = () => {
  const { texts } = useTexts()
  const meme = useMeme()
  const showModal = useShowModal()

  const exportCanvasMutation = useMutation(
    (body: { meme: Meme; texts: TextBox[] }) => {
      return exportCanvasBlob(body)
    },
    {
      onSuccess: (data: Blob, variables) => {
        showModal('export', {
          canvasBlob: data,
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
      meme,
      texts
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
