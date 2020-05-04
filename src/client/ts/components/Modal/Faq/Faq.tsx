import * as React from 'react'
import { useState, useImperativeHandle, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import * as Loadable from 'react-loadable'
import faqEnUS from '@client/md/en-US/faq.md'
import faqFr from '@client/md/fr/faq.md'
import Modal from '@client/components/Modal/Modal'
import './faq.scss'

const ReactMarkdownAsync = Loadable({
  loader: () => import('react-markdown'),
  loading: () => null
})

const Faq = forwardRef(
  (props: any, ref): JSX.Element => {
    const { i18n, t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    useImperativeHandle(
      ref,
      () => ({
        open: (): void => setIsOpen(true),
        close: (): void => setIsOpen(false)
      }),
      [setIsOpen]
    )

    return isOpen ? (
      <Modal onClose={(): void => setIsOpen(false)}>
        <div className="faq-modal">
          <h1>{t('qa.title')}</h1>
          <div className="faq-body">
            <ReactMarkdownAsync source={i18n.language === 'fr' ? faqFr : faqEnUS} escapeHtml={false} />
          </div>
        </div>
      </Modal>
    ) : null
  }
)

export default Faq
