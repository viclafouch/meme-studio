import { createDraft, Draft, finishDraft } from 'immer'
import { SET_ON_STUDIO, SET_MEMES, SET_HAS_NEXT_MEMES, SET_NUM_PAGE } from './constants'
import { DefaultState } from '../DefaultContext'

export interface Actions extends DefaultState {
  type: string
}

const DefaultReducer = (state: DefaultState, action: Actions): DefaultState => {
  const draft: Draft<DefaultState> = createDraft(state)
  switch (action.type) {
    case SET_ON_STUDIO:
      draft.onStudio = action.onStudio
      break
    case SET_MEMES:
      draft.memes = action.memes
      break
    case SET_HAS_NEXT_MEMES:
      draft.hasNextMemes = action.hasNextMemes
      break
    case SET_NUM_PAGE:
      draft.numPage = action.numPage
      break
  }
  const stateUpdated: any = finishDraft(draft)
  console.log('DEFAULT : ' + action.type, { stateUpdated })
  return stateUpdated
}

export default DefaultReducer
