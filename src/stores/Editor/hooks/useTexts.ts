import { TextBox } from '@models/TextBox'
import { useEditorStore } from '@stores/Editor/editor.store'
import * as R from 'ramda'
import shallow from 'zustand/shallow'

type UseTextsReturn = [EditorState['texts'], EditorState['updateText']]

export function useTexts(): UseTextsReturn {
  return useEditorStore((state) => {
    return [state.texts, state.updateText]
  }, shallow)
}

type UpdaterFn = (old: TextBox) => Partial<TextBox>

export type SetValues = (values: UpdaterFn | ReturnType<UpdaterFn>) => void

type UseTextReturn = [TextBox, SetValues]

export function useText(textId: TextBox['id']): UseTextReturn {
  return useEditorStore((state) => {
    const text = R.find((textBox) => {
      return textBox.id === textId
    }, state.texts) as TextBox

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
