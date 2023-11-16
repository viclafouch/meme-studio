import React from 'react'
import { Meme } from 'models/Meme'
import { createStore, StoreApi } from 'zustand'
import { randomId } from '@shared/helpers/string'
import { TextBox } from '@shared/schemas/textbox'
import {
  addText,
  duplicateItem,
  eraseAllTexts,
  getScaledTextsByMemeSize,
  redo,
  removeItem,
  resetAll,
  setCurrentTab,
  setItemIdSelected,
  setResize,
  toggleItemIdSelected,
  toggleShowTextAreas,
  undo,
  updateText
} from './editor.actions'
import { EditorState } from './editor.types'

type EditorProviderProps = {
  meme: Meme | null
  textBoxes: TextBox[]
  children: React.ReactNode
}

export const EditorContext = React.createContext<StoreApi<EditorState>>(
  undefined as never
)

const createInitialStore = (
  initialMeme: Nullable<Meme>,
  initialTextboxes: TextBox[]
) => {
  return createStore<EditorState>((set, get) => {
    const itemIdSelected = initialTextboxes[0]?.id ?? null

    return {
      meme: initialMeme ? new Meme(initialMeme) : null,
      texts: initialTextboxes,
      getScaledTextsByMemeSize: getScaledTextsByMemeSize(get),
      history: [
        {
          texts: initialTextboxes,
          itemIdSelected,
          version: randomId()
        }
      ],
      historyIndex: 0,
      calculByAspectRatio: (value) => {
        return value
      },
      aspectRatio: 1,
      showTextAreas: true,
      itemIdSelected,
      currentTab: initialMeme ? 'customization' : 'gallery',
      canvasDimensions: {
        height: 0,
        width: 0
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
      updateText: updateText(set),
      undo: undo(set),
      redo: redo(set)
    }
  })
}

type BearStore = ReturnType<typeof createInitialStore>

const EditorProvider = ({ children, meme, textBoxes }: EditorProviderProps) => {
  const storeRef = React.useRef<BearStore>()

  if (!storeRef.current) {
    storeRef.current = createInitialStore(meme, textBoxes)
  }

  return (
    <EditorContext.Provider value={storeRef.current}>
      {children}
    </EditorContext.Provider>
  )
}

export { EditorProvider }
