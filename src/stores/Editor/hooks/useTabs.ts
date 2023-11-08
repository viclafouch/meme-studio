import React from 'react'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { EditorContext } from '@stores/Editor/editor.store'
import { EditorState } from '../editor'

type UseTabReturn = [EditorState['currentTab'], EditorState['setCurrentTab']]

export function useTab(): UseTabReturn {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(store, (state) => {
    return [state.currentTab, state.setCurrentTab]
  })
}
