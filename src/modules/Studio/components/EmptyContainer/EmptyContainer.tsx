'use client'

/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import Image from 'next/image'
import Styled from './empty-container.styled'

const EmptyContainer = () => {
  return (
    <Styled.Container>
      <Image
        alt="Choose meme"
        width={360}
        height={308}
        priority
        src="/images/choose-meme.svg"
      />
      <Styled.ChooseTypography>
        Please select a meme in the gallery <br />
        <label htmlFor="local-meme">
          <Styled.FileInput
            type="file"
            accept="image/png, image/jpeg"
            id="local-meme"
          />
          or <Styled.ClickableBrowse>drop an image</Styled.ClickableBrowse>.
        </label>
      </Styled.ChooseTypography>
    </Styled.Container>
  )
}

export default EmptyContainer
