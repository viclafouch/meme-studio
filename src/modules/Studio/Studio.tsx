import React from 'react'
import Header from '@components/Header/Header'
import { Meme } from '@models/Meme'
import { TextBox } from '@shared/schemas/textbox'
import EditorProvider from '@stores/Editor/editor.store'
import StudioBody from '@studio/components/StudioBody'
import { Box } from '@styled-system/jsx'

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
    <Box h="100vh" w="full">
      <EditorProvider key={meme?.id} textBoxes={textboxes} meme={meme || null}>
        <Header />
        <StudioBody />
      </EditorProvider>
    </Box>
  )
}

export default StudioPage
