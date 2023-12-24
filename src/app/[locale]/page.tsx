import React from 'react'
import { unstable_setRequestLocale } from 'next-intl/server'
import { PagePropsWithLocaleParams } from '@i18n/config'
import HomePage from '../../modules/HomePage'

const Page = ({ params }: PagePropsWithLocaleParams) => {
  unstable_setRequestLocale(params.locale)

  return <HomePage />
}

export default Page
