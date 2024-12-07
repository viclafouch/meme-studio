import React from 'react'
import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { PagePropsWithLocaleParams } from '@i18n/config'
import HomePage from '../../modules/HomePage'

type PageProps = PagePropsWithLocaleParams

export async function generateMetadata({
  params: { locale }
}: PagePropsWithLocaleParams): Promise<Metadata> {
  const t = await getTranslations({ locale })

  return {
    title: t('home.metadataTitle'),
    description: t('home.metadataDescription')
  }
}

const Page = ({ params }: PageProps) => {
  unstable_setRequestLocale(params.locale)

  return <HomePage />
}

export default Page
