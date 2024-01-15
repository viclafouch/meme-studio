import React from 'react'
import { Metadata } from 'next'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { notFound, RedirectType } from 'next/navigation'
import { useLocale } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import CreatePage from 'modules/Studio'
import { PagePropsWithLocaleParams } from '@i18n/config'
import { redirect } from '@i18n/navigation'
import { getMeme, getMemes } from '@shared/api/memes'
import { getMemeMetadata } from '@shared/helpers/meme-metadata'
import { Locales } from '@viclafouch/meme-studio-utilities/constants'
import { Meme } from '@viclafouch/meme-studio-utilities/schemas'
import {
  getMemeIdFromSlug,
  getMemeSlug
} from '@viclafouch/meme-studio-utilities/utils'

type PageProps = PagePropsWithLocaleParams<{ params: { slug: string } }>

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug, locale } = params
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
      languages: Object.values(metadataByLocales.metadata).reduce(
        (accumulator, currentValue) => {
          accumulator[currentValue.locale] = currentValue.url

          return accumulator
        },
        {} as Record<Locales, string>
      )
    }
  }
}

export async function generateStaticParams({
  params
}: PagePropsWithLocaleParams) {
  const memes = await getMemes({ locale: params.locale })

  return memes.map((meme) => {
    return {
      slug: getMemeSlug(meme)
    }
  })
}

const Page = async ({
  params
}: PagePropsWithLocaleParams<{ params: { slug: string } }>) => {
  unstable_setRequestLocale(params.locale)
  const locale = useLocale() as Locales

  const id = getMemeIdFromSlug(params.slug)

  let meme: Meme

  try {
    meme = await getMeme(id, { locale })

    const correctSlug = getMemeSlug(meme)

    if (correctSlug !== params.slug) {
      const redirectUrl = `/create/${correctSlug}`

      await redirect(redirectUrl, RedirectType.replace)
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    notFound()
  }

  return <CreatePage meme={meme} textboxes={meme.textboxes} />
}

export default Page
