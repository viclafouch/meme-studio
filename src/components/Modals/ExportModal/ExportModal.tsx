import React from 'react'
import Button from '@components/Button'
import LinkButton from '@components/LinkButton'
import { css } from '@styled-system/css'
import { Box, Flex } from '@styled-system/jsx'
import { useClipboard } from '@viclafouch/meme-studio-utilities/hooks'
import {
  faArrowCircleDown,
  faClipboard
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
    <Box textAlign="center">
      <h2 className={css({ mb: '5', fontSize: '2xl' })}>Prévisualisation</h2>
      <div
        onContextMenu={(
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ): void => {
          return event.preventDefault()
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          className={css({
            maxW: 'full',
            maxH: '490px',
            boxShadow:
              '0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset'
          })}
          alt=""
        />
      </div>
      <p className={css({ mt: 5 })}>
        Taille réelle : {width} x {height}
      </p>
      <Flex
        maxW="7/12"
        mx="auto"
        mt="5"
        gap="5"
        justifyContent="center"
        alignItems="stretch"
        w="full"
      >
        <LinkButton
          startAdornment={<FontAwesomeIcon icon={faArrowCircleDown} />}
          fullWidth
          href={imageSrc}
          download="meme.png"
          rounded
          color="primaryDark"
        >
          Télécharger
        </LinkButton>
        <Button
          startAdornment={<FontAwesomeIcon icon={faClipboard} />}
          fullWidth
          rounded
          onClick={handleCopy}
          color="primary"
        >
          Copier
        </Button>
      </Flex>
    </Box>
  )
}

export default ExportModal
