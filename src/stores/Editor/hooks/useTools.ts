import React from 'react'
import { shallow } from 'zustand/shallow'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { EditorContext } from '@stores/Editor/editor.store'

export function useTools() {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(
    store,
    (state) => {
      const { showTextAreas, toggleShowTextAreas, eraseAllTexts, resetAll } =
        state

      return {
        showTextAreas,
        toggleShowTextAreas,
        eraseAllTexts,
        resetAll
      } as const
    },
    shallow
  )
}
