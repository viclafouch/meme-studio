import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { useState, useCallback, useMemo, useEffect, useContext } from 'react'
import ReactJson from 'react-json-view'
import { updateMeme } from '../../shared/api'
import TextBox from '@client/ts/shared/models/TextBox'
import Meme from '@client/ts/shared/models/Meme'
import Button from '../Button/Button'
import { DefaultState } from '@client/store/DefaultContext'
import { EditorInt, EditorContext, EditorDispatch } from '@client/store/EditorContext'
import './canvas-debugger.scss'

function CanvasDebugger({ theme }: { theme: DefaultState['theme'] }): JSX.Element {
  const { t } = useTranslation()
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isUpdated, setIsUpdated] = useState<boolean>(false)
  const [{ texts, drawProperties, memeSelected }]: [EditorInt, EditorDispatch] = useContext(EditorContext)

  const toggleActive = (): void => setIsActive(!isActive)

  const { meme, textbox } = useMemo(
    () => ({
      meme: new Meme(memeSelected),
      textbox: texts.map(
        (text: TextBox) =>
          new TextBox({
            ...text,
            value: '',
            centerX: Math.round((text.centerX / drawProperties.width) * memeSelected.width),
            centerY: Math.round((text.centerY / drawProperties.height) * memeSelected.height),
            width: Math.round((text.width / drawProperties.width) * memeSelected.width),
            height: Math.round((text.height / drawProperties.height) * memeSelected.height),
            rotate: Math.round(text.rotate)
          })
      )
    }),
    [texts, memeSelected, drawProperties]
  )

  useEffect(() => {
    let timeout: any
    if (isUpdated) {
      timeout = setTimeout(() => {
        setIsUpdated(false)
      }, 2000)
    }
    return (): void => clearTimeout(timeout)
  }, [isUpdated, setIsUpdated])

  const fetchMeme = useCallback(async () => {
    try {
      await updateMeme({ meme, texts: textbox })
      setIsUpdated(true)
    } catch (error) {
      console.warn(error)
    }
  }, [meme, textbox])

  return (
    <div className={`canvas-debugger ${isActive ? `canvas-debugger-active` : ``}`}>
      {!isActive ? (
        <span
          title={t('attr.openDebugger')}
          role="button"
          className="show-debugger"
          aria-label={t('attr.openDebugger')}
          onClick={toggleActive}
        >
          <FontAwesomeIcon icon={['fas', 'code']} className="icon-code" />
        </span>
      ) : (
        <span
          title={t('attr.close')}
          role="button"
          className="close-debugger"
          aria-label={t('attr.close')}
          onClick={toggleActive}
        >
          <FontAwesomeIcon icon={['fas', 'times']} className="icon-times" />
        </span>
      )}
      <div
        className="canvas-debugger-body"
        style={{
          ...(!isActive ? { display: 'none' } : null)
        }}
      >
        <Button color="blue" isSuccess={isUpdated} onClick={fetchMeme} className="button-update">
          Mettre à jour
        </Button>
        <ReactJson
          src={{ ...meme, texts: textbox }}
          enableClipboard
          displayObjectSize={false}
          displayDataTypes={false}
          theme={theme === 'dark' ? 'eighties' : 'rjv-default'}
        />
      </div>
    </div>
  )
}

export default CanvasDebugger
