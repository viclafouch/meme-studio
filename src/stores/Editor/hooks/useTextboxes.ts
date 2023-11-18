import React from 'react'
import { useStore } from 'zustand'
import { shallow } from 'zustand/shallow'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { EditorContext } from '@stores/Editor/editor.store'

export function useTextboxes() {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(
    store,
    (state) => {
      const {
        textboxes,
        updateTextbox,
        addTextbox,
        removeItem,
        duplicateItem
      } = state

      return {
        textboxes,
        updateTextbox,
        addTextbox,
        removeItem,
        duplicateItem
      } as const
    },
    shallow
  )
}

export function useRatiotedTextboxes() {
  const store = React.useContext(EditorContext)

  return useStore(store, (state) => {
    return state.getScaledTextsByMemeSize
  })
}

export function useCountTextboxes() {
  const store = React.useContext(EditorContext)

  return useStore(store, (state) => {
    return state.textboxes.length
  })
}
