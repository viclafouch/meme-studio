import React from 'react'
import { Metadata } from 'next'
import { Alata } from 'next/font/google'
import { useMessages, useNow, useTimeZone } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import QueryProvider from 'queries/QueryProvider'
import ToastContainer from '@components/NotificationProvider'
import { localesArray, PagePropsWithLocaleParams } from '@i18n/config'
import I18NProvider from '@i18n/I18NProvider'
import { ModalProvider } from '@stores/Modal/Modal.provider'
import { css, cx } from '@styled-system/css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../../../styles/globals.css'

const atlata = Alata({ weight: '400', subsets: ['latin'] })

type LayoutProps = PagePropsWithLocaleParams

export async function generateMetadata({
  params: { locale }
}: LayoutProps): Promise<Metadata> {
  const t = await getTranslations({ locale })

  return {
    title: {
      template: 'Meme Studio | %s',
      default: t('common.createMeme')
    }
  }
}

export async function generateStaticParams(): Promise<LayoutProps['params'][]> {
  return Promise.resolve(
    localesArray.map((locale) => {
      return { locale }
    })
  )
}

const RootLayout = ({
  children,
  params
}: {
  children: React.ReactNode
} & LayoutProps) => {
  const messages = useMessages()
  const timeZone = useTimeZone()!
  const now = useNow()

  return (
    <html lang={params.locale}>
      <body
        className={cx(
          atlata.className,
          css({
            minH: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            bg: 'secondary',
            color: 'secondary.textContrast'
          })
        )}
      >
        <QueryProvider>
          <I18NProvider
            timeZone={timeZone}
            messages={messages}
            locale={params.locale}
            now={now}
          >
            <ToastContainer
              position="bottom-left"
              draggable={false}
              theme="dark"
            />
            <ModalProvider>{children}</ModalProvider>
          </I18NProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
