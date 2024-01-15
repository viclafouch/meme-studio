import React from 'react'
import ExportButton from '@components/ExportButton'
import Header from '@components/Header/Header'
import LocaleSelector from '@components/LocaleSelector'
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
    <Box h="100dvh" w="full" display="flex" flexDir="column" id="studio">
      <EditorProvider textBoxes={textboxes} meme={meme || null}>
        <Header
          actions={
            <>
              <LocaleSelector />
              <ExportButton />
            </>
          }
        />
        <StudioBody />
      </EditorProvider>
    </Box>
  )
}

export default StudioPage
