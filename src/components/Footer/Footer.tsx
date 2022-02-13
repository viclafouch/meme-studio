import React from 'react'
import Link from 'next/link'

import Styled from './footer.styled'

const Footer = () => {
  return (
    <Styled.Footer>
      <Styled.LinksList>
        <li>
          <Link passHref href="/about">
            <Styled.Link>About</Styled.Link>
          </Link>
        </li>
        <li>
          <Link passHref href="/terms">
            <Styled.Link>Terms</Styled.Link>
          </Link>
        </li>
        <li>
          <Link passHref href="/gallery">
            <Styled.Link>Gallery</Styled.Link>
          </Link>
        </li>
        <li>
          <Link passHref href="/qa">
            <Styled.Link>Q&A</Styled.Link>
          </Link>
        </li>
        <li>
          <Styled.Link
            href="https://github.com/viclafouch/meme-studio"
            target="_blank"
          >
            Github
          </Styled.Link>
        </li>
      </Styled.LinksList>
    </Styled.Footer>
  )
}

export default Footer
