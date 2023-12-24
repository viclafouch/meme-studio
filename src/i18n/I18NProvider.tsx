'use client'

import { ReactNode } from 'react'
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl'

type I18NProviderProps = {
  messages: AbstractIntlMessages
  locale: string
  children: ReactNode
  timeZone: string
  now: Date
}

const I18NProvider = ({
  messages,
  locale,
  children,
  timeZone,
  now
}: I18NProviderProps) => {
  return (
    <NextIntlClientProvider
      timeZone={timeZone}
      locale={locale}
      messages={messages}
      now={now}
    >
      {children}
    </NextIntlClientProvider>
  )
}

export default I18NProvider
