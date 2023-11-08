import React from 'react'
import { dehydrate, QueryClient } from 'react-query'
import { NextPage } from 'next'
import CreatePage from 'modules/Studio/Studio'
import { getMemes } from '@shared/api/memes'

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery('memes', getMemes)

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const Create: NextPage = () => {
  return <CreatePage />
}

export default Create
