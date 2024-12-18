import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Button from '@components/Button'
import LinkButton from '@components/LinkButton'
import { useNotifications } from '@shared/hooks/useNotifications'
import { css } from '@styled-system/css'
import { Box, Flex } from '@styled-system/jsx'
import {
  faArrowCircleDown,
  faClipboard
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useClipboard } from '@viclafouch/meme-studio-utilities/hooks'

export type ExportModalProps = {
  canvasBlob: Blob
  height: number
  width: number
}

const ExportModal = ({ canvasBlob, height, width }: ExportModalProps) => {
  const t = useTranslations()
  const { notifySuccess, notifyError } = useNotifications()

  const imageSrc = React.useMemo(() => {
    return URL.createObjectURL(canvasBlob)
  }, [canvasBlob])

  const { copy } = useClipboard()

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    try {
      await copy(canvasBlob)
      notifySuccess('common.copied')
    } catch (error) {
      notifyError()
    }
  }

  return (
    <Box textAlign="center">
      <h2 className={css({ mb: '5', fontSize: '2xl' })}>
        {t('common.preview')}
      </h2>
      <div
        onContextMenu={(
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ): void => {
          return event.preventDefault()
        }}
      >
        <Image
          src={imageSrc}
          className={css({
            maxW: '600px',
            maxH: '500px',
            w: 'full',
            marginX: 'auto',
            objectFit: 'contain',
            boxShadow:
              '0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset'
          })}
          unoptimized
          height={height}
          width={width}
          alt=""
        />
      </div>
      <p className={css({ mt: 5 })}>
        {t('common.fullSize')} {width} x {height}
      </p>
      <Flex
        mx="auto"
        mt="5"
        gap="5"
        justifyContent="center"
        alignItems="center"
        w="full"
        flexDir={{
          mdDown: 'column',
          md: 'row'
        }}
      >
        <LinkButton
          startAdornment={<FontAwesomeIcon icon={faArrowCircleDown} />}
          href={imageSrc}
          download="meme.png"
          rounded
          color="primaryDark"
        >
          {t('common.download')}
        </LinkButton>
        <Button
          startAdornment={<FontAwesomeIcon icon={faClipboard} />}
          rounded
          onClick={handleCopy}
          color="primary"
        >
          {t('common.copy')}
        </Button>
      </Flex>
    </Box>
  )
}

export default ExportModal
