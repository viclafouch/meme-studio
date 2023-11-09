import { Meme } from '@models/Meme'

export type Tab = 'gallery' | 'customization'

export type EditorState = {
  meme: Meme | null
  texts: TextBox[]
  currentTab: Tab
  setCurrentTab: (newTab: Tab) => void
  updateText: (textId: MemeText['id'], text: Partial<MemeText>) => void
  ratio: (value: number) => number
  canvasDimensions: {
    width: number
    height: number
  }
}
