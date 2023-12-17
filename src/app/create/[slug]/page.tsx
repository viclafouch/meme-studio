import React from 'react'
import { Metadata } from 'next'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { notFound, redirect, RedirectType } from 'next/navigation'
import CreatePage from 'modules/Studio'
import { getMeme, getMemes } from '@shared/api/memes'
import { Meme } from '@viclafouch/meme-studio-utilities/schemas'
import {
  getMemeIdFromSlug,
  getMemeSlug
} from '@viclafouch/meme-studio-utilities/utils'

type PageProps = { params: { slug: string } }

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = params
  const id = getMemeIdFromSlug(slug)

  const meme = await getMeme(id)

  return {
    title: meme.name,
    alternates: {
      canonical: `https://www.meme-studio.io/create/${params.slug}`
    }
  }
}

export async function generateStaticParams() {
  const memes = await getMemes()

  return memes.map((meme) => {
    const slug = getMemeSlug(meme)

    return {
      slug
    }
  })
}

const Page = async ({ params }: PageProps) => {
  const id = getMemeIdFromSlug(params.slug)

  let meme: Meme

  try {
    meme = await getMeme(id)
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
