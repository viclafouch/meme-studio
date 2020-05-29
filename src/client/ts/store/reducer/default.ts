import { createDraft, Draft, finishDraft } from 'immer'
import { TOGGLE_THEME } from './constants'
import { DefaultState } from '../DefaultContext'
import { debug } from '@client/utils/index'

export interface Actions extends Partial<DefaultState> {
  type: string
}

export const DefaultReducer = (state: DefaultState, action: Actions): DefaultState => {
  const draft: Draft<DefaultState> = createDraft(state)
  switch (action.type) {
    case TOGGLE_THEME:
      draft.theme = draft.theme === 'light' ? 'dark' : 'light'
      break
  }
  const stateUpdated: DefaultState = finishDraft(draft) as any
  debug(`DEFAULT REDUCER: ${action.type}`, { stateUpdated })
  return stateUpdated
}

export default DefaultReducer
