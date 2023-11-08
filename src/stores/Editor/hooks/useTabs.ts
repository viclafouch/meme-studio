import shallow from 'zustand/shallow'
import { useEditorStore } from '@stores/Editor/editor.store'
import { EditorState } from '../editor'

type UseTab = [EditorState['currentTab'], EditorState['setCurrentTab']]

export function useTab(): UseTab {
  return useEditorStore((state) => {
    return [state.currentTab, state.setCurrentTab]
  }, shallow)
}
