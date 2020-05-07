import { Draft, createDraft, finishDraft } from 'immer'
import {
  SET_SHOW_TEXT_AREAS,
  SET_MEME_SELECTED,
  RESIZE_WINDOW,
  UNDO_HISTORY,
  REDO_HISTORY,
  CUSTOM_TEXT,
  ADD_TEXT,
  REMOVE_TEXT,
  SET_TEXT_ID_SELECTED,
  ERASE_ALL,
  RESET,
  SET_HISTORY,
  TOGGLE_EXPORT_MODAL,
  SET_CURRENT_TAB
} from './constants'
import { EditorState } from '../EditorContext'
import TextBox from '@client/ts/shared/models/TextBox'
import { DrawProperties, HistoryInt } from '@client/ts/shared/validators'
import { INITIAL, TAB_GALLERY, TAB_CUSTOMIZATION } from '@client/ts/shared/constants'
import { debug, setLocalStorage, removeLocalStorage } from '@client/utils/index'
import Meme from '@client/ts/shared/models/Meme'

export interface Actions extends EditorState {
  type: string
  historyType: string
  text: TextBox
}

const updateDrawing = (draft: Draft<EditorState>, texts: Array<TextBox> = draft.texts): void => {
  let currentWidth: number = draft.memeSelected.width
  let currentHeight: number = draft.memeSelected.height
  let ratioW = 1
  let ratioH = 1

  if (currentWidth > draft.innerDimensions.width) {
    ratioW = draft.innerDimensions.width / draft.memeSelected.width
    currentWidth = draft.innerDimensions.width
    currentHeight = draft.memeSelected.height * ratioW
  }

  if (currentHeight > draft.innerDimensions.height) {
    ratioH = draft.innerDimensions.height / currentHeight
    currentWidth = currentWidth * ratioH
    currentHeight = currentHeight * ratioH
  }

  const scale: number = Math.min(currentWidth / draft.memeSelected.width, currentHeight / draft.memeSelected.height)

  draft.texts = texts.map((t: TextBox) => {
    t.height = t.base.height * scale
    t.width = t.base.width * scale
    t.centerY = t.base.centerY * scale
    t.centerX = t.base.centerX * scale
    return t
  })

  draft.drawProperties = {
    width: currentWidth,
    height: currentHeight,
    image: draft.memeSelected.image,
    scale
  }
}

const checkSize = ({
  oldProperties,
  newProperties,
  texts
}: {
  oldProperties: DrawProperties
  newProperties: DrawProperties
  texts: Array<TextBox>
}): {
  drawProperties: DrawProperties
  texts: Array<TextBox>
} => {
  let drawProperties: DrawProperties
  if (oldProperties.scale !== newProperties.scale) {
    drawProperties = newProperties
    const oldWidth = oldProperties.width
    const oldHeight = oldProperties.height
    texts = texts.map(
      (text: TextBox) =>
        new TextBox({
          height: (text.height / oldHeight) * drawProperties.height,
          width: (text.width / oldWidth) * drawProperties.width,
          centerX: (text.centerX / oldWidth) * drawProperties.width,
          centerY: (text.centerY / oldHeight) * drawProperties.height
        })
    )
  } else {
    drawProperties = oldProperties
  }

  return { drawProperties, texts }
}

const saveToHistory = (draft: Draft<EditorState>, history: HistoryInt): void => {
  let index: number
  if (draft.history.currentIndex <= 0) index = 1
  else index = draft.history.currentIndex + 1
  draft.history.items = [...(history.type === INITIAL ? [] : draft.history.items)].slice(0, index)
  draft.history.items.push(history)
  draft.history.currentIndex = history.type === INITIAL ? 0 : draft.history.items.length - 1
}

const clearHistory = (draft: Draft<EditorState>): void => {
  draft.history.items = []
  draft.history.currentIndex = -1
}

const undoHistory = (draft: Draft<EditorState>, eraseAll = false): void => {
  const index: number = eraseAll ? 0 : draft.history.currentIndex - 1
  const previousItem = draft.history.items[index]

  if (previousItem) {
    const { drawProperties, texts } = checkSize({
      oldProperties: previousItem.drawProperties,
      newProperties: draft.drawProperties,
      texts: previousItem.texts
    })

    draft.texts = texts.map((text: TextBox) => {
      text.version = `${Date.now()}-${text.id}`
      return text
    })

    draft.textIdSelected = previousItem.textIdSelected

    draft.drawProperties = drawProperties
    draft.history.currentIndex = index
    if (eraseAll) {
      saveToHistory(draft, {
        drawProperties,
        texts: draft.texts,
        textIdSelected: draft.textIdSelected,
        type: INITIAL
      })
    }
  }
}

