import * as React from 'react'
import { useContext, memo, useRef, RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { EditorContext, EditorState } from '@store/EditorContext'
import { SET_SHOW_TEXT_AREAS } from '@store/reducer/constants'
import { HistoryContext, HistoryState, HistoryDispatcher } from '@store/HistoryContext'
import Faq from '@components/Faq/Faq'
import { useInitStudio } from '@shared/hooks'
import './tools.scss'
import Meme from '@shared/models/Meme'
import { TAB_GALLERY } from '@shared/constants'

type ToolsProps = {
  showTextAreas: boolean
  dispatchEditor: Function
  undoHistory: Function
  redoHistory: Function
  canUndo: boolean
  canRedo: boolean
  memeSelected: Meme
  setCurrentTab: Function
}

const Tools = memo(
  ({
    showTextAreas,
    dispatchEditor,
    undoHistory,
    redoHistory,
    canUndo,
    canRedo,
    memeSelected,
    setCurrentTab
  }: ToolsProps): JSX.Element => {
    const { t } = useTranslation()
    const faqModal: RefObject<any> = useRef(null)
    const { initWithMeme, initWithoutMeme } = useInitStudio()

    return (
      <div className="tools">
        <ul className="tools-list">
          <li>
            <button
              className="tools-list-btn"
              data-tooltip={showTextAreas ? t('attr.hideTextboxes') : t('attr.showTextboxes')}
              disabled={!memeSelected}
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
            <button
              className="tools-list-btn"
              data-tooltip={t('attr.undo')}
              disabled={!canUndo}
              onClick={(): void => canUndo && undoHistory()}
            >
              <FontAwesomeIcon icon={['fas', 'undo-alt']} />
            </button>
          </li>
          <li>
            <button
              className="tools-list-btn"
              data-tooltip={t('attr.redo')}
              disabled={!canRedo}
              onClick={(): void => canRedo && redoHistory()}
            >
              <FontAwesomeIcon icon={['fas', 'redo-alt']} />
            </button>
          </li>
          <li>
            <button
              className="tools-list-btn"
              data-tooltip={t('attr.eraseAll')}
              disabled={!canUndo}
              onClick={(): void => initWithMeme()}
            >
              <FontAwesomeIcon icon={['fas', 'eraser']} />
            </button>
          </li>
          <li>
            <button
              className="tools-list-btn"
              data-tooltip={t('attr.reset')}
              disabled={!memeSelected}
              onClick={(): void => {
                initWithoutMeme()
                setCurrentTab(TAB_GALLERY)
              }}
            >
              <FontAwesomeIcon icon={['fas', 'trash-restore-alt']} />
            </button>
          </li>
        </ul>
        <ul className="tools-list">
          <li>
            <button
              className="tools-list-btn"
              data-tooltip={t('attr.faq')}
              disabled={false}
              onClick={(): void => faqModal.current.open()}
            >
              <FontAwesomeIcon fixedWidth icon={['fas', 'question-circle']} />
            </button>
          </li>
        </ul>
        <Faq ref={faqModal} />
      </div>
    )
  }
)

export default (props: any): JSX.Element => {
  const [{ showTextAreas, memeSelected }, dispatchEditor]: [EditorState, Function] = useContext(EditorContext)
  const [{ canUndo, canRedo }, { undoHistory, redoHistory }]: [HistoryState, HistoryDispatcher] = useContext(HistoryContext)

  return (
    <Tools
      {...props}
      memeSelected={memeSelected}
      canUndo={canUndo}
      canRedo={canRedo}
      showTextAreas={showTextAreas}
      redoHistory={redoHistory}
      undoHistory={undoHistory}
      dispatchEditor={dispatchEditor}
    />
  )
}
