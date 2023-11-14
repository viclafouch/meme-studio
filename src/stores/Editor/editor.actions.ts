import { Draft, produce } from 'immer'
import * as R from 'ramda'
import { StoreApi } from 'zustand'
import { randomId } from '@shared/helpers/string'
import { debounce } from '@shared/helpers/timeout'
import { createTextBox, TextBox, updateVersion } from '@shared/schemas/textbox'
import { Dimensions, EditorState, Tab } from './editor.types'

function getCanvasDimensions(windowSizes: Dimensions) {
  return {
    width: windowSizes.width - 54 - 320 - 198,
    height: windowSizes.height - 80 - 100
  }
}

const saveHistory = debounce((set: StoreApi<EditorState>['setState']) => {
  set(
    produce((draft: Draft<EditorState>) => {
      draft.history.push({
        texts: draft.texts.map(updateVersion),
        itemIdSelected: draft.itemIdSelected
      })
      draft.currentTab = 'customization'
      draft.historyIndex++
    })
  )
}, 1000)

export function setCurrentTab(set: StoreApi<EditorState>['setState']) {
  return (newTab: Tab) => {
    return set(
      produce((draft: Draft<EditorState>) => {
        draft.currentTab = newTab
      })
    )
  }
}

export function setResize(set: StoreApi<EditorState>['setState']) {
  return (windowSizes: Dimensions) => {
    return set(
      produce((draft: Draft<EditorState>) => {
        draft.canvasDimensions = getCanvasDimensions(windowSizes)
      })
    )
  }
}

export function updateText(set: StoreApi<EditorState>['setState']) {
  return (textId: TextBox['id'], values: Partial<TextBox>) => {
    return set(
      produce((draft: Draft<EditorState>) => {
        const textIndex = R.findIndex((textBox) => {
          return textId === textBox.id
        }, draft.texts)
        draft.texts[textIndex] = {
          ...(draft.texts[textIndex] as TextBox),
          ...values
        }

        saveHistory(set)
      })
    )
  }
}

export function toggleShowTextAreas(set: StoreApi<EditorState>['setState']) {
  return () => {
    return set(
      produce((draft: Draft<EditorState>) => {
        draft.showTextAreas = !draft.showTextAreas
      })
    )
  }
}

export function eraseAllTexts(set: StoreApi<EditorState>['setState']) {
  return () => {
    return set(
      produce((draft: Draft<EditorState>) => {
        draft.showTextAreas = true
        draft.texts = []
      })
    )
  }
}

export function resetAll(set: StoreApi<EditorState>['setState']) {
  return () => {
    return set(
      produce((draft: Draft<EditorState>) => {
        draft.showTextAreas = true
        draft.texts = []
        draft.meme = null
        draft.history = []
        draft.historyIndex = 0
      })
    )
  }
}

export function toggleItemIdSelected(set: StoreApi<EditorState>['setState']) {
  return (itemId: TextBox['id']) => {
    return set(
      produce((draft: Draft<EditorState>) => {
        draft.itemIdSelected = draft.itemIdSelected === itemId ? null : itemId
      })
    )
  }
}

export function setItemIdSelected(set: StoreApi<EditorState>['setState']) {
  return (itemId: TextBox['id'], value: boolean) => {
    return set(
      produce((draft: Draft<EditorState>) => {
        draft.itemIdSelected = value ? itemId : null
      })
    )
  }
}

export function addText(set: StoreApi<EditorState>['setState']) {
  return (values: Partial<TextBox> = {}) => {
    return set(
      produce((draft: Draft<EditorState>) => {
        const { meme, ratio } = draft

        if (!meme) {
          return
        }

        const textbox = createTextBox({
          width: ratio(meme.width * 0.33),
          height: ratio(meme.height * 0.33),
          centerX: ratio(meme.width / 2),
          centerY: ratio(meme.height / 2),
          ...values
        })

        draft.itemIdSelected = textbox.id
        draft.texts.push(textbox)

        saveHistory(set)
      })
    )
  }
}

export function removeItem(set: StoreApi<EditorState>['setState']) {
  return (itemId: string) => {
    return set(
      produce((draft: Draft<EditorState>) => {
        if (draft.itemIdSelected === itemId) {
          draft.itemIdSelected = null
        }

        draft.texts = draft.texts.filter((text) => {
          return text.id !== itemId
        })

        saveHistory(set)
      })
    )
  }
}

export function duplicateItem(set: StoreApi<EditorState>['setState']) {
  return (itemId: string) => {
    return set(
      produce((draft: Draft<EditorState>) => {
        const item = draft.texts.find((textbox) => {
          return textbox.id === itemId
        })

        if (item) {
          const newItem = {
            ...item,
            id: randomId()
          }
          draft.texts.push(newItem)
          draft.itemIdSelected = newItem.id
        }

        saveHistory(set)
      })
    )
  }
}

export function getRatiotedTexts(get: StoreApi<EditorState>['getState']) {
  return (): TextBox[] => {
    const { texts, canvasDimensions, meme } = get()

    if (!meme) {
      return []
    }

    const memeWidth = meme.width
    const memeHeight = meme.height

    return texts.map((text) => {
      return {
        ...text,
        centerX: Math.round(
          (text.centerX / canvasDimensions.width) * memeWidth
        ),
        centerY: Math.round(
          (text.centerY / canvasDimensions.height) * memeHeight
        ),
        width: Math.round((text.width / canvasDimensions.width) * memeWidth),
        height: Math.round((text.height / canvasDimensions.height) * memeHeight)
      }
    })
  }
}

export function undo(set: StoreApi<EditorState>['setState']) {
  return () => {
    return set(
      produce((draft: Draft<EditorState>) => {
        const { historyIndex } = draft

        const newHistoryIndex = historyIndex - 1
        const previousHistory = draft.history[newHistoryIndex]

        if (previousHistory) {
          draft.historyIndex = newHistoryIndex
          draft.texts = previousHistory.texts
          draft.itemIdSelected = previousHistory.itemIdSelected
        }
      })
    )
  }
}

export function redo(set: StoreApi<EditorState>['setState']) {
  return () => {
    return set(
      produce((draft: Draft<EditorState>) => {
        const { historyIndex } = draft

        const newHistoryIndex = historyIndex + 1
        const nextHistory = draft.history[newHistoryIndex]

        if (nextHistory) {
          draft.historyIndex = newHistoryIndex
          draft.texts = nextHistory.texts
          draft.itemIdSelected = nextHistory.itemIdSelected
        }
      })
    )
  }
}
