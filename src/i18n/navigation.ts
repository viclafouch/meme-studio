import React from 'react'
import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'
import { localePrefix, localesArray } from './config'

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en'
})

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales: localesArray,
  localePrefix
})

export type LinkProps = React.ComponentProps<typeof Link>
