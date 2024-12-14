import createMiddleware from 'next-intl/middleware'
import { routing } from '@i18n/navigation'

export default createMiddleware(routing)

export const config = {
  matcher: [
    '/', // Make sure the root of your base path is matched

    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(fr|en)/:path*'
  ]
}
