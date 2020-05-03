import { createDraft, Draft, finishDraft } from 'immer'
import { SET_MEMES, SET_HAS_NEXT_MEMES, SET_NUM_PAGE, TOGGLE_THEME } from './constants'
import { DefaultState } from '../DefaultContext'
import { debug } from '@client/utils/index'

export interface Actions extends DefaultState {
  type: string
}

const DefaultReducer = (state: DefaultState, action: Actions): DefaultState => {
  const draft: Draft<DefaultState> = createDraft(state)
  switch (action.type) {
    case SET_MEMES:
      draft.memes = action.memes
      break
    case SET_HAS_NEXT_MEMES:
      draft.hasNextMemes = action.hasNextMemes
      break
    case SET_NUM_PAGE:
      draft.numPage = action.numPage
      break
    case TOGGLE_THEME:
      draft.theme = draft.theme === 'light' ? 'dark' : 'light'
      break
  }
  const stateUpdated: DefaultState = finishDraft(draft) as any
  debug(`DEFAULT REDUCER: ${action.type}`, { stateUpdated })
  return stateUpdated
}

export default DefaultReducer
