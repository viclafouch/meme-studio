import React from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import Header from '@components/Header/Header'
import { getMeme } from '@shared/api/memes'
import { useResizeObserver } from '@shared/hooks/useResizeObserver'

import Aside from './components/Aside/Aside'
import Canvas from './components/Canvas/Canvas'
import EmptyContainer from './components/EmptyContainer/EmptyContainer'
import MemeContainer from './components/MemeContainer/MemeContainer'
import Tools from './components/Tools/Tools'
import Styled from './studio.styled'

const CreatePage = () => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const dimensions = useResizeObserver(containerRef)
  const router = useRouter()
  const { data: meme } = useQuery(
    ['memes', router.query.memeId],
    () => {
      return getMeme(router.query.memeId as Meme['id'])
    },
    {
      enabled: Boolean(router.query.memeId)
    }
  )

  return (
    <Styled.Page title={meme?.translations.en.name}>
      <Header />
      <Styled.Studio>
        <Tools />
        <Styled.DefaultContainer ref={containerRef}>
          {meme ? (
            <MemeContainer meme={meme}>
              <Canvas meme={meme} dimensions={dimensions} />
            </MemeContainer>
          ) : (
            <EmptyContainer />
          )}
        </Styled.DefaultContainer>
        <Aside />
      </Styled.Studio>
    </Styled.Page>
  )
}

export default CreatePage
