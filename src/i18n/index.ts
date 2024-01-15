import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { localesArray } from '@i18n/config'

export default getRequestConfig(async ({ locale }: { locale: string }) => {
  if (!localesArray.includes(locale)) {
    notFound()
  }

  const messages = await import(`./locales/${locale}/index.ts`)

  return {
    messages: messages.default,
    timeZone: 'Europe/Vienna',
    now: new Date()
  }
})
