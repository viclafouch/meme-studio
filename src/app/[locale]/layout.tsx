import React from 'react'
import type { Metadata } from 'next'
import { Alata } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import QueryProvider from 'queries/QueryProvider'
import ToastContainer from '@components/NotificationProvider'
import { type PagePropsWithLocaleParams } from '@i18n/config'
import { routing } from '@i18n/navigation'
import { ModalProvider } from '@stores/Modal/Modal.provider'
import { css, cx } from '@styled-system/css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../../../styles/globals.css'

const atlata = Alata({ weight: '400', subsets: ['latin'] })

type LayoutProps = PagePropsWithLocaleParams

export async function generateMetadata({
  params
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: {
      template: 'Meme Studio | %s',
      default: t('common.createMeme')
    }
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => {
    return { locale }
  })
}

const RootLayout = async ({
  children,
  params
}: {
  children: React.ReactNode
} & LayoutProps) => {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale}>
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
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ToastContainer
              position="bottom-left"
              draggable={false}
              theme="dark"
            />
            <ModalProvider>{children}</ModalProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
