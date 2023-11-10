import { Meme } from '@models/Meme'

export type Tab = 'gallery' | 'customization'

type EditorActions = {
  setCurrentTab: (newTab: Tab) => void
  toggleShowTextAreas: () => void
  eraseAllTexts: () => void
  resetAll: () => void
  toggleItemIdSelected: (itemId: TextBox['id']) => void
  setItemIdSelected: (itemId: TextBox['id'], value: boolean) => void
  updateText: (textId: Meme['id'], text: Partial<Meme>) => void
}

export type EditorState = {
  meme: Meme | null
  texts: TextBox[]
  currentTab: Tab
  itemIdSelected: TextBox['id'] | null
  ratio: (value: number) => number
  showTextAreas: boolean
  canvasDimensions: {
    width: number
    height: number
  }
} & EditorActions
