import React from 'react'
import { NextPage } from 'next'
import CreatePage from 'modules/Studio'
import { getMemes } from '@shared/api/memes'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['memes'],
    queryFn: () => {
      return getMemes()
    }
  })

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
