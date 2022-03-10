import { useEditorStore } from '@stores/Editor/editor.store'
import shallow from 'zustand/shallow'

type UseCanvasDimensionsReturn = [
  EditorState['canvasDimensions'],
  EditorState['resize']
]
export function useCanvasDimensions(): UseCanvasDimensionsReturn {
  return useEditorStore((state) => {
    return [state.canvasDimensions, state.resize]
  }, shallow)
}
