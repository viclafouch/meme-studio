import { createDraft, Draft, finishDraft } from 'immer'
import { SET_ON_STUDIO, SET_MEMES, SET_CURSOR_MEMES, SET_HAS_NEXT_MEMES } from './constants'
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
    case SET_CURSOR_MEMES:
      draft.cursorMemes = action.cursorMemes
      break
    case SET_HAS_NEXT_MEMES:
      draft.hasNextMemes = action.hasNextMemes
      break
  }
  const stateUpdated: any = finishDraft(draft)
  console.log('DEFAULT : ' + action.type, { stateUpdated })
  return stateUpdated
}

export default DefaultReducer
