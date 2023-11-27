import React from 'react'
import { TextBox } from '@shared/schemas/textbox'

const inputRefs = new Map<TextBox['id'], React.RefObject<HTMLTextAreaElement>>()

export function useGlobalInputsRef() {
  return {
    getRef: React.useCallback((textboxId: TextBox['id']) => {
      return inputRefs.get(textboxId)
    }, []),
    setRef: React.useCallback((textboxId: TextBox['id']) => {
      const ref = React.createRef<HTMLTextAreaElement>()
      inputRefs.set(textboxId, ref)

      return ref
    }, [])
  }
}
