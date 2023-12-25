import createMiddleware from 'next-intl/middleware'
import {
  defaultLocale,
  localePrefix,
  localesArray,
  pathnames
} from '@i18n/config'

export default createMiddleware({
  defaultLocale,
  locales: localesArray,
  pathnames,
  localePrefix
})

export const config = {
  matcher: [
    '/', // Make sure the root of your base path is matched

    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    `/(fr|en)/:path*`
  ]
}
