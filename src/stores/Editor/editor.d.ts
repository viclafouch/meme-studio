type Tab = 'gallery' | 'customization'

type EditorState = {
  meme: Nullable<Meme>
  texts: MemeText[]
  currentTab: Tab
  setCurrentTab: (newTab: Tab) => void
  updateText: (textId: MemeText['id'], text: MemeText) => void
}
