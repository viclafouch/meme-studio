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

export function useRatiotedTexts() {
  const store = React.useContext(EditorContext)

  return useStore(store, (state) => {
    return state.getScaledTextsByMemeSize
  })
}

export function useCountTexts() {
  const store = React.useContext(EditorContext)

  return useStore(store, (state) => {
    return state.textboxes.length
  })
}

export function useText(textId: TextBox['id']) {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(
    store,
    (state) => {
      const { textboxes, updateTextbox, addTextbox, duplicateItem } = state

      const text = R.find((textbox) => {
        return textbox.id === textId
      }, textboxes) as TextBox

      return {
        text,
        updateTextbox,
        addTextbox,
        duplicateItem
      }
    },
    shallow
  )
}
