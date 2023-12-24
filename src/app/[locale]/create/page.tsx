import React from 'react'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import CreatePage from 'modules/Studio'
import { PagePropsWithLocaleParams } from '@i18n/config'

export async function generateMetadata({
  params: { locale }
}: PagePropsWithLocaleParams) {
  const t = await getTranslations({ locale })

  return {
    title: t('common.createMeme')
  }
}

const Page = ({ params }: PagePropsWithLocaleParams) => {
  unstable_setRequestLocale(params.locale)

  return <CreatePage />
}

export default Page
