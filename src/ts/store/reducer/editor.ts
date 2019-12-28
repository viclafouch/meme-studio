import { debug } from '@utils/index'
import {
  SET_TEXT_ID_SELECTED,
  SET_SHOW_TEXT_AREAS,
  SET_MEME_SELECTED,
  SET_CANVAS,
  SET_DRAW_PROPERTIES,
  SET_TEXTS
} from './constants'
import { EditorState } from '../EditorContext'

export interface Actions extends EditorState {
  type: string
}

const EditorReducer: React.Reducer<EditorState, Actions> = (state, action) => {
  debug(`TCL: EditorReducer -> type : ${action.type}`)
  const { textIdSelected, showTextAreas, memeSelected, canvas, drawProperties, type, texts } = action
  switch (type) {
    case SET_TEXT_ID_SELECTED:
      debug(`TCL: EditorReducer -> set textIdSelected to ${textIdSelected}`)
      return {
        ...state,
        textIdSelected
      }
    case SET_SHOW_TEXT_AREAS:
      debug(`TCL: EditorReducer -> set showTextAreas to ${showTextAreas}`)
      return {
        ...state,
        showTextAreas
      }
    case SET_MEME_SELECTED:
      debug(`TCL: EditorReducer -> set memeSelected to ${memeSelected.name}`)
      return {
        ...state,
        memeSelected
      }
    case SET_CANVAS:
      debug(`TCL: EditorReducer -> set html canvas element`)
      return {
        ...state,
        canvas
      }
    case SET_DRAW_PROPERTIES:
      debug(`TCL: EditorReducer -> set new drawProperties`)
      return {
        ...state,
        drawProperties
      }
    case SET_TEXTS:
      debug(`TCL: EditorReducer -> set ${texts.length} text(s)`)
      return {
        ...state,
        texts
      }
    default:
      return state
  }
}

export default EditorReducer
