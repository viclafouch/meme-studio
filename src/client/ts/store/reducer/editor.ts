import { Draft, createDraft, finishDraft } from 'immer'
import {
  SET_SHOW_TEXT_AREAS,
  SET_MEME_SELECTED,
  RESIZE_WINDOW,
  UNDO_HISTORY,
  REDO_HISTORY,
  CUSTOM_TEXT,
  ADD_ITEM,
  REMOVE_ITEM,
  SET_ITEM_ID_SELECTED,
  ERASE_ALL,
  RESET,
  SET_HISTORY,
  TOGGLE_EXPORT_MODAL,
  SET_CURRENT_TAB,
  CUSTOM_IMAGE,
  DUPLICATE_ITEM
} from './constants'
import { EditorState } from '../EditorContext'
import TextBox from '@client/ts/shared/models/TextBox'
import { DrawProperties, HistoryInt } from '@client/ts/shared/validators'
import { INITIAL, TAB_GALLERY, TAB_CUSTOMIZATION } from '@client/ts/shared/constants'
import { debug, setLocalStorage, removeLocalStorage } from '@client/utils/index'
import { hasRecoverVersion } from '@client/utils/helpers'
import ImageBox from '@client/ts/shared/models/ImageBox'
import { createText } from '@client/ts/shared/config-editor'
import { randomID } from '@shared/utils'

export interface Actions extends Partial<EditorState> {
  type: string
  historyType: string
  text?: TextBox
  image?: any
  itemId?: TextBox['id'] | ImageBox['id']
  itemType?: 'text' | 'image'
}

const updateDrawing = (draft: Draft<EditorState>, texts: Array<TextBox> = draft.texts): void => {
  let currentWidth: number = draft.memeSelected.width
  let currentHeight: number = draft.memeSelected.height
  let ratioW = 1
  let ratioH = 1

  if (currentWidth > draft.innerDimensions.width) {
    ratioW = draft.innerDimensions.width / currentWidth
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

const undoHistory = (draft: Draft<EditorState>): void => {
  const index = draft.history.currentIndex - 1
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

    draft.itemIdSelected = previousItem.itemIdSelected
    draft.drawProperties = drawProperties
    draft.history.currentIndex = index
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

    draft.itemIdSelected = nextItem.itemIdSelected

    draft.drawProperties = drawProperties
    draft.history.currentIndex = index
  }
}

const EditorReducer = (state: EditorState, action: Actions): EditorState => {
  const draft: Draft<EditorState> = createDraft(state)
  let textIndex: number
  let imageIndex: number
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
        itemIdSelected: draft.itemIdSelected,
        type: INITIAL
      })
      break
    case RESIZE_WINDOW:
      const firstLoad = draft.innerDimensions.width === 0
      draft.innerDimensions = action.innerDimensions
      if (firstLoad) {
        const lastVersion = hasRecoverVersion()
        if (lastVersion) {
          const { memeSelected, history } = lastVersion
          draft.memeSelected = memeSelected
          draft.history = history
          draft.history.items = draft.history.items.map(i => {
            i.drawProperties.image = memeSelected.image
            return i
          })

          const currentVersion = history.items[history.currentIndex]

          draft.itemIdSelected = currentVersion.itemIdSelected

          const texts = currentVersion.texts

          updateDrawing(draft, texts)
        }
      } else if (draft.memeSelected) updateDrawing(draft)
      break
    case SET_SHOW_TEXT_AREAS:
      draft.showTextAreas = action.showTextAreas
      break
    case SET_ITEM_ID_SELECTED:
      draft.itemIdSelected = action.itemIdSelected
      draft.currentTab = TAB_CUSTOMIZATION
      break
    case SET_CURRENT_TAB:
      draft.currentTab = action.currentTab
      break
    case CUSTOM_TEXT:
      textIndex = draft.texts.findIndex(text => text.id === action.text.id)
      draft.texts[textIndex] = action.text
      break
    case CUSTOM_IMAGE:
      imageIndex = draft.images.findIndex(image => image.id === action.image.id)
      draft.images[imageIndex] = action.image
      break
    case ADD_ITEM:
      if (action.itemType === 'text') {
        const text = createText({
          centerY: draft.memeSelected.height / 2,
          centerX: draft.memeSelected.width / 2,
          height: draft.memeSelected.height * (33 / 100),
          width: draft.memeSelected.width * (33 / 100)
        })
        text.height = text.base.height * draft.drawProperties.scale
        text.width = text.base.width * draft.drawProperties.scale
        text.centerY = text.base.centerY * draft.drawProperties.scale
        text.centerX = text.base.centerX * draft.drawProperties.scale
        draft.texts.push(text)
      }
      break
    case DUPLICATE_ITEM:
      if (action.itemType === 'text') {
        const textDuplicated = draft.texts.find(text => text.id === action.itemId)
        const text = new TextBox({
          ...textDuplicated,
          id: randomID()
        })
        text.version = `${Date.now()}-${text.id}`
        draft.texts.push(text)
      } else {
        const imageDuplicated = draft.images.find(image => image.id === action.itemId)
        const image = new ImageBox({
          ...imageDuplicated,
          id: randomID()
        })
        image.version = `${Date.now()}-${image.id}`
        draft.images.push(image)
      }
      break
    case REMOVE_ITEM:
      if (action.itemType === 'text') {
        textIndex = draft.texts.findIndex(text => text.id === action.itemId)
        draft.texts.splice(textIndex, 1)
      } else {
        imageIndex = draft.images.findIndex(image => image.id === action.itemId)
        draft.texts.splice(imageIndex, 1)
      }
      if (action.itemId === draft.itemIdSelected) draft.itemIdSelected = null
      break
    case UNDO_HISTORY:
      undoHistory(draft)
      break
    case SET_HISTORY:
      saveToHistory(draft, {
        drawProperties: draft.drawProperties,
        texts: draft.texts,
        type: action.historyType,
        itemIdSelected: draft.itemIdSelected
      })
      break
    case REDO_HISTORY:
      redoHistory(draft)
      break
    case ERASE_ALL:
      draft.itemIdSelected = null
      draft.texts = []
      clearHistory(draft)
      break
    case RESET:
      draft.itemIdSelected = null
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
      history: draft.history
    })
  } else if ([RESET, ERASE_ALL].includes(action.type)) {
    removeLocalStorage(['memeSelected', 'history', 'lastEditDate'])
  }

  const stateUpdated: EditorState = finishDraft(draft) as any
  debug(`EDITOR REDUCER: ${action.type}`, { stateUpdated })
  return stateUpdated
}

export default EditorReducer
