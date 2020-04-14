import * as React from 'react'
import { useRef, RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import {
  SET_SHOW_TEXT_AREAS,
  UNDO_HISTORY,
  REDO_HISTORY,
  ERASE_ALL,
  RESET,
  TOGGLE_EXPORT_MODAL,
} from '@client/store/reducer/constants'
import Faq from '@client/components/Faq/Faq'
import { useEditor, useWindowWidth } from '@client/ts/shared/hooks'
import { UseEditorInt } from '@client/ts/shared/validators'
import './tools.scss'

const Tools = (): JSX.Element => {
  const faqModal: RefObject<any> = useRef(null)
  const { t } = useTranslation()
  const { isMinLgSize } = useWindowWidth()
  const [{ showTextAreas, memeSelected, canUndo, canRedo }, dispatchEditor]: [UseEditorInt, Function] = useEditor()

  return (
    <div className="tools">
      <ul className="tools-list">
        <li>
          <button
            className="tools-list-btn"
            id="show-text-areas"
            data-tooltip={showTextAreas ? t('attr.hideTextboxes') : t('attr.showTextboxes')}
            disabled={!memeSelected}
            onClick={(): void =>
              dispatchEditor({
                type: SET_SHOW_TEXT_AREAS,
                showTextAreas: !showTextAreas,
              })
            }
          >
            {showTextAreas ? <FontAwesomeIcon icon={['fas', 'crop']} /> : <FontAwesomeIcon icon={['fas', 'crop-alt']} />}
          </button>
        </li>
        <li>
          <button
            className="tools-list-btn"
            data-tooltip={t('attr.undo')}
            disabled={!canUndo}
            onClick={(): void => canUndo && dispatchEditor({ type: UNDO_HISTORY })}
          >
            <FontAwesomeIcon icon={['fas', 'undo-alt']} />
          </button>
        </li>
        <li>
          <button
            className="tools-list-btn"
            data-tooltip={t('attr.redo')}
            disabled={!canRedo}
            onClick={(): void => canRedo && dispatchEditor({ type: REDO_HISTORY })}
          >
            <FontAwesomeIcon icon={['fas', 'redo-alt']} />
          </button>
        </li>
        <li>
          <button
            className="tools-list-btn"
            data-tooltip={t('attr.eraseAll')}
            disabled={!canUndo}
            onClick={(): void => canUndo && dispatchEditor({ type: ERASE_ALL })}
          >
            <FontAwesomeIcon icon={['fas', 'eraser']} />
          </button>
        </li>
        <li>
          <button
            className="tools-list-btn"
            data-tooltip={t('attr.reset')}
            disabled={!memeSelected}
            onClick={(): void => memeSelected && dispatchEditor({ type: RESET })}
          >
            <FontAwesomeIcon icon={['fas', 'trash-restore-alt']} />
          </button>
        </li>
        {!isMinLgSize && (
          <li>
            <button
              className="tools-list-btn"
              data-tooltip={t('studio.export')}
              disabled={!memeSelected}
              onClick={(): void => memeSelected && dispatchEditor({ type: TOGGLE_EXPORT_MODAL })}
            >
              <FontAwesomeIcon icon={['fas', 'save']} />
            </button>
          </li>
        )}
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

export default Tools
