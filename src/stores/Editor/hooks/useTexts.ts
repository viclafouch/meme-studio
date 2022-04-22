import { useEditorStore } from '@stores/Editor/editor.store'
import * as R from 'ramda'
import shallow from 'zustand/shallow'

type UseTextsReturn = [EditorState['texts'], EditorState['updateText']]

export function useTexts(): UseTextsReturn {
  return useEditorStore((state) => {
    return [state.texts, state.updateText]
  }, shallow)
}

type UseTextReturn = [TextBox, EditorState['updateText']]

export function useText(textId: TextBox['id']): UseTextReturn {
  return useEditorStore((state) => {
    return [
      R.find((textBox) => {
        return textBox.id === textId
      }, state.texts) as TextBox,
      state.updateText
    ]
  }, shallow)
}
