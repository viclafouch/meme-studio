import * as React from 'react'
import { useReducer } from 'react'
import { matchIsClientSide } from '@shared/helpers/dom'
import { useIsomorphicLayoutEffect } from '@shared/hooks/useIsomorphicLayoutEffect'
import defaultReducer from './default.reducer'

const getInitialThemeValue = () => {
  if (matchIsClientSide()) {
    const attr = document.documentElement.getAttribute(
      'data-theme'
    ) as Nullable<ThemeValue>

    if (attr === 'light' || attr === 'dark') {
      return attr
    }
  }

  return 'light'
}

const initialState: DefaultState = {
  theme: getInitialThemeValue()
}

export const DefaultContext = React.createContext<DefaultState>({} as never)

export type DefaultProviderProps = {
  children: React.ReactNode
}

export const DefaultProvider = ({
  children
}: DefaultProviderProps): JSX.Element => {
  const [state] = useReducer(defaultReducer, initialState)

  useIsomorphicLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem('theme', state.theme)
  }, [state.theme])

  return (
    <DefaultContext.Provider value={state}>{children}</DefaultContext.Provider>
  )
}
