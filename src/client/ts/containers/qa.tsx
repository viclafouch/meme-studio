import * as React from 'react'
import * as ReactMarkdown from 'react-markdown'
import Header from '@client/components/Header/Header'
import Footer from '@client/components/Footer/Footer'
import qaEnUS from '@client/md/en-US/faq.md'
import qaFr from '@client/md/fr/faq.md'
import { useTranslation } from 'react-i18next'
import '@client/scss/pages/qa.scss'

function Qa(): JSX.Element {
  const { t, i18n } = useTranslation()

  return (
    <div className="page qa">
      <Header />
      <div className="content-one">
        <section className="qa-body container">
          <h1>{t('qa.title')}</h1>
          <ReactMarkdown source={i18n.language === 'fr' ? qaFr : qaEnUS} escapeHtml={false} />
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Qa
