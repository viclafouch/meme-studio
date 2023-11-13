import React from 'react'
import { Meme } from 'models/Meme'
import * as R from 'ramda'
import { createStore, StoreApi } from 'zustand'
import { getAspectRatio } from '@shared/helpers/dom'
import { TextBox } from '@shared/schemas/textbox'
import {
  addText,
  duplicateItem,
  eraseAllTexts,
  getRatiotedTexts,
  removeItem,
  resetAll,
  setCurrentTab,
  setItemIdSelected,
  setResize,
  setText,
  toggleItemIdSelected,
  toggleShowTextAreas
} from './editor.actions'
import { Dimensions, EditorState } from './editor.types'

type EditorProviderProps = {
  meme: Meme | null
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

function getRatio(
  meme: Meme,
  dimensions: ReturnType<typeof getCanvasDimensions>
) {
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
  return createStore<EditorState>((set, get) => {
    const ratio = initialMeme
      ? getRatio(initialMeme, initialWindowSizes)
      : (value: number) => {
          return value
        }

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
      getRatiotedTexts: getRatiotedTexts(get),
      ratio,
      showTextAreas: true,
      itemIdSelected: initialTextboxes[0]?.id ?? null,
      currentTab: initialMeme ? 'customization' : 'gallery',
      canvasDimensions: {
        height: initialMeme ? ratio(initialMeme.height) : 0,
        width: initialMeme ? ratio(initialMeme.width) : 0
      },
      setCurrentTab: setCurrentTab(set),
      toggleShowTextAreas: toggleShowTextAreas(set),
      eraseAllTexts: eraseAllTexts(set),
      resize: setResize(set),
      resetAll: resetAll(set),
      addText: addText(set),
      removeItem: removeItem(set),
      duplicateItem: duplicateItem(set),
      toggleItemIdSelected: toggleItemIdSelected(set),
      setItemIdSelected: setItemIdSelected(set),
      updateText: setText(set)
    }
  })
}

type BearStore = ReturnType<typeof createInitialStore>

const EditorProvider = (props: EditorProviderProps) => {
  const storeRef = React.useRef<BearStore>()
  const { children, meme, windowWidth, windowHeight, textBoxes } = props

  if (!storeRef.current) {
    const wrapperDimensions = getCanvasDimensions({
      height: windowHeight,
      width: windowWidth
    })
    storeRef.current = createInitialStore(meme, textBoxes, wrapperDimensions)
  }

  return (
    <EditorContext.Provider value={storeRef.current}>
      {children}
    </EditorContext.Provider>
  )
}

export { EditorProvider }
