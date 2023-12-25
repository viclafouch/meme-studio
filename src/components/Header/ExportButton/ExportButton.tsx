'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import Button from '@components/Button'
import { useShowModal } from '@stores/Modal/Modal.provider'
import { exportCanvasBlob } from '@viclafouch/meme-studio-utilities/helpers'
import {
  useMeme,
  useRatiotedTextboxes,
  useTopBlock
} from '@viclafouch/meme-studio-utilities/hooks'
import { Meme } from '@viclafouch/meme-studio-utilities/schemas'
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'

const ExportButton = () => {
  const meme = useMeme()
  const t = useTranslations()
  const showModal = useShowModal()
  const topBlock = useTopBlock()
  const getScaledTextsByMemeSize = useRatiotedTextboxes()

  const exportCanvasMutation = useMutation({
    mutationFn: (body: { meme: Meme }) => {
      return exportCanvasBlob({
        meme: body.meme,
        topBlock,
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
      {t('common.export').toUpperCase()}
    </Button>
  )
}

export default ExportButton
