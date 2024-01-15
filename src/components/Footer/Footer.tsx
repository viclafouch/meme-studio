import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@i18n/navigation'
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
  const t = useTranslations('footer')

  return (
    <footer
      className={css({
        textAlign: 'center',
        w: 'full',
        p: 6
      })}
    >
      <ul className={center()}>
        <li>
          <LinkStyled href="/about">{t('about')}</LinkStyled>
        </li>
        {/* <li>
          <LinkStyled href="/terms">{t('terms')}</LinkStyled>
        </li> */}
        <li>
          <LinkStyled href="/gallery">{t('gallery')}</LinkStyled>
        </li>
        <li>
          <LinkStyled href="/qa">{t('qaa')}</LinkStyled>
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
