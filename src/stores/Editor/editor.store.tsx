import React from 'react'
import { Meme } from 'models/Meme'
import * as R from 'ramda'
import { createStore, StoreApi } from 'zustand'
import { getAspectRatio } from '@shared/helpers/dom'
import { EditorState } from './editor'
import { setCurrentTab, setResize, setText } from './editor.actions'

type EditorProviderProps = {
  meme: Nullable<Meme>
  textBoxes: TextBox[]
  windowWidth: number
  windowHeight: number
  children: React.ReactNode
}

export const EditorContext = React.createContext<StoreApi<EditorState>>(
  undefined as never
)

function getCanvasDimensions(windowSizes: Dimensions) {
  return {
    width: windowSizes.width - 54 - 320 - 198 - 4,
    height: windowSizes.height - 80 - 100
  }
}

function getRatio(meme: Nullable<Meme>, dimensions: Dimensions) {
  if (!meme) {
    return (value: number) => {
      return value
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
  return createStore<EditorState>((set) => {
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

  // eslint-disable-next-line react/hook-use-state
  const [store] = React.useState(() => {
    return createInitialStore(meme, textBoxes, wrapperDimensions)
  })

  return (
    <EditorContext.Provider value={store}>{children}</EditorContext.Provider>
  )
}

export { EditorProvider }
