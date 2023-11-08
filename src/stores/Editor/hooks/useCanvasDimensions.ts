import React from 'react'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { EditorContext } from '@stores/Editor/editor.store'
import { EditorState } from '../editor'

type UseCanvasDimensionsReturn = [EditorState['canvasDimensions']]

export function useCanvasDimensions(): UseCanvasDimensionsReturn {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(store, (state) => {
    return [state.canvasDimensions]
  })
}
