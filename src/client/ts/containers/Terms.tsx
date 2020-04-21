import * as React from 'react'
import { useTranslation } from 'react-i18next'
import * as ReactMarkdown from 'react-markdown'
import TermsEnUS from '@client/md/en-US/legale-notices.md'
import TermsFr from '@client/md/fr/legale-notices.md'
import Header from '@client/components/Header/Header'
import Footer from '@client/components/Footer/Footer'
import '@client/scss/pages/terms.scss'

function Terms(): JSX.Element {
  const { i18n } = useTranslation()

  return (
    <div className="page terms">
      <Header />
      <div className="content-one">
        <section className="terms-body container">
          <ReactMarkdown source={i18n.language === 'fr' ? TermsFr : TermsEnUS} escapeHtml={false} />
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Terms
