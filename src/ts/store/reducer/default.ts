import { debug } from '@utils/index'
import { SET_ON_STUDIO, SET_MEMES, SET_CURSOR_MEMES, SET_HAS_NEXT_MEMES } from './constants'
import { State } from '../DefaultContext'

export interface Actions extends State {
  type: string
}

const DefaultReducer: React.Reducer<State, Actions> = (state, action) => {
  debug(`TCL: DefaultReducer -> type : ${action.type}`)
  const { onStudio, memes, cursorMemes, hasNextMemes, type } = action
  switch (type) {
    case SET_ON_STUDIO:
      debug(`TCL: DefaultReducer -> set onStudio to ${status}`)
      return {
        ...state,
        onStudio
      }
    case SET_MEMES:
      debug(`TCL: DefaultReducer -> set ${memes.length} memes`)
      return {
        ...state,
        memes
      }
    case SET_CURSOR_MEMES:
      debug(`TCL: DefaultReducer -> set new memes cursor (after: ${cursorMemes.after})`)
      return {
        ...state,
        cursorMemes
      }
    case SET_HAS_NEXT_MEMES:
      debug(`TCL: DefaultReducer -> set has next memes to ${hasNextMemes}`)
      return {
        ...state,
        hasNextMemes
      }
    default:
      return state
  }
}

export default DefaultReducer
