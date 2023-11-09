import React from 'react'
import * as R from 'ramda'
import { useStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { EditorContext } from '@stores/Editor/editor.store'

export function useTexts() {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(store, (state) => {
    return [state.texts, state.updateText] as const
  })
}

export function useCountTexts() {
  const store = React.useContext(EditorContext)

  return useStore(store, (state) => {
    return state.texts.length
  })
}

export function useText(textId: TextBox['id']) {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(store, (state) => {
    return [
      R.find((textBox) => {
        return textBox.id === textId
      }, state.texts) as TextBox,
      state.updateText
    ] as const
  })
}
