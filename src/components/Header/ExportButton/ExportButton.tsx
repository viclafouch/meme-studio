'use client'

import React from 'react'
import Button from '@components/Button'
import { Meme } from '@models/Meme'
import { exportCanvasBlob } from '@shared/helpers/canvas'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useRatiotedTextboxes } from '@stores/Editor/hooks/useTextboxes'
import { useShowModal } from '@stores/Modal/Modal.provider'
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'

const ExportButton = () => {
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
    <Button
      disabled={!meme}
      color="secondary"
      rounded
      onClick={handleOpenExportModal}
      startAdornment={<FontAwesomeIcon icon={faArrowCircleDown} />}
    >
      Exporter
    </Button>
  )
}

export default ExportButton
