import { Meme, TextBox } from '@viclafouch/meme-studio-utilities/schemas'

export type Tab = 'gallery' | 'customization'

export type Dimensions = {
  width: number
  height: number
}

type EditorActions = {
  setCurrentTab: (newTab: Tab) => void
  toggleVisibleDraggables: () => void
  eraseAllItems: () => void
  resetAll: () => void
  resize: (dimensions: Dimensions) => void
  addTextbox: (values?: Partial<TextBox>) => void
  removeItem: (itemId: string) => void
  calculByAspectRatio: (value: number) => number
  duplicateItem: (itemId: string) => void
  toggleItemIdSelected: (itemId: TextBox['id']) => void
  setItemIdSelected: (itemId: TextBox['id'], value: boolean) => void
  updateTextbox: (
    textId: Meme['id'],
    text: Partial<TextBox['properties']>
  ) => void
  undo: () => void
  redo: () => void
}

export type EditorState = {
  meme: Meme | null
  textboxes: TextBox[]
  currentTab: Tab
  aspectRatio: number
  historyIndex: number
  itemIdSelected: TextBox['id'] | null
  history: History[]
  getScaledTextsByMemeSize: () => TextBox[]
  isVisibleDraggables: boolean
  canvasDimensions: {
    width: number
    height: number
  }
} & EditorActions

export type History = Pick<EditorState, 'itemIdSelected' | 'textboxes'>
