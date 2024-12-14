import React from 'react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { PagePropsWithLocaleParams } from '@i18n/config'
import HomePage from '../../modules/HomePage'

export async function generateMetadata({
  params
}: PagePropsWithLocaleParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('home.metadataTitle'),
    description: t('home.metadataDescription')
  }
}

type PageProps = PagePropsWithLocaleParams

const Page = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  return <HomePage locale={locale} />
}

export default Page
