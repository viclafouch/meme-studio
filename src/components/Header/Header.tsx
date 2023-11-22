import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@components/Button'
import { Meme } from '@models/Meme'
import { exportCanvasBlob } from '@shared/helpers/canvas'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useRatiotedTextboxes } from '@stores/Editor/hooks/useTextboxes'
import { useShowModal } from '@stores/Modal/Modal.provider'
import { Flex, Grid } from '@styled-system/jsx'
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'

const Header = () => {
  const meme = useMeme()
  const showModal = useShowModal()
  const getScaledTextsByMemeSize = useRatiotedTextboxes()

  const exportCanvasMutation = useMutation({
    mutationFn: (body: { meme: Meme }) => {
      return exportCanvasBlob({
        ...body,
        texts: getScaledTextsByMemeSize()
      })
    },
    onSuccess: (blob: Blob, variables) => {
      showModal('export', {
        canvasBlob: blob,
        width: variables.meme.width,
        height: variables.meme.height
      })
    }
  })

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
    <Grid
      height="5rem"
      width="full"
      alignItems="center"
      justifyContent="center"
      position="relative"
      bg="primary"
      zIndex={999}
      paddingInline="12"
      boxShadow="md"
      gridTemplateColumns="1fr auto 1fr"
    >
      <div />
      <div>
        <Link href="/">
          <Image
            alt="Meme Studio logo"
            width={250}
            height={67}
            priority
            src="/images/logo-meme-studio-light.png"
          />
        </Link>
      </div>
      <Flex align="center" justify="flex-end">
        <Button
          disabled={!meme}
          color="secondary"
          onClick={handleOpenExportModal}
          startAdornment={<FontAwesomeIcon icon={faArrowCircleDown} />}
        >
          Exporter
        </Button>
      </Flex>
    </Grid>
  )
}

export default Header
