import React from 'react'
import { GetStaticPaths, GetStaticPropsContext } from 'next'
import CreatePage from 'modules/Studio/Studio'
import { Meme } from '@models/Meme'
import { getMeme, getMemes } from '@shared/api/memes'
import { dehydrate, QueryClient } from '@tanstack/react-query'

type Params = {
  memeId: Meme['id']
}

export const getStaticPaths = (() => {
  return {
    paths: [],
    fallback: true
  }
}) satisfies GetStaticPaths

export async function getStaticProps(context: GetStaticPropsContext<Params>) {
  const { params } = context
  const memeId = params?.memeId as Meme['id']
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['memes', 10],
      queryFn: () => {
        return getMemes()
      }
    }),
    queryClient.prefetchQuery({
      queryKey: ['meme', memeId],
      queryFn: () => {
        return getMeme(memeId)
      }
    })
  ])

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const Create = () => {
  return <CreatePage />
}

export default Create
