import React from 'react'
import produce, { Draft } from 'immer'
import * as R from 'ramda'
import create from 'zustand'
import createContext from 'zustand/context'

type EditorProviderProps = {
  meme: Nullable<Meme>
  children: React.ReactNode
}

const { Provider, useStore } = createContext<EditorState>()

const EditorProvider = (props: EditorProviderProps) => {
  const { children, meme } = props
  const [createStore] = React.useState(() => {
    return () => {
      return create<EditorState>((set) => {
        return {
          meme,
          texts: meme ? meme.texts : [],
          currentTab: meme ? 'customization' : 'gallery',
          setCurrentTab: (newTab: Tab) => {
            return set(
              produce((draft: Draft<EditorState>) => {
                draft.currentTab = newTab
              })
            )
          },
          updateText: (textId: MemeText['id'], text: MemeText) => {
            return set(
              produce((draft: Draft<EditorState>) => {
                const textIndex = R.findIndex((memeText) => {
                  return textId === memeText.id
                }, draft.texts)
                draft.texts[textIndex] = text
              })
            )
          }
        }
      })
    }
  })

  return <Provider createStore={createStore}>{children}</Provider>
}

export { EditorProvider, useStore as useEditorStore }
