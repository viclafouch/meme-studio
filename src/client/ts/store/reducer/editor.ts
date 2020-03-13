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
  SET_HISTORY
} from './constants'
import { EditorState } from '../EditorContext'
import TextBox from '@client/ts/shared/models/TextBox'
import { DrawProperties, HistoryInt } from '@client/ts/shared/validators'
import { randomID } from '@shared/utils'
import { INITIAL } from '@client/ts/shared/constants'
import { debug } from '@client/utils/index'

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
    texts = texts.map((text: TextBox) => ({
      ...text,
      height: (text.height / oldHeight) * drawProperties.height,
      width: (text.width / oldWidth) * drawProperties.width,
      centerX: (text.centerX / oldWidth) * drawProperties.width,
      centerY: (text.centerY / oldHeight) * drawProperties.height
    }))
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
      text.id = randomID()
      return text
    })
    draft.drawProperties = drawProperties
    draft.history.currentIndex = index
    if (eraseAll) {
      saveToHistory(draft, {
        drawProperties,
        texts: draft.texts,
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
      text.id = randomID()
      return text
    })
    draft.drawProperties = drawProperties
    draft.history.currentIndex = index
  }
}

const EditorReducer = (state: EditorState, action: Actions): EditorState => {
  const draft: Draft<EditorState> = createDraft(state)
  let textIndex: number
  switch (action.type) {
    case SET_MEME_SELECTED:
      draft.memeSelected = action.memeSelected
      updateDrawing(draft, action.texts)
      saveToHistory(draft, {
        drawProperties: draft.drawProperties,
        texts: draft.texts,
        type: INITIAL
      })
      break
    case RESIZE_WINDOW:
      draft.innerDimensions = action.innerDimensions
      if (draft.memeSelected) updateDrawing(draft)
      break
    case SET_SHOW_TEXT_AREAS:
      draft.showTextAreas = action.showTextAreas
      break
    case SET_TEXT_ID_SELECTED:
      draft.textIdSelected = action.textIdSelected
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
      draft.texts.splice(textIndex, 1)
      break
    case UNDO_HISTORY:
      undoHistory(draft)
      break
    case SET_HISTORY:
      saveToHistory(draft, {
        drawProperties: draft.drawProperties,
        texts: draft.texts,
        type: action.historyType
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
      draft.texts = []
      clearHistory(draft)
      break
  }

  const stateUpdated: any = finishDraft(draft)
  debug(`EDITOR REDUCER: ${action.type}`, { stateUpdated })
  return stateUpdated
}

export default EditorReducer
