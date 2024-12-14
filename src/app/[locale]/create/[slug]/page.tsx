import React from 'react'
import type { Metadata } from 'next'
import { notFound, RedirectType } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import CreatePage from 'modules/Studio'
import type { PagePropsWithLocaleParams } from '@i18n/config'
import { redirect } from '@i18n/navigation'
import { getMeme, getMemes } from '@shared/api/memes'
import { getMemeMetadata } from '@shared/helpers/meme-metadata'
import type { Locales } from '@viclafouch/meme-studio-utilities/constants'
import type { Meme } from '@viclafouch/meme-studio-utilities/schemas'
import {
  getMemeIdFromSlug,
  getMemeSlug
} from '@viclafouch/meme-studio-utilities/utils'

type PageProps = PagePropsWithLocaleParams<{
  params: Promise<{ slug: string }>
}>

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const id = getMemeIdFromSlug(slug)
  const t = await getTranslations({ locale })

  const { meme, ...metadataByLocales } = await getMemeMetadata(id, locale)
  const metadata = metadataByLocales.metadata[locale]!

  return {
    title: metadata.name,
    description: t('createSlug.metadataDescription', { name: metadata.name }),
    keywords: metadata.keywords,
    alternates: {
      canonical: metadata.url,
      languages: Object.values(metadataByLocales.metadata).reduce<
        Record<Locales, string>
      >(
        (accumulator, currentValue) => {
          accumulator[currentValue.locale] = currentValue.url

          return accumulator
        },
        {
          fr: '',
          en: ''
        }
      )
    }
  }
}

export async function generateStaticParams({
  params
}: PagePropsWithLocaleParams) {
  const { locale } = await params
  const memes = await getMemes({ locale })

  return memes.map((meme) => {
    return {
      slug: getMemeSlug(meme)
    }
  })
}

const Page = async ({
  params
}: PagePropsWithLocaleParams<{ params: Promise<{ slug: string }> }>) => {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const id = getMemeIdFromSlug(slug)

  let meme: Meme

  try {
    meme = await getMeme(id, { locale })

    const correctSlug = getMemeSlug(meme)

    if (correctSlug !== slug) {
      const redirectUrl = `/create/${correctSlug}`

      await redirect(
        {
          locale,
          href: redirectUrl
        },
        RedirectType.replace
      )
    }
  } catch (error) {
    notFound()
  }

  return <CreatePage meme={meme} textboxes={meme.textboxes} />
}

export default Page
