import React from 'react'
import { getAspectRatio } from '@shared/helpers/dom'
import { Meme } from 'models/Meme'
import * as R from 'ramda'
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
    width: windowSizes.width - 54 - 320 - 198 - 4,
    height: windowSizes.height - 80 - 100
  }
}

function getRatio(meme: Nullable<Meme>, dimensions: Dimensions) {
  if (!meme) {
    return (val: number) => {
      return val
    }
  }
  const aspectRatio = getAspectRatio(
    meme.width,
    meme.height,
    dimensions.width,
    dimensions.height
  )
  return R.pipe(R.multiply(aspectRatio), Math.round)
}

const createInitialStore = (
  initialMeme: Nullable<Meme>,
  initialTextboxes: TextBox[],
  initialWindowSizes: Dimensions
) => {
  return create<EditorState>((set) => {
    const ratio = getRatio(initialMeme, initialWindowSizes)
    return {
      meme: initialMeme ? new Meme(initialMeme) : null,
      texts: initialTextboxes.map((textbox) => {
        return {
          ...textbox,
          height: ratio(textbox.height),
          width: ratio(textbox.width),
          centerY: ratio(textbox.centerY),
          centerX: ratio(textbox.centerX)
        }
      }),
      ratio,
      currentTab: initialMeme ? 'customization' : 'gallery',
      canvasDimensions: {
        height: initialMeme ? ratio(initialMeme.height) : 0,
        width: initialMeme ? ratio(initialMeme.width) : 0
      },
      setCurrentTab: setCurrentTab(set),
      resize: setResize(set),
      updateText: setText(set)
    }
  })
}

const EditorProvider = (props: EditorProviderProps) => {
  const { children, meme, windowWidth, windowHeight, textBoxes } = props
  const wrapperDimensions = getCanvasDimensions({
    height: windowHeight,
    width: windowWidth
  })

  const [createStore] = React.useState(() => {
    return () => {
      return createInitialStore(meme, textBoxes, wrapperDimensions)
    }
  })

  return <Provider createStore={createStore}>{children}</Provider>
}

export { EditorProvider, useStore as useEditorStore }
