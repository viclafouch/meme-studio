import React from 'react'
import Header from '@components/Header/Header'
import Page from '@components/Page'
import { Meme } from '@models/Meme'
import { TextBox } from '@shared/schemas/textbox'
import EditorProvider from '@stores/Editor/editor.store'
import StudioBody from '@studio/components/StudioBody'
import { css } from '@styled-system/css'

export type StudioPageProps = {
  meme?: Meme | null
  textboxes?: TextBox[]
}

const defaultTextboxes: TextBox[] = []

const StudioPage = ({
  meme = null,
  textboxes = defaultTextboxes
}: StudioPageProps) => {
  return (
    <Page className={css({ height: '100vh' })}>
      <EditorProvider key={meme?.id} textBoxes={textboxes} meme={meme || null}>
        <Header />
        <StudioBody />
      </EditorProvider>
    </Page>
  )
}

export default StudioPage
