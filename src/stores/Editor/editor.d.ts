type Tab = 'gallery' | 'customization'

type EditorState = {
  meme: Nullable<Meme>
  currentTab: Tab
  setCurrentTab: (newTab: Tab) => void
}
