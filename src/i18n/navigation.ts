import React from 'react'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { localePrefix, locales } from './config'

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix })

export type LinkProps = React.ComponentProps<typeof Link>
