import * as React from 'react'
import { useContext, memo, useRef, RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditorContext, EditorState } from '@store/EditorContext'
import { SET_SHOW_TEXT_AREAS } from '@store/reducer/constants'
import { HistoryContext, HistoryState, HistoryDispatcher } from '@store/HistoryContext'
import Faq from '@components/Faq/Faq'
import { useInitStudio } from '@shared/hooks'
import './tools.scss'

type ToolsProps = {
  showTextAreas: boolean
  dispatchEditor: Function
  undoHistory: Function
  redoHistory: Function
  canUndo: boolean
  canRedo: boolean
}

const Tools = memo(
  ({ showTextAreas, dispatchEditor, undoHistory, redoHistory, canUndo, canRedo }: ToolsProps): JSX.Element => {
    const faqModal: RefObject<any> = useRef(null)
    const initStudio = useInitStudio()

    return (
      <div className="Tools">
        <ul className="list-tools">
          <li>
            <button
              className="tool"
              onClick={(): void =>
                dispatchEditor({
                  type: SET_SHOW_TEXT_AREAS,
                  showTextAreas: !showTextAreas
                })
              }
            >
              <FontAwesomeIcon icon={['fas', 'crop-alt']} />
            </button>
          </li>
          <li>
            <button className="tool" disabled={!canUndo} onClick={(): void => canUndo && undoHistory()}>
              <FontAwesomeIcon icon={['fas', 'undo-alt']} />
            </button>
          </li>
          <li>
            <button className="tool" disabled={!canRedo} onClick={(): void => canRedo && redoHistory()}>
              <FontAwesomeIcon icon={['fas', 'redo-alt']} />
            </button>
          </li>
          <li>
            <button className="tool" disabled={!canUndo} onClick={(): void => initStudio()}>
              <FontAwesomeIcon icon={['fas', 'trash-restore-alt']} />
            </button>
          </li>
        </ul>
        <ul className="list-tools">
          <li>
            <button className="tool" onClick={(): void => faqModal.current.open()}>
              <FontAwesomeIcon fixedWidth icon={['fas', 'question-circle']} />
            </button>
          </li>
        </ul>
        <Faq ref={faqModal} />
      </div>
    )
  }
)

export default (): JSX.Element => {
  const [{ showTextAreas }, dispatchEditor]: [EditorState, Function] = useContext(EditorContext)
  const [{ canUndo, canRedo }, { undoHistory, redoHistory }]: [HistoryState, HistoryDispatcher] = useContext(HistoryContext)

  return (
    <Tools
      canUndo={canUndo}
      canRedo={canRedo}
      showTextAreas={showTextAreas}
      redoHistory={redoHistory}
      undoHistory={undoHistory}
      dispatchEditor={dispatchEditor}
    />
  )
}
