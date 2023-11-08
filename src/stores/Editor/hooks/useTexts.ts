import React from 'react'
import * as R from 'ramda'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { EditorContext } from '@stores/Editor/editor.store'
import { EditorState } from '../editor'

type UseTextsReturn = [EditorState['texts'], EditorState['updateText']]

export function useTexts(): UseTextsReturn {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(store, (state) => {
    return [state.texts, state.updateText]
  })
}

type UseTextReturn = [TextBox, EditorState['updateText']]

export function useText(textId: TextBox['id']): UseTextReturn {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(store, (state) => {
    return [
      R.find((textBox) => {
        return textBox.id === textId
      }, state.texts) as TextBox,
      state.updateText
    ]
  })
}
