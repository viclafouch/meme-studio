import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { css } from '@styled-system/css'
import { Center, styled } from '@styled-system/jsx'
import { useImageLocal } from '@viclafouch/meme-studio-utilities/hooks'

const EmptyContainer = () => {
  const setImageLocal = useImageLocal()
  const t = useTranslations()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    const [file] = Array.from(files || [])

    if (file) {
      setImageLocal(file)
    }
  }

  return (
    <Center flexDir="column" h="full">
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
  )
}

export default EmptyContainer
