import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Styled from './header.styled'

const Header = () => {
  return (
    <Styled.Header>
      <Styled.LogoBlock>
        <Link href="/">
          <Image
            alt="Meme Studio logo"
            width={250}
            height={67}
            priority
            src="/images/logo-meme-studio-light.png"
          />
        </Link>
      </Styled.LogoBlock>
    </Styled.Header>
  )
}

export default Header
