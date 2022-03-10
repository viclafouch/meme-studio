import React from 'react'
import { useWindowSize } from '@shared/hooks/useWindowSize'
import produce, { Draft } from 'immer'
import * as R from 'ramda'
import create from 'zustand'
import createContext from 'zustand/context'

import { setCurrentTab, setResize, setText } from './editor.actions'

type EditorProviderProps = {
  meme: Nullable<Meme>
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
  initialWindowSizes: Dimensions
) => {
  return create<EditorState>((set, get) => {
    return {
      meme: initialMeme ? {
        ...initialMeme,
        height: 
      } : null,
      ratio: (value) => {
        return value * get().canvasDimensions.height
      },
      canvasDimensions: getCanvasDimensions(initialWindowSizes),
      texts: initialMeme ? initialMeme.texts : [],
      currentTab: initialMeme ? 'customization' : 'gallery',
      setCurrentTab: setCurrentTab(set),
      resize: setResize(set),
      updateText: setText(set)
    }
  })
}

const EditorProvider = (props: EditorProviderProps) => {
  const { children, meme } = props
  const windowSize = useWindowSize()
  const [createStore] = React.useState(() => {
    return () => {
      return createInitialStore(meme, windowSize)
    }
  })

  return <Provider createStore={createStore}>{children}</Provider>
}

export { EditorProvider, useStore as useEditorStore }
