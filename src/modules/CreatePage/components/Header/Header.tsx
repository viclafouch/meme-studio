import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Styled from './header.styled'

const Header = () => {
  return (
    <Styled.Header>
      <Styled.LogoBlock>
        <Link href="/">
          <a>
            <Image
              alt="Meme Studio logo"
              width={250}
              height={67}
              layout="fixed"
              src="/images/logo-meme-studio-light.png"
            />
          </a>
        </Link>
      </Styled.LogoBlock>
    </Styled.Header>
  )
}

export default Header
