import * as React from 'react'
import { useRef, RefObject, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import {
  SET_SHOW_TEXT_AREAS,
  UNDO_HISTORY,
  REDO_HISTORY,
  ERASE_ALL,
  RESET,
  TOGGLE_EXPORT_MODAL,
  TOGGLE_THEME
} from '@client/store/reducer/constants'
import Faq from '@client/components/Modal/Faq/Faq'
import { DefaultContext, DefaultState, DefaultDispatch } from '@client/store/DefaultContext'
import { useWindowWidth } from '@client/ts/shared/hooks'
import { EditorContext, EditorInt, EditorDispatch } from '@client/store/EditorContext'
import './tools.scss'

const Tools = (): JSX.Element => {
  const history = useHistory()
  const faqModal: RefObject<any> = useRef(null)
  const { t } = useTranslation()
  const { isMinLgSize } = useWindowWidth()
  const [{ theme }, dispatch]: [DefaultState, DefaultDispatch] = useContext(DefaultContext)
  const [{ showTextAreas, memeSelected, canUndo, canRedo, canErazeAll }, dispatchEditor]: [
    EditorInt,
    EditorDispatch
  ] = useContext(EditorContext)

  return (
    <div className="tools">
      <ul className="tools-list">
        <li>
          <button
            aria-label={showTextAreas ? t('attr.hideTextboxes') : t('attr.showTextboxes')}
            className={`tools-list-btn ${!memeSelected ? 'tools-list-btn-disabled tooltip-disabled' : ''}`}
            id="show-text-areas"
            data-tooltip={showTextAreas ? t('attr.hideTextboxes') : t('attr.showTextboxes')}
            disabled={!memeSelected}
            onClick={(): void =>
              dispatchEditor({
                type: SET_SHOW_TEXT_AREAS,
                showTextAreas: !showTextAreas
              })
            }
          >
            {showTextAreas ? <FontAwesomeIcon icon={['fas', 'crop']} /> : <FontAwesomeIcon icon={['fas', 'crop-alt']} />}
          </button>
        </li>
        <li>
          <button
            aria-label={t('attr.undo')}
            className={`tools-list-btn ${!canUndo ? 'tools-list-btn-disabled tooltip-disabled' : ''}`}
            data-tooltip={t('attr.undo')}
            disabled={!canUndo}
            onClick={(): void => canUndo && dispatchEditor({ type: UNDO_HISTORY })}
          >
            <FontAwesomeIcon icon={['fas', 'undo-alt']} />
          </button>
        </li>
        <li>
          <button
            aria-label={t('attr.redo')}
            className={`tools-list-btn ${!canRedo ? 'tools-list-btn-disabled tooltip-disabled' : ''}`}
            data-tooltip={t('attr.redo')}
            disabled={!canRedo}
            onClick={(): void => canRedo && dispatchEditor({ type: REDO_HISTORY })}
          >
            <FontAwesomeIcon icon={['fas', 'redo-alt']} />
          </button>
        </li>
        <li>
          <button
            aria-label={t('attr.eraseAll')}
            className={`tools-list-btn ${!canErazeAll ? 'tools-list-btn-disabled tooltip-disabled' : ''}`}
            data-tooltip={t('attr.eraseAll')}
            disabled={!canErazeAll}
            onClick={(): void => canErazeAll && dispatchEditor({ type: ERASE_ALL })}
          >
            <FontAwesomeIcon icon={['fas', 'eraser']} />
          </button>
        </li>
        <li>
          <button
            aria-label={t('attr.reset')}
            className={`tools-list-btn ${!memeSelected ? 'tools-list-btn-disabled tooltip-disabled' : ''}`}
            data-tooltip={t('attr.reset')}
            disabled={!memeSelected}
            onClick={(): void => {
              if (memeSelected) {
                dispatchEditor({ type: RESET })
                history.replace({ pathname: '/create' })
              }
            }}
          >
            <FontAwesomeIcon icon={['fas', 'trash-restore-alt']} />
          </button>
        </li>
        {!isMinLgSize && (
          <li>
            <button
              aria-label={t('studio.export')}
              className={`tools-list-btn ${!memeSelected ? 'tools-list-btn-disabled tooltip-disabled' : ''}`}
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
            aria-label={theme === 'dark' ? t('attr.darkTheme') : t('attr.lightTheme')}
            data-tooltip={theme !== 'dark' ? t('attr.darkTheme') : t('attr.lightTheme')}
            disabled={false}
            onClick={(): void =>
              dispatch({
                type: TOGGLE_THEME
              })
            }
          >
            {theme === 'dark' ? (
              <FontAwesomeIcon fixedWidth icon={['fas', 'sun']} />
            ) : (
              <FontAwesomeIcon fixedWidth icon={['fas', 'moon']} />
            )}
          </button>
        </li>
        <li>
          <button
            aria-label={t('attr.qa')}
            className="tools-list-btn"
            data-tooltip={t('attr.qa')}
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
