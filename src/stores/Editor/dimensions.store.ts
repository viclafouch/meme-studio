import produce, { Draft } from 'immer'
import create from 'zustand'

type DimensionsStore = {
  dimensions: Dimensions
  resize: (dimensions: Dimensions) => void
}

const useDimensionsStore = create<DimensionsStore>((set) => {
  return {
    dimensions: {
      width: 0,
      height: 0
    },
    resize: (dimensions: Dimensions) => {
      set(
        produce((draft: Draft<DimensionsStore>) => {
          draft.dimensions = dimensions
        })
      )
    }
  }
})

export { useDimensionsStore }
