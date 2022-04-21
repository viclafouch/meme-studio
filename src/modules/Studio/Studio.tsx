import React from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import Header from '@components/Header/Header'
import { Meme } from '@models/Meme'
import { getMeme } from '@shared/api/memes'
import { useWindowSize } from '@shared/hooks/useWindowSize'
import { EditorProvider } from '@stores/Editor/editor.store'

import Aside from './components/Aside/Aside'
import Canvas from './components/Canvas/Canvas'
import MemeContainer from './components/MemeContainer/MemeContainer'
import Tools from './components/Tools/Tools'
import Styled from './studio.styled'

const CreatePage = () => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const windowSize = useWindowSize()

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
    <Styled.Page>
      {windowSize.height && windowSize.width ? (
        <EditorProvider
          windowHeight={windowSize.height}
          windowWidth={windowSize.width}
          key={meme?.id}
          textBoxes={meme ? meme.texts : []}
          meme={meme ? new Meme(meme) : null}
        >
          <Header />
          <Styled.Studio>
            <Tools />
            <Styled.DefaultContainer ref={containerRef}>
              <MemeContainer>
                <Canvas />
              </MemeContainer>
            </Styled.DefaultContainer>
            <Aside />
          </Styled.Studio>
        </EditorProvider>
      ) : null}
    </Styled.Page>
  )
}

export default CreatePage
