import React from 'react'
import { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { localesArray, PagePropsWithLocaleParams } from '@i18n/config'
import HomePage from '../../modules/HomePage'

type PageProps = PagePropsWithLocaleParams

export async function generateMetadata({
  params: { locale }
}: PagePropsWithLocaleParams): Promise<Metadata> {
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

  return <HomePage />
}

export default Page
