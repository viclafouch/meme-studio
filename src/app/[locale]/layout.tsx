import React from 'react'
import { Metadata } from 'next'
import { Alata } from 'next/font/google'
import { useMessages, useNow, useTimeZone } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import QueryProvider from 'queries/QueryProvider'
import { locales, PagePropsWithLocaleParams } from '@i18n/config'
import I18NProvider from '@i18n/I18NProvider'
import { ModalOutlet } from '@stores/Modal/Modal.provider'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../../../styles/globals.css'

const atlata = Alata({ weight: '400', subsets: ['latin'] })

export async function generateMetadata({
  params: { locale }
}: PagePropsWithLocaleParams): Promise<Metadata> {
  const t = await getTranslations({ locale })

  return {
    title: {
      template: 'Meme Studio | %s',
      default: t('common.createMeme')
    }
  }
}

export function generateStaticParams() {
  return locales.map((locale) => {
    return { locale }
  })
}

const RootLayout = ({
  children,
  params
}: PagePropsWithLocaleParams<{
  children: React.ReactNode
}>) => {
  const messages = useMessages()
  const timeZone = useTimeZone()!
  const now = useNow()

  return (
    <html lang={params.locale}>
      <body className={atlata.className}>
        <QueryProvider>
          <I18NProvider
            timeZone={timeZone}
            messages={messages}
            locale={params.locale}
            now={now}
          >
            <>
              {children}
              <ModalOutlet />
            </>
          </I18NProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
