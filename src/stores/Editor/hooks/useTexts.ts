import React from 'react'
import * as R from 'ramda'
import { useStore } from 'zustand'
import { shallow } from 'zustand/shallow'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { TextBox } from '@shared/schemas/textbox'
import { EditorContext } from '@stores/Editor/editor.store'

export function useTexts() {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(
    store,
    (state) => {
      const { texts, updateText, addText, removeItem, duplicateItem } = state

      return { texts, updateText, addText, removeItem, duplicateItem } as const
    },
    shallow
  )
}

export function useRatiotedTexts() {
  const store = React.useContext(EditorContext)

  return useStore(store, (state) => {
    return state.getRatiotedTexts
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

  return useStoreWithEqualityFn(
    store,
    (state) => {
      const { texts, updateText, addText, duplicateItem } = state

      const text = R.find((textBox) => {
        return textBox.id === textId
      }, texts) as TextBox

      return {
        text,
        updateText,
        addText,
        duplicateItem
      }
    },
    shallow
  )
}
