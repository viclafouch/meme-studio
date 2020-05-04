import * as React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '@client/scss/pages/404.scss'

function NotFound(): JSX.Element {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <div className="page not-found">
      <h1>404</h1>
      <p>
        {t('noMatch')} <code>{location.pathname}</code>
      </p>
      <Link to="/">{t('backToHome')}</Link>
    </div>
  )
}

export default NotFound
