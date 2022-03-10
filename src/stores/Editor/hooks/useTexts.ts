import { useEditorStore } from '@stores/Editor/editor.store'
import * as R from 'ramda'
import shallow from 'zustand/shallow'

type UseTextsReturn = [EditorState['texts'], EditorState['updateText']]

export function useTexts(): UseTextsReturn {
  return useEditorStore((state) => {
    return [state.texts, state.updateText]
  }, shallow)
}

type UpdaterFn = (old: MemeText) => Partial<MemeText>

export type SetValues = (values: UpdaterFn | ReturnType<UpdaterFn>) => void

type UseTextReturn = [MemeText, SetValues]

export function useText(textId: MemeText['id']): UseTextReturn {
  return useEditorStore((state) => {
    const text = R.find((memeText) => {
      return memeText.id === textId
    }, state.texts) as MemeText

    const matchIsUpdaterFunction = (input: unknown): input is UpdaterFn => {
      return typeof input === 'function'
    }

    const updater: SetValues = (stateUpdater) => {
      const newValues = matchIsUpdaterFunction(stateUpdater)
        ? stateUpdater(text)
        : stateUpdater
      state.updateText(textId, {
        ...text,
        ...newValues
      })
    }
    return [text, updater]
  }, shallow)
}
