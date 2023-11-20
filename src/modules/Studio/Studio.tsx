'use client'

import React from 'react'
import Header from '@components/Header/Header'
import { Meme } from '@models/Meme'
import { getMeme } from '@shared/api/memes'
import { TextBox } from '@shared/schemas/textbox'
import EditorProvider from '@stores/Editor/editor.store'
import StudioBody from '@studio/components/StudioBody'
import { useQuery } from '@tanstack/react-query'
import Styled from './Studio.styled'

export type StudioPageProps = {
  meme?: Meme | null
  textboxes?: TextBox[]
}

const StudioPage = ({ meme = null, textboxes = [] }: StudioPageProps) => {
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