const redoHistory = (draft: Draft<EditorState>): void => {
  const index: number = draft.history.currentIndex + 1
  const nextItem = draft.history.items[index]
  if (nextItem) {
    const { drawProperties, texts } = checkSize({
      oldProperties: nextItem.drawProperties,
      newProperties: draft.drawProperties,
      texts: nextItem.texts
    })
    draft.texts = texts.map((text: TextBox) => {
      text.version = `${Date.now()}-${text.id}`
      return text
    })

    draft.textIdSelected = nextItem.textIdSelected

    draft.drawProperties = drawProperties
    draft.history.currentIndex = index
  }
}

const EditorReducer = (state: EditorState, action: Actions): EditorState => {
  const draft: Draft<EditorState> = createDraft(state)
  let textIndex: number
  switch (action.type) {
    case TOGGLE_EXPORT_MODAL:
      draft.isExportModalActive = !draft.isExportModalActive
      break
    case SET_MEME_SELECTED:
      draft.memeSelected = action.memeSelected
      updateDrawing(draft, action.texts)
      saveToHistory(draft, {
        drawProperties: draft.drawProperties,
        texts: draft.texts,
        textIdSelected: draft.textIdSelected,
        type: INITIAL
      })
      break
    case RESIZE_WINDOW:
      const firstLoad = draft.innerDimensions.width === 0
      draft.innerDimensions = action.innerDimensions
      if (firstLoad) {
        let memeSelected: any = window.localStorage.getItem('memeSelected')
        let history: any = window.localStorage.getItem('history')
        let lastEditDate: any = window.localStorage.getItem('lastEditDate')

        if (lastEditDate) {
          const now = new Date()
          lastEditDate = new Date(JSON.parse(lastEditDate))
          const hourDifference = Math.abs(now.getTime() - lastEditDate.getTime()) / 36e5

          if (hourDifference < 2) {
            memeSelected = new Meme(JSON.parse(memeSelected)) as Meme
            history = JSON.parse(history) as History

            draft.memeSelected = memeSelected
            draft.history = history
            draft.history.items = draft.history.items.map(i => {
              i.drawProperties.image = memeSelected.image
              return i
            })

            const currentVersion = history.items[history.currentIndex]
            const texts = currentVersion.texts

            updateDrawing(draft, texts)
          } else {
            removeLocalStorage(['memeSelected', 'history', 'lastEditDate', 'textIdSelected'])
          }
        }
      } else {
        if (draft.memeSelected) updateDrawing(draft)
      }
      break
    case SET_SHOW_TEXT_AREAS:
      draft.showTextAreas = action.showTextAreas
      break
    case SET_TEXT_ID_SELECTED:
      draft.textIdSelected = action.textIdSelected
      draft.currentTab = TAB_CUSTOMIZATION
      break
    case SET_CURRENT_TAB:
      draft.currentTab = action.currentTab
      break
    case CUSTOM_TEXT:
      textIndex = draft.texts.findIndex(text => text.id === action.text.id)
      draft.texts[textIndex] = action.text
      break
    case ADD_TEXT:
      draft.texts.push(action.text)
      break
    case REMOVE_TEXT:
      textIndex = draft.texts.findIndex(text => text.id === action.text.id)
      if (action.text.id === draft.textIdSelected) draft.textIdSelected = null
      draft.texts.splice(textIndex, 1)
      break
    case UNDO_HISTORY:
      undoHistory(draft)
      break
    case SET_HISTORY:
      saveToHistory(draft, {
        drawProperties: draft.drawProperties,
        texts: draft.texts,
        type: action.historyType,
        textIdSelected: draft.textIdSelected
      })
      break
    case REDO_HISTORY:
      redoHistory(draft)
      break
    case ERASE_ALL:
      undoHistory(draft, true)
      break
    case RESET:
      draft.textIdSelected = null
      draft.memeSelected = null
      draft.drawProperties = null
      draft.texts = []
      draft.currentTab = TAB_GALLERY
      clearHistory(draft)
      break
  }

  if ([UNDO_HISTORY, REDO_HISTORY, SET_HISTORY, SET_MEME_SELECTED].includes(action.type) && !draft.memeSelected.localImageUrl) {
    setLocalStorage({
      memeSelected: draft.memeSelected,
      lastEditDate: Date.now(),
      history: draft.history,
      textIdSelected: draft.textIdSelected
    })
  } else if ([RESET, ERASE_ALL].includes(action.type)) {
    removeLocalStorage(['memeSelected', 'history', 'lastEditDate', 'textIdSelected'])
  }

  const stateUpdated: EditorState = finishDraft(draft) as any
  debug(`EDITOR REDUCER: ${action.type}`, { stateUpdated })
  return stateUpdated
}

export default EditorReducer
