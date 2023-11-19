import React from 'react'
import { Meme } from 'models/Meme'
import { createStore, StoreApi } from 'zustand'
import { randomId } from '@shared/helpers/string'
import { TextBox } from '@shared/schemas/textbox'
import {
  addTextbox,
  duplicateItem,
  eraseAllItems,
  getScaledTextsByMemeSize,
  redo,
  removeItem,
  resetAll,
  setCurrentTab,
  setItemIdSelected,
  setResize,
  toggleItemIdSelected,
  toggleVisibleDraggables,
  undo,
  updateTextboxProperties
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
      textboxes: initialTextboxes,
      getScaledTextsByMemeSize: getScaledTextsByMemeSize(get),
      history: [
        {
          textboxes: initialTextboxes,
          itemIdSelected,
          version: randomId()
        }
      ],
      historyIndex: 0,
      calculByAspectRatio: (value) => {
        return value
      },
      aspectRatio: 1,
      isVisibleDraggables: true,
      itemIdSelected,
      currentTab: initialMeme ? 'customization' : 'gallery',
      canvasDimensions: {
        height: 0,
        width: 0
      },
      setCurrentTab: setCurrentTab(set),
      toggleVisibleDraggables: toggleVisibleDraggables(set),
      eraseAllItems: eraseAllItems(set),
      resize: setResize(set),
      resetAll: resetAll(set),
      addTextbox: addTextbox(set),
      removeItem: removeItem(set),
      duplicateItem: duplicateItem(set),
      toggleItemIdSelected: toggleItemIdSelected(set),
      setItemIdSelected: setItemIdSelected(set),
      updateTextbox: updateTextboxProperties(set),
      undo: undo(set),
      redo: redo(set)
    }
  })
}

const EditorProvider = ({ children, meme, textBoxes }: EditorProviderProps) => {
  const storeRef = React.useRef<ReturnType<typeof createInitialStore>>()

  storeRef.current ??= createInitialStore(meme, textBoxes)

  return (
    <EditorContext.Provider value={storeRef.current}>
      {children}
    </EditorContext.Provider>
  )
}

export default EditorProvider
