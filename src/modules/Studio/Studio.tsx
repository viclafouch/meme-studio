import React from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import Header from '@components/Header/Header'
import { Meme } from '@models/Meme'
import { getMeme } from '@shared/api/memes'
import { textboxSchema } from '@shared/schemas/textbox'
import { EditorProvider } from '@stores/Editor/editor.store'
import Aside from './components/Aside/Aside'
import Canvas from './components/Canvas/Canvas'
import MemeContainer from './components/MemeContainer/MemeContainer'
import Tools from './components/Tools/Tools'
import Styled from './studio.styled'

const CreatePage = () => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const router = useRouter()
  const { data } = useQuery(
    ['memes', router.query.memeId],
    () => {
      const meme = getMeme(router.query.memeId as Meme['id'])

      return {
        meme: meme ? new Meme(meme) : null,
        textboxes: meme
          ? meme.texts.map((text) => {
              return textboxSchema.parse({
                ...text,
                properties: text
              })
            })
          : []
      }
    },
    {
      enabled: Boolean(router.query.memeId)
    }
  )

  const { meme = null, textboxes = [] } = data || {}

  return (
    <Styled.Page>
      <EditorProvider key={meme?.id} textBoxes={textboxes} meme={meme}>
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
    </Styled.Page>
  )
}

export default CreatePage
