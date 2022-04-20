import React from 'react'
import { TextBox } from '@models/TextBox'
import { Meme } from 'models/Meme'
import create from 'zustand'
import createContext from 'zustand/context'

import { setCurrentTab, setResize, setText } from './editor.actions'

type EditorProviderProps = {
  meme: Nullable<Meme>
  textBoxes: TextBox[]
  windowWidth: number
  windowHeight: number
  children: React.ReactNode
}

const { Provider, useStore } = createContext<EditorState>()

function getCanvasDimensions(windowSizes: Dimensions) {
  return {
    width: windowSizes.width - 54 - 320 - 198,
    height: windowSizes.height - 80 - 100
  }
}

const createInitialStore = (
  initialMeme: Nullable<Meme>,
  initialTextboxes: TextBox[],
  initialWindowSizes: Dimensions
) => {
  return create<EditorState>((set) => {
    return {
      meme: initialMeme ? new Meme(initialMeme) : null,
      canvasDimensions: getCanvasDimensions(initialWindowSizes),
      texts: initialTextboxes,
      currentTab: 'customization',
      setCurrentTab: setCurrentTab(set),
      resize: setResize(set),
      updateText: setText(set)
    }
  })
}

const EditorProvider = (props: EditorProviderProps) => {
  const { children, meme, windowWidth, windowHeight, textBoxes } = props

  const [createStore] = React.useState(() => {
    return () => {
      return createInitialStore(meme, textBoxes, {
        height: windowHeight,
        width: windowWidth
      })
    }
  })

  return <Provider createStore={createStore}>{children}</Provider>
}

export { EditorProvider, useStore as useEditorStore }
