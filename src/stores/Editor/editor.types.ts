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
  addText: (values?: Partial<TextBox>) => void
  removeItem: (itemId: string) => void
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
  historyIndex: number
  itemIdSelected: TextBox['id'] | null
  ratio: (value: number) => number
  history: History[]
  getRatiotedTexts: () => TextBox[]
  showTextAreas: boolean
  canvasDimensions: {
    width: number
    height: number
  }
} & EditorActions

export type History = Pick<EditorState, 'itemIdSelected' | 'texts'>
