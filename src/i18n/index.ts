import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { locales } from '@i18n/config'

export default getRequestConfig(async ({ locale }: { locale: string }) => {
  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await import(`./locales/${locale}/index.ts`)

  return {
    messages: messages.default,
    timeZone: 'Europe/Vienna',
    now: new Date()
  }
})
