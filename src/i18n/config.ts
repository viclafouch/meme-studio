import { Pathnames } from 'next-intl/navigation'
import { Locales } from '@viclafouch/meme-studio-utilities/constants'

export const defaultLocale = Locales.en

export const localesArray = Object.values(Locales)

export type PagePropsWithLocaleParams<
  T extends object = Record<string, never>
> = T & {
  params: {
    locale: Locales
  }
}

export const pathnames = {
  '/': '/',
  '/create': {
    fr: '/creer-un-meme',
    en: '/create'
  },
  '/create/[slug]': {
    fr: '/creer-un-meme/[slug]',
    en: '/create/[slug]'
  }
} satisfies Pathnames<typeof localesArray>

// Use the default: `always`
export const localePrefix = undefined
