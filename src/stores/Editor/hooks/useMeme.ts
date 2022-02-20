import { useEditorStore } from '@stores/Editor/editor.store'

export function useMeme() {
  return useEditorStore((state) => {
    return state.meme
  })
}
