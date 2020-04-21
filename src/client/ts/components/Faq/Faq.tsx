import * as React from 'react'
import { useState, useImperativeHandle, forwardRef } from 'react'
import * as ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import faqEnUS from '@client/md/en-US/faq.md'
import faqFr from '@client/md/fr/faq.md'
import Modal from '@client/components/Modal/Modal'
import './faq.scss'

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
        <div className="faq">
          <h1>{t('faq')}</h1>
          <div className="faq-body">
            <ReactMarkdown source={i18n.language === 'fr' ? faqFr : faqEnUS} escapeHtml={false} />
          </div>
        </div>
      </Modal>
    ) : null
  }
)

export default Faq
