import React from 'react'
import { Metadata } from 'next'
import CreatePage from 'modules/Studio'
import { getMeme, getMemes } from '@shared/api/memes'

type PageProps = { params: { id: string } }

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { id } = params

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const meme = await getMeme(id)

  return {
    title: 'test'
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

  return <CreatePage meme={meme} textboxes={meme.textboxes} />
}

export default Page
