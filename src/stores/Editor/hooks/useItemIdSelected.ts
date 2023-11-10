import React from 'react'
import { shallow } from 'zustand/shallow'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { EditorContext } from '@stores/Editor/editor.store'

export function useItemIdSelected() {
  const store = React.useContext(EditorContext)

  return useStoreWithEqualityFn(
    store,
    (state) => {
      const { itemIdSelected, toggleItemIdSelected, setItemIdSelected } = state

      return {
        itemIdSelected,
        toggleItemIdSelected,
        setItemIdSelected
      } as const
    },
    shallow
  )
}
