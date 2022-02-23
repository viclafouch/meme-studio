import { useEditorStore } from '@stores/Editor/editor.store'
import shallow from 'zustand/shallow'

type UseTextsReturn = [EditorState['texts'], EditorState['updateText']]

export function useTexts(): UseTextsReturn {
  return useEditorStore((state) => {
    return [state.texts, state.updateText]
  }, shallow)
}
