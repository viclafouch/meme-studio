import { type Pathnames } from 'next-intl/routing'
import {
  type Locales,
  locales
} from '@viclafouch/meme-studio-utilities/constants'

export const defaultLocale = locales.en

export const localesArray = Object.values(locales)

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
  '/gallery': {
    fr: '/gallerie',
    en: '/gallery'
  },
  '/qa': {
    fr: '/faq',
    en: '/qa'
  },
  '/about': {
    fr: '/a-propos',
    en: '/about'
  },
  '/create/[slug]': {
    fr: '/creer-un-meme/[slug]',
    en: '/create/[slug]'
  }
} satisfies Pathnames<typeof localesArray>

// Use the default: `always`
export const localePrefix = undefined
