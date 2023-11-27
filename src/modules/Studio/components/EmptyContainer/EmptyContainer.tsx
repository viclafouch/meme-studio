import React from 'react'
import Image from 'next/image'
import { css } from '@styled-system/css'
import { Center, styled } from '@styled-system/jsx'

const EmptyContainer = () => {
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
        Please select a meme in the gallery <br />
        <label htmlFor="local-meme">
          <input
            type="file"
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
          or{' '}
          <span
            className={css({
              textDecoration: 'underline',
              cursor: 'pointer',
              color: 'primary'
            })}
          >
            drop an image
          </span>
          .
        </label>
      </styled.p>
    </Center>
  )
}

export default EmptyContainer
