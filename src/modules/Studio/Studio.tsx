import React from 'react'
import Header from '@components/Header/Header'
import { EditorProvider } from '@stores/Editor/Editor.provider'
import StudioBody from '@studio/components/StudioBody'
import { Box } from '@styled-system/jsx'
import { Meme, TextBox } from '@viclafouch/meme-studio-utilities/schemas'

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
