import React from 'react'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import CreatePage from 'modules/Studio'
import { localesArray, PagePropsWithLocaleParams } from '@i18n/config'

type PageProps = PagePropsWithLocaleParams

export async function generateMetadata({
  params: { locale }
}: PagePropsWithLocaleParams) {
  const t = await getTranslations({ locale })

  return {
    title: t('common.createMeme')
  }
}

export function generateStaticParams(): Promise<PageProps['params'][]> {
  return Promise.resolve(
    localesArray.map((locale) => {
      return { locale }
    })
  )
}

const Page = ({ params }: PageProps) => {
  unstable_setRequestLocale(params.locale)

  return <CreatePage />
}

export default Page
