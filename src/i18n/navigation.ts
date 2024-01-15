import React from 'react'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { localePrefix, localesArray } from './config'

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales: localesArray, localePrefix })

export type LinkProps = React.ComponentProps<typeof Link>
