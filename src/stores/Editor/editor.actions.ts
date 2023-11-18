import { Draft, produce } from 'immer'
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
        textboxes: draft.textboxes,
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

          // Lets repositionning our textbox by their baseProperties
          draft.textboxes = draft.textboxes.map((textboxDraft) => {
            textboxDraft.properties = {
              ...textboxDraft.properties,
              ...calculScaledValues(textboxDraft, calculByAspectRatio)
            }

            return textboxDraft
          }) as TextBox[]

          // Lets do the same for history
          draft.history = draft.history.map((history) => {
            return {
              ...history,
              texts: history.textboxes.map((textboxDraft) => {
                return {
                  ...textboxDraft,
                  ...calculScaledValues(textboxDraft, calculByAspectRatio)
                }
              })
            }
          })
        }
      })
    )
  }
}

export function updateTextboxProperties(
  set: StoreApi<EditorState>['setState']
) {
  return (
    textboxId: TextBox['id'],
    properties: Partial<TextBox['properties']>
  ) => {
    return set(
      produce((draft: Draft<EditorState>) => {
        const { canvasDimensions, meme } = draft
        const textIndex = draft.textboxes.findIndex((textbox) => {
          return textboxId === textbox.id
        })

        const textboxDraft = draft.textboxes[textIndex]

        if (textboxDraft && meme) {
          textboxDraft.properties = {
            ...textboxDraft.properties,
            ...properties
          }
          textboxDraft.baseProperties = calculBaseByMemeSize(
            textboxDraft,
            canvasDimensions,
            meme
          )
          draft.itemIdSelected = textboxId
          draft.textboxes[textIndex] = textboxDraft
        }

        saveHistory(set)
      })
    )
  }
}

export function toggleVisibleDraggables(
  set: StoreApi<EditorState>['setState']
) {
  return () => {
    return set(
      produce((draft: Draft<EditorState>) => {
        draft.isVisibleDraggables = !draft.isVisibleDraggables
      })
    )
  }
}

export function eraseAllItems(set: StoreApi<EditorState>['setState']) {
  return () => {
    return set(
      produce((draft: Draft<EditorState>) => {
        draft.isVisibleDraggables = true
        draft.textboxes = []
      })
    )
  }
}

export function resetAll(set: StoreApi<EditorState>['setState']) {
  return () => {
    return set(
      produce((draft: Draft<EditorState>) => {
        draft.isVisibleDraggables = true
        draft.textboxes = []
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

export function addTextbox(set: StoreApi<EditorState>['setState']) {
  return () => {
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
          centerY: calculByAspectRatio(meme.height / 2)
        })

        draft.itemIdSelected = textbox.id
        draft.textboxes.push(textbox)

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

        draft.textboxes = draft.textboxes.filter((textbox) => {
          return textbox.id !== itemId
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
        const item = draft.textboxes.find((textbox) => {
          return textbox.id === itemId
        })

        if (item) {
          const newItem = {
            ...item,
            id: randomId()
          }
          draft.textboxes.push(newItem)
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
    const { textboxes } = get()

    // Just need to override values by the baseProperties itself (proportionate by meme sizes)
    return textboxes.map((textbox) => {
      return {
        ...textbox,
        ...textbox.baseProperties
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
          draft.textboxes = previousHistory.textboxes
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
          draft.textboxes = nextHistory.textboxes
          draft.itemIdSelected = nextHistory.itemIdSelected
        }
      })
    )
  }
}
