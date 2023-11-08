import React from 'react'
import { useStore } from 'zustand'
import { EditorContext } from '@stores/Editor/editor.store'

export function useMeme() {
  const store = React.useContext(EditorContext)

  return useStore(store, (state) => {
    return state.meme
  })
}
