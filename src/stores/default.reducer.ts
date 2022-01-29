import { Draft, produce } from 'immer'

import { TOGGLE_THEME } from './default.constants'

const defaultReducer = produce(
  (draft: Draft<DefaultState>, action: DefaultActions) => {
    switch (action.type) {
      case TOGGLE_THEME:
        draft.theme = draft.theme === 'light' ? 'dark' : 'light'
        break
      default:
    }
  }
)

export default defaultReducer
