import React from 'react'
import { Metadata } from 'next'
import CreatePage from 'modules/Studio'
import { getMeme, getMemes } from '@shared/api/memes'

type PageProps = { params: { id: string } }

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { id } = params

  const { meme } = await getMeme(id)

  return {
    title: meme?.translations.fr.name
  }
}

export async function generateStaticParams() {
  const memes = await getMemes()

  return memes.map((meme) => {
    return {
      id: meme.id
    }
  })
}

const Page = async ({ params }: PageProps) => {
  const meme = await getMeme(params.id)

  // @ts-expect-error
  return <CreatePage meme={meme.meme} textboxes={meme.textboxes} />
}

export default Page
