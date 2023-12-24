import React from 'react'
import { Metadata } from 'next'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { notFound, RedirectType } from 'next/navigation'
import { useLocale } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'
import CreatePage from 'modules/Studio'
import { Locale, locales, PagePropsWithLocaleParams } from '@i18n/config'
import { redirect } from '@i18n/navigation'
import { getMeme, getMemes } from '@shared/api/memes'
import { Meme } from '@viclafouch/meme-studio-utilities/schemas'
import {
  getMemeIdFromSlug,
  getMemeSlug
} from '@viclafouch/meme-studio-utilities/utils'

export async function generateMetadata({
  params
}: PagePropsWithLocaleParams<{ params: { slug: string } }>): Promise<Metadata> {
  const { slug, locale } = params
  const id = getMemeIdFromSlug(slug)

  const meme = await getMeme(id, { locale })

  return {
    // use locale
    title: meme.name,
    alternates: {
      canonical: `https://www.meme-studio.io/create/${params.slug}`
    }
  }
}

export async function generateStaticParams() {
  const memesPromises = await Promise.all(
    locales.map((locale) => {
      return getMemes({ locale })
    })
  )

  return memesPromises.flat().map((meme) => {
    const slug = getMemeSlug(meme)

    return {
      slug
    }
  })
}

const Page = async ({
  params
}: PagePropsWithLocaleParams<{ params: { slug: string } }>) => {
  unstable_setRequestLocale(params.locale)
  const locale = useLocale() as Locale

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
