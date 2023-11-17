import { Draft, produce } from 'immer'
import * as R from 'ramda'
import { StoreApi } from 'zustand'
import { randomId } from '@shared/helpers/string'
import { debounce } from '@shared/helpers/timeout'
import { createTextBox, TextBox } from '@shared/schemas/textbox'
import { calculateAspectRatioFit } from '@shared/utils/canvas'
import { calculBaseByMemeSize, calculScaledValues } from '@shared/utils/textbox'
import { Dimensions, EditorState, Tab } from './editor.types'

const saveHistory = debounce((set: StoreApi<EditorState>['setState']) => {
  set(
    produce((draft: Draft<EditorState>) => {
      draft.history.push({
        texts: draft.texts,
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
  return (containerCanvasSize: Dimensions) => {
    return set(
      produce((draft: Draft<EditorState>) => {
        if (draft.meme) {
          const { width, height, aspectRatio } = calculateAspectRatioFit(
            draft.meme.width,
            draft.meme.height,
            containerCanvasSize.width,
            containerCanvasSize.height
          )
          draft.canvasDimensions = {
            width,
            height
          }

          const calculByAspectRatio = (value: number) => {
            return value * aspectRatio
          }

          draft.aspectRatio = aspectRatio
          draft.calculByAspectRatio = calculByAspectRatio

          // Lets repositionning our textbox by their base
          draft.texts = draft.texts.map((textDraft) => {
            return {
              ...textDraft,
              ...calculScaledValues(textDraft, calculByAspectRatio)
            }
          })

          // Lets do the same for history
          draft.history = draft.history.map((history) => {
            return {
              ...history,
              texts: history.texts.map((textDraft) => {
                return {
                  ...textDraft,
                  ...calculScaledValues(textDraft, calculByAspectRatio)
                }
              })
            }
          })
        }
      })
    )
  }
}

export function updateText(set: StoreApi<EditorState>['setState']) {
  return (textId: TextBox['id'], values: Partial<TextBox>) => {
    return set(
      produce((draft: Draft<EditorState>) => {
        const { canvasDimensions, meme } = draft
        const textIndex = R.findIndex((textBox) => {
          return textId === textBox.id
        }, draft.texts)

        let textDraft = draft.texts[textIndex]

        if (textDraft && meme) {
          textDraft = {
            ...textDraft,
            ...values
          }
          textDraft.base = calculBaseByMemeSize(
            textDraft,
            canvasDimensions,
            meme
          )
          draft.texts[textIndex] = textDraft
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
        const { meme, calculByAspectRatio } = draft

        if (!meme) {
          return
        }

        const textbox = createTextBox({
          width: calculByAspectRatio(meme.width * 0.33),
          height: calculByAspectRatio(meme.height * 0.33),
          centerX: calculByAspectRatio(meme.width / 2),
          centerY: calculByAspectRatio(meme.height / 2),
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

export function getScaledTextsByMemeSize(
  get: StoreApi<EditorState>['getState']
) {
  return (): TextBox[] => {
    const { texts } = get()

    // Just need to override values by the base itself (proportionate by meme sizes)
    return texts.map((text) => {
      return R.mergeRight(text, text.base)
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
