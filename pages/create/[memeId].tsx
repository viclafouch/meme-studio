import React from 'react'
import { dehydrate, DehydratedState, QueryClient } from 'react-query'
import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next'
import { getMeme, getMemes } from '@shared/api/memes'
import CreatePage from 'modules/Studio/Studio'

type Params = {
  memeId: Meme['id']
}

type Result = {
  dehydratedState: DehydratedState
}

export async function getStaticPaths() {
  const memes = await getMemes()

  return {
    paths: memes.map((meme) => {
      return {
        params: {
          memeId: meme.id
        }
      }
    }),
    fallback: true
  }
}

export async function getStaticProps(
  ctx: GetStaticPropsContext<Params>
): Promise<GetStaticPropsResult<Result>> {
  const { params } = ctx
  const memeId = params?.memeId as Meme['id']
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery('memes', getMemes)
  await queryClient.prefetchQuery(['memes', memeId], () => {
    return getMeme(memeId)
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const Create: NextPage<Result> = () => {
  return <CreatePage />
}

export default Create
