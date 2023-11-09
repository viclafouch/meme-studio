import React from 'react'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { EditorContext } from '@stores/Editor/editor.store'

export function useCanvasDimensions() {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(store, (state) => {
    return state.canvasDimensions
  })
}
