'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import Button from '@components/Button'
import { useNotifications } from '@shared/hooks/useNotifications'
import { useShowModal } from '@stores/Modal/Modal.provider'
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { exportCanvasBlob } from '@viclafouch/meme-studio-utilities/helpers'
import {
  useMeme,
  useRatiotedTextboxes,
  useTopBlock
} from '@viclafouch/meme-studio-utilities/hooks'
import { Meme } from '@viclafouch/meme-studio-utilities/schemas'

const ExportButton = () => {
  const meme = useMeme()
  const t = useTranslations()
  const showModal = useShowModal()
  const topBlock = useTopBlock()
  const { notifyError } = useNotifications()
  const getScaledTextsByMemeSize = useRatiotedTextboxes()

  const exportCanvasMutation = useMutation({
    mutationFn: async (body: { meme: Meme }) => {
      await new Promise((resolve) => {
        return setTimeout(resolve, 300)
      })

      return exportCanvasBlob({
        meme: body.meme,
        topBlock,
        texts: getScaledTextsByMemeSize()
      })
    },
    onError: () => {
      notifyError()
    },
    onSuccess: (blob: Blob, variables) => {
      showModal('export', {
        canvasBlob: blob,
        width: variables.meme.width,
        height:
          variables.meme.height + (topBlock.isVisible ? topBlock.baseHeight : 0)
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
      {t('tools.exportMeme').toUpperCase()}
    </Button>
  )
}

export default ExportButton
