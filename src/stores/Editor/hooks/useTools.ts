import React from 'react'
import { shallow } from 'zustand/shallow'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { EditorContext } from '@stores/Editor/editor.store'

export function useTools() {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(
    store,
    (state) => {
      const {
        isVisibleDraggables,
        toggleVisibleDraggables,
        eraseAllItems,
        resetAll
      } = state

      return {
        isVisibleDraggables,
        toggleVisibleDraggables,
        eraseAllItems,
        resetAll
      } as const
    },
    shallow
  )
}
