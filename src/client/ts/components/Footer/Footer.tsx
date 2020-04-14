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
          <Link to="/about">{t('about')}</Link>
        </li>
        <li>
          <Link to="/about">{t('legal')}</Link>
        </li>
        <li>
          <a
            target="_blank"
            href="https://github.com/viclafouch/meme-studio"
            aria-label={t('attr.viewSource')}
            title={t('attr.viewSource')}
          >
            Github
          </a>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
