import shallow from 'zustand/shallow'
import { useEditorStore } from '@stores/Editor/editor.store'
import { EditorState } from '../editor'

type UseCanvasDimensionsReturn = [EditorState['canvasDimensions']]

export function useCanvasDimensions(): UseCanvasDimensionsReturn {
  return useEditorStore((state) => {
    return [state.canvasDimensions]
  }, shallow)
}
