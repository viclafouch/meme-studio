import React from 'react'
import Styled from './footer.styled'

const Footer = () => {
  return (
    <Styled.Footer>
      <Styled.LinksList>
        <li>
          <Styled.Link href="/about">About</Styled.Link>
        </li>
        <li>
          <Styled.Link href="/terms">Terms</Styled.Link>
        </li>
        <li>
          <Styled.Link href="/gallery">Gallery</Styled.Link>
        </li>
        <li>
          <Styled.Link href="/qa">Q&A</Styled.Link>
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
