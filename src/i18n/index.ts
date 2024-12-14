import { getRequestConfig } from 'next-intl/server'
import { routing } from './navigation'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale
  }

  const messages = await import(`./locales/${locale}/index.ts`)

  return {
    messages: messages.default,
    timeZone: 'Europe/Vienna',
    now: new Date()
  }
})
