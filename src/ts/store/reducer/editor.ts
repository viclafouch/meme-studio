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
import TextBox from '@shared/models/TextBox'
import { createText } from '@shared/config-editor'
import { DrawProperties, HistoryInt } from '@shared/validators'
import { randomID } from '@utils/index'
import { INITIAL } from '@shared/constants'

export interface Actions extends EditorState {
  type: string
  historyType: string
  text: TextBox
}

const updateDrawing = (state: Draft<EditorState>, texts: Array<TextBox> = state.texts): void => {
  let currentWidth: number = state.memeSelected.width
  let currentHeight: number = state.memeSelected.height
  let ratioW = 1
  let ratioH = 1

  if (currentWidth > state.innerDimensions.width) {
    ratioW = state.innerDimensions.width / state.memeSelected.width
    currentWidth = state.innerDimensions.width
    currentHeight = state.memeSelected.height * ratioW
  }

  if (currentHeight > state.innerDimensions.height) {
    ratioH = state.innerDimensions.height / currentHeight
    currentWidth = currentWidth * ratioH
    currentHeight = currentHeight * ratioH
  }

  const scale: number = Math.min(currentWidth / state.memeSelected.width, currentHeight / state.memeSelected.height)

  state.texts = [...Array(2)].map((t: TextBox) => {
    const text = createText({
      centerY: 50,
      centerX: 340,
      height: 100,
      width: 680
    })
    text.height = text.base.height * scale
    text.width = text.base.width * scale
    text.centerY = text.base.centerY * scale
    text.centerX = text.base.centerX * scale
    return text
  })

  state.drawProperties = {
    width: currentWidth,
    height: currentHeight,
    image: state.memeSelected.image,
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

const saveToHistory = (state: Draft<EditorState>, history: HistoryInt): void => {
  let index: number
  if (state.history.currentIndex <= 0) index = 1
  else index = state.history.currentIndex + 1
  state.history.items = [...(history.type === INITIAL ? [] : state.history.items)].slice(0, index)
  state.history.items.push(history)
  state.history.currentIndex = history.type === INITIAL ? 0 : state.history.items.length - 1
}

const clearHistory = (state: Draft<EditorState>): void => {
  state.history.items = []
  state.history.currentIndex = -1
}

const undoHistory = (state: Draft<EditorState>, eraseAll = false): void => {
  const index: number = eraseAll ? 0 : state.history.currentIndex - 1
  const previousItem = state.history.items[index]

  if (previousItem) {
    const { drawProperties, texts } = checkSize({
      oldProperties: previousItem.drawProperties,
      newProperties: state.drawProperties,
      texts: previousItem.texts
    })
    state.texts = texts.map((text: TextBox) => {
      text.id = randomID()
      return text
    })
    state.drawProperties = drawProperties
    state.history.currentIndex = index
    if (eraseAll) {
      saveToHistory(state, {
        drawProperties,
        texts: state.texts,
        type: INITIAL
      })
    }
  }
}

const redoHistory = (state: Draft<EditorState>): void => {
  const index: number = state.history.currentIndex + 1
  const nextItem = state.history.items[index]
  if (nextItem) {
    const { drawProperties, texts } = checkSize({
      oldProperties: nextItem.drawProperties,
      newProperties: state.drawProperties,
      texts: nextItem.texts
    })
    state.texts = texts.map((text: TextBox) => {
      text.id = randomID()
      return text
    })
    state.drawProperties = drawProperties
    state.history.currentIndex = index
  }
}

const EditorReducer = (draft: EditorState, action: Actions): any => {
  const state = createDraft(draft)
  let textIndex: number
  switch (action.type) {
    case SET_MEME_SELECTED:
      state.memeSelected = action.memeSelected
      updateDrawing(state, action.texts)
      saveToHistory(state, {
        drawProperties: state.drawProperties,
        texts: state.texts,
        type: INITIAL
      })
      break
    case RESIZE_WINDOW:
      state.innerDimensions = action.innerDimensions
      if (state.memeSelected) updateDrawing(state)
      break
    case SET_SHOW_TEXT_AREAS:
      state.showTextAreas = action.showTextAreas
      break
    case SET_TEXT_ID_SELECTED:
      state.textIdSelected = action.textIdSelected
      break
    case CUSTOM_TEXT:
      textIndex = state.texts.findIndex(text => text.id === action.text.id)
      state.texts[textIndex] = action.text
      break
    case ADD_TEXT:
      state.texts.push(action.text)
      break
    case REMOVE_TEXT:
      textIndex = state.texts.findIndex(text => text.id === action.text.id)
      state.texts.splice(textIndex, 1)
      break
    case UNDO_HISTORY:
      undoHistory(state)
      break
    case SET_HISTORY:
      saveToHistory(state, {
        drawProperties: state.drawProperties,
        texts: state.texts,
        type: action.historyType
      })
      break
    case REDO_HISTORY:
      redoHistory(state)
      break
    case ERASE_ALL:
      undoHistory(state, true)
      break
    case RESET:
      state.textIdSelected = null
      state.memeSelected = null
      state.texts = []
      clearHistory(state)
      break
  }

  const result = finishDraft(state)
  console.log(action.type, { result })
  return result
}

export default EditorReducer
