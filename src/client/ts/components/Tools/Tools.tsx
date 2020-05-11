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
import { DefaultContext, DefaultState } from '@client/store/DefaultContext'
import { useWindowWidth } from '@client/ts/shared/hooks'
import { EditorContext, EditorInt } from '@client/store/EditorContext'
import ImageBox from '@client/ts/shared/models/ImageBox'
import { randomID } from '@shared/utils'
import { toBase64 } from '@client/utils/index'
import { calculateAspectRatioFit } from '@client/utils/helpers'
import './tools.scss'

const Tools = (): JSX.Element => {
  const history = useHistory()
  const faqModal: RefObject<any> = useRef(null)
  const { t } = useTranslation()
  const { isMinLgSize } = useWindowWidth()
  const [{ theme }, dispatch]: [DefaultState, Function] = useContext(DefaultContext)
  const [{ showTextAreas, memeSelected, canUndo, canRedo, texts, drawProperties }, dispatchEditor]: [
    EditorInt,
    Function
  ] = useContext(EditorContext)

  const handleUploadImagebox = async (e: any): Promise<void> => {
    const file = e.currentTarget.files[0]

    // CHECK

    const img = await toBase64(file)

    const { width, height } = calculateAspectRatioFit(
      img.width,
      img.height,
      drawProperties.width * 0.9,
      drawProperties.height * 0.9
    )

    const imageBox = new ImageBox({
      id: randomID(),
      rotate: 0,
      centerY: drawProperties.height / 2,
      centerX: drawProperties.width / 2,
      height,
      width,
      src: img.src,
      img
    })

    console.log(imageBox)
  }

  return (
    <div className="tools">
      <ul className="tools-list">
        <li>
          <button
            aria-label={showTextAreas ? t('attr.hideTextboxes') : t('attr.showTextboxes')}
            className="tools-list-btn"
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
            aria-label={t('attr.redo')}
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
            aria-label={t('attr.eraseAll')}
            className="tools-list-btn"
            data-tooltip={t('attr.eraseAll')}
            disabled={texts.length === 0}
            onClick={(): void => texts.length > 0 && dispatchEditor({ type: ERASE_ALL })}
          >
            <FontAwesomeIcon icon={['fas', 'eraser']} />
          </button>
        </li>
        <li>
          <label htmlFor="upload-imagebox">
            <button
              aria-label={t('attr.eraseAll')}
              className="tools-list-btn"
              data-tooltip={t('attr.eraseAll')}
              disabled={texts.length === 0}
              onClick={(): void => texts.length > 0 && dispatchEditor({ type: ERASE_ALL })}
            >
              Img
            </button>
            <input
              type="file"
              onChange={handleUploadImagebox}
              className="upload-imagebox-input"
              accept="image/png, image/jpeg"
              id="local-meme"
            />
          </label>
        </li>
        <li>
          <button
            aria-label={t('attr.reset')}
            className="tools-list-btn"
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
