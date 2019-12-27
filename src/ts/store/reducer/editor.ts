import { debug } from '@utils/index'
import { SET_TEXT_ID_SELECTED } from './constants'
import { State } from '../EditorContext'

export interface Actions extends State {
  type: string
}

const EditorReducer: React.Reducer<State, Actions> = (state, action) => {
  debug(`TCL: EditorReducer -> type : ${action.type}`)
  const { textIdSelected, type } = action
  switch (type) {
    case SET_TEXT_ID_SELECTED:
      debug(`TCL: EditorReducer -> set onStudio to ${status}`)
      return {
        ...state,
        textIdSelected
      }
    default:
      return state
  }
}

export default EditorReducer
