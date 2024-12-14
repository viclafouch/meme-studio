import React from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import CreatePage from 'modules/Studio'
import type { PagePropsWithLocaleParams } from '@i18n/config'

type PageProps = PagePropsWithLocaleParams

export async function generateMetadata({ params }: PagePropsWithLocaleParams) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('create.metadataTitle'),
    description: t('create.metadataDescription')
  }
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  return <CreatePage />
}

export default Page
