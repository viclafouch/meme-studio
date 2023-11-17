import { Meme } from '@models/Meme'
import { TextBox } from '@shared/schemas/textbox'

export type Tab = 'gallery' | 'customization'

export type Dimensions = {
  width: number
  height: number
}

type EditorActions = {
  setCurrentTab: (newTab: Tab) => void
  toggleShowTextAreas: () => void
  eraseAllTexts: () => void
  resetAll: () => void
  resize: (dimensions: Dimensions) => void
  addText: (values?: Partial<TextBox>) => void
  removeItem: (itemId: string) => void
  calculByAspectRatio: (value: number) => number
  duplicateItem: (itemId: string) => void
  toggleItemIdSelected: (itemId: TextBox['id']) => void
  setItemIdSelected: (itemId: TextBox['id'], value: boolean) => void
  updateText: (textId: Meme['id'], text: Partial<Meme>) => void
  undo: () => void
  redo: () => void
}

export type EditorState = {
  meme: Meme | null
  texts: TextBox[]
  currentTab: Tab
  aspectRatio: number
  historyIndex: number
  itemIdSelected: TextBox['id'] | null
  history: History[]
  getScaledTextsByMemeSize: () => TextBox[]
  showTextAreas: boolean
  canvasDimensions: {
    width: number
    height: number
  }
} & EditorActions

export type History = Pick<EditorState, 'itemIdSelected' | 'texts'>
