import { debug } from '@utils/index'
import { SET_ON_STUDIO, SET_MEMES } from './constants'
import { State } from '../DefaultContext'

export interface Actions extends State {
  type: string
}

const DefaultReducer: React.Reducer<State, Actions> = (state, action) => {
  debug(`TCL: DefaultReducer -> type : ${action.type}`)
  const { onStudio, memes, type } = action
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
    default:
      return state
  }
}

export default DefaultReducer
