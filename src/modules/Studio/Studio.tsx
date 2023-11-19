import React from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import Header from '@components/Header/Header'
import { Meme } from '@models/Meme'
import { getMeme } from '@shared/api/memes'
import { textboxSchema } from '@shared/schemas/textbox'
import EditorProvider from '@stores/Editor/editor.store'
import StudioBody from '@studio/components/StudioBody'
import Styled from './Studio.styled'

const CreatePage = () => {
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
        <StudioBody />
      </EditorProvider>
    </Styled.Page>
  )
}

export default CreatePage
