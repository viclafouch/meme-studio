import { Meme } from '@models/Meme'

export type Tab = 'gallery' | 'customization'

export type EditorState = {
  meme: Meme | null
  texts: TextBox[]
  currentTab: Tab
  setCurrentTab: (newTab: Tab) => void
  toggleShowTextAreas: () => void
  updateText: (textId: Meme['id'], text: Partial<Meme>) => void
  ratio: (value: number) => number
  showTextAreas: boolean
  canvasDimensions: {
    width: number
    height: number
  }
}
