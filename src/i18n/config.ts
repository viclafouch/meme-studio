import { Pathnames } from 'next-intl/navigation'

export const locales = ['fr', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export type PagePropsWithLocaleParams<
  T extends object = Record<string, never>
> = T & {
  params: {
    locale: Locale
  }
}

export const pathnames = {
  '/': '/',
  '/create': {
    fr: '/toto',
    en: '/create'
  }
} satisfies Pathnames<typeof locales>

// Use the default: `always`
export const localePrefix = undefined
