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
import { hasRecoverVersion, calculateAspectRatioFit } from '@client/utils/helpers'
import ImageBox from '@client/ts/shared/models/ImageBox'
import { createText } from '@client/ts/shared/config-editor'
import { randomID } from '@shared/utils'

export interface Actions extends Partial<EditorState> {
  type: string
  historyType?: string
  text?: TextBox
  image?: ImageBox
  img?: HTMLImageElement
  itemId?: TextBox['id'] | ImageBox['id']
  itemType?: 'text' | 'image'
}

const updateDrawing = (draft: Draft<EditorState>): void => {
  let canvasWidth = draft.memeSelected.width
  let canvasHeight = draft.memeSelected.height

  if (canvasWidth > draft.innerDimensions.width || canvasHeight > draft.innerDimensions.height) {
    const { width, height } = calculateAspectRatioFit(
      draft.memeSelected.width,
      draft.memeSelected.height,
      draft.innerDimensions.width,
      draft.innerDimensions.height
    )
    canvasWidth = width
    canvasHeight = height
  }

  const scale = Math.min(canvasWidth / draft.memeSelected.width, canvasHeight / draft.memeSelected.height)

  draft.texts = draft.texts.map((text: TextBox) => {
    text.height = text.base.height * scale
    text.width = text.base.width * scale
    text.centerY = text.base.centerY * scale
    text.centerX = text.base.centerX * scale
    return text
  })

  draft.images = draft.images.map((image: ImageBox) => {
    image.height = image.base.height * scale
    image.width = image.base.width * scale
    image.centerY = image.base.centerY * scale
    image.centerX = image.base.centerX * scale
    return image
  })

  draft.drawProperties = {
    image: draft.memeSelected.image,
    width: canvasWidth,
    height: canvasHeight,
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
  const previousItem: HistoryInt = draft.history.items[index]

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

    draft.images = previousItem.images.map((image: ImageBox) => {
      image.version = `${Date.now()}-${image.id}`
      return image
    })

    draft.itemIdSelected = previousItem.itemIdSelected
    draft.drawProperties = drawProperties
    draft.history.currentIndex = index
  }
}

const redoHistory = (draft: Draft<EditorState>): void => {
  const index: number = draft.history.currentIndex + 1
  const nextItem: HistoryInt = draft.history.items[index]
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

    draft.images = nextItem.images.map((image: ImageBox) => {
      image.version = `${Date.now()}-${image.id}`
      return image
    })

    draft.itemIdSelected = nextItem.itemIdSelected
    draft.images = nextItem.images
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
      draft.texts = action.texts
      if (draft.texts.length > 0) {
        draft.itemIdSelected = draft.texts[0].id
      }
      draft.images = []
      updateDrawing(draft)
      saveToHistory(draft, {
        drawProperties: draft.drawProperties,
        texts: draft.texts,
        images: [],
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

          if (history.currentIndex !== -1) {
            draft.itemIdSelected = currentVersion.itemIdSelected
            draft.texts = currentVersion.texts
          }

          updateDrawing(draft)
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
          height: draft.memeSelected.height * 0.33,
          width: draft.memeSelected.width * 0.33
        })
        text.height = text.base.height * draft.drawProperties.scale
        text.width = text.base.width * draft.drawProperties.scale
        text.centerY = text.base.centerY * draft.drawProperties.scale
        text.centerX = text.base.centerX * draft.drawProperties.scale

        draft.itemIdSelected = text.id
        draft.texts.push(text)
      } else {
        const img = action.img
        const { width, height } = calculateAspectRatioFit(
          img.width,
          img.height,
          draft.drawProperties.width * 0.9,
          draft.drawProperties.height * 0.9
        )

        const image = new ImageBox({
          id: randomID(),
          rotate: 0,
          centerY: draft.drawProperties.height / 2,
          centerX: draft.drawProperties.width / 2,
          width,
          name: img.name,
          keepRatio: true,
          height,
          src: img.src
        })

        draft.itemIdSelected = image.id
        draft.images.push(image)
      }
      break
    case DUPLICATE_ITEM:
      if (action.itemType === 'text') {
        const textDuplicated = draft.texts.find(text => text.id === action.itemId)
        const text = new TextBox({
          ...textDuplicated,
          base: { ...textDuplicated.base },
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
        draft.images.splice(imageIndex, 1)
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
        images: draft.images,
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
      draft.images = []
      draft.history.items = [
        {
          drawProperties: draft.drawProperties,
          texts: [],
          images: [],
          itemIdSelected: null,
          type: INITIAL
        }
      ]
      draft.history.currentIndex = 0
      break
    case RESET:
      draft.itemIdSelected = null
      draft.memeSelected = null
      draft.drawProperties = null
      draft.texts = []
      draft.images = []
      draft.currentTab = TAB_GALLERY
      clearHistory(draft)
      break
  }

  if (action.type === RESET || (draft.memeSelected && draft.memeSelected.localImageUrl)) {
    removeLocalStorage(['memeSelected', 'history', 'lastEditDate'])
  } else if (
    [UNDO_HISTORY, REDO_HISTORY, SET_HISTORY, SET_MEME_SELECTED, ERASE_ALL].includes(action.type) &&
    draft.memeSelected
  ) {
    const isIncludesImages = draft.history.items.some(item => item.images.length > 0)
    if (isIncludesImages) {
      const initalItem = draft.history.items.find(item => item.type === INITIAL)
      if (initalItem) {
        removeLocalStorage(['memeSelected', 'history', 'lastEditDate'])
      } else {
        setLocalStorage({
          memeSelected: draft.memeSelected,
          lastEditDate: Date.now(),
          history: {
            items: [
              {
                drawProperties: draft.drawProperties,
                texts: [],
                images: [],
                itemIdSelected: null,
                type: INITIAL
              }
            ],
            currentIndex: 0
          }
        })
      }
    } else {
      setLocalStorage({
        memeSelected: draft.memeSelected,
        lastEditDate: Date.now(),
        history: draft.history
      })
    }
  }

  const stateUpdated: EditorState = finishDraft(draft) as any
  debug(`EDITOR REDUCER: ${action.type}`, { stateUpdated })
  return stateUpdated
}

export default EditorReducer
