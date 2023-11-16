import React from 'react'
import { shallow } from 'zustand/shallow'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { EditorContext } from '@stores/Editor/editor.store'

export function useHistory() {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(
    store,
    (state) => {
      const { history, historyIndex, undo, redo } = state

      return {
        undo,
        redo,
        canUndo: historyIndex - 1 >= 0 && Boolean(history[historyIndex - 1]),
        canRedo: historyIndex + 1 > 0 && Boolean(history[historyIndex + 1])
      } as const
    },
    shallow
  )
}

export function useHistoryVersion() {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(
    store,
    (state) => {
      const { history, historyIndex } = state

      return history[historyIndex]?.version || ''
    },
    shallow
  )
}
