import * as React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './footer.scss'

function Footer(): JSX.Element {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <ul className="footer-links">
        <li>
          <Link to="/about">{t('about.meta.title')}</Link>
        </li>
        <li>
          <Link to="/terms">{t('legal.meta.title')}</Link>
        </li>
        <li>
          <Link to="/gallery">{t('gallery.minTitle')}</Link>
        </li>
        <li>
          <Link to="/qa">{t('qa.title')}</Link>
        </li>
        <li>
          <a
            target="_blank"
            href="https://github.com/viclafouch/meme-studio"
            aria-label={t('attr.viewSource')}
            title={t('attr.viewSource')}
            rel="noreferrer noopener"
          >
            Github
          </a>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
