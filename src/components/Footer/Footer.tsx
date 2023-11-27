import React from 'react'
import Link from 'next/link'
import { css } from '@styled-system/css'
import { styled } from '@styled-system/jsx'
import { center } from '@styled-system/patterns'

const LinkStyled = styled(Link, {
  base: {
    marginX: '2',
    color: 'gray.400',
    _hover: {
      color: 'gray.100'
    }
  }
})

const Footer = () => {
  return (
    <footer
      className={css({
        textAlign: 'center',
        w: 'full',
        pt: '7',
        pb: '3'
      })}
    >
      <ul className={center()}>
        <li>
          <LinkStyled href="/about">About</LinkStyled>
        </li>
        <li>
          <LinkStyled href="/terms">Terms</LinkStyled>
        </li>
        <li>
          <LinkStyled href="/gallery">Gallery</LinkStyled>
        </li>
        <li>
          <LinkStyled href="/qa">Q&A</LinkStyled>
        </li>
        <li>
          <LinkStyled
            href="https://github.com/viclafouch/meme-studio"
            target="_blank"
          >
            Github
          </LinkStyled>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
