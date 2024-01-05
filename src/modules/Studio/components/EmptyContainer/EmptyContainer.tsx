import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Button from '@components/Button'
import InputHiddenButton from '@components/InputHiddenButton'
import { useShowModal } from '@stores/Modal/Modal.provider'
import { css } from '@styled-system/css'
import { Center, styled } from '@styled-system/jsx'
import { useImageLocal } from '@viclafouch/meme-studio-utilities/hooks'

const EmptyContainer = () => {
  const setImageLocal = useImageLocal()
  const t = useTranslations()
  const showModal = useShowModal()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    const [file] = Array.from(files || [])

    if (file) {
      setImageLocal(file)
    }
  }

  const handleOpenGalleryModal = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    showModal('gallery', {})
  }

  return (
    <>
      <Center
        display={{ mdDown: 'none', md: 'flex' }}
        flexDir="column"
        h="full"
      >
        <Image
          alt="Choose meme"
          width={360}
          height={308}
          priority
          src="/images/choose-meme.svg"
        />
        <styled.p textAlign="center" marginTop="5">
          {t('common.selectAFile')} <br />
          <label htmlFor="local-meme">
            <input
              type="file"
              onChange={handleChange}
              className={css({
                w: 0,
                h: 0,
                opacity: 0,
                position: 'absolute',
                visibility: 'hidden'
              })}
              accept="image/png, image/jpeg"
              id="local-meme"
            />
            {t('common.or')}{' '}
            <span
              className={css({
                textDecoration: 'underline',
                cursor: 'pointer',
                color: 'primary'
              })}
            >
              {t('common.dropImage')}
            </span>
            .
          </label>
        </styled.p>
      </Center>
      <Center
        display={{ mdDown: 'flex', md: 'none' }}
        justifyContent="center"
        gap={7}
        flexDir="column"
        h="full"
        p={5}
      >
        <Button
          size="large"
          color="primary"
          rounded
          onClick={handleOpenGalleryModal}
        >
          Parcourir les mèmes
        </Button>
        <InputHiddenButton
          accept="image/png, image/jpeg"
          size="large"
          onChange={handleChange}
          color="secondaryDark"
          rounded
        >
          Choisir une image depuis mon appareil
        </InputHiddenButton>
      </Center>
    </>
  )
}

export default EmptyContainer
