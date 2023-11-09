import React from 'react'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { EditorContext } from '@stores/Editor/editor.store'

export function useTools() {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(store, (state) => {
    const { showTextAreas, toggleShowTextAreas } = state

    return {
      showTextAreas,
      toggleShowTextAreas
    } as const
  })
}
