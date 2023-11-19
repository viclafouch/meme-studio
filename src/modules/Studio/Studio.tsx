import React from 'react'
import { useRouter } from 'next/router'
import Header from '@components/Header/Header'
import { Meme } from '@models/Meme'
import { getMeme } from '@shared/api/memes'
import EditorProvider from '@stores/Editor/editor.store'
import StudioBody from '@studio/components/StudioBody'
import { useQuery } from '@tanstack/react-query'
import Styled from './Studio.styled'

const StudioPage = () => {
  const router = useRouter()
  const { memeId } = router.query

  const { data } = useQuery({
    queryKey: ['memes', memeId],
    queryFn: () => {
      return getMeme(memeId as Meme['id'])
    },
    enabled: Boolean(memeId)
  })

  const { meme = null, textboxes = [] } = data || {}

  return (
    <Styled.Page>
      <EditorProvider
        key={meme?.id}
        textBoxes={textboxes}
        meme={meme ? new Meme(meme) : null}
      >
        <Header />
        <StudioBody />
      </EditorProvider>
    </Styled.Page>
  )
}

export default StudioPage
