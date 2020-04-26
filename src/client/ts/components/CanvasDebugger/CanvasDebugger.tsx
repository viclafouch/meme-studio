import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { useState, useCallback, useMemo } from 'react'
import ReactJson from 'react-json-view'
import { UseEditorInt } from '@client/ts/shared/validators'
import { useEditor } from '@client/ts/shared/hooks'
import { updateMeme } from '../../shared/api'
import TextBox from '@client/ts/shared/models/TextBox'
import Meme from '@client/ts/shared/models/Meme'
import Button from '../Button/Button'
import './canvas-debugger.scss'

function CanvasDebugger(): JSX.Element {
  const { t } = useTranslation()
  const [isActive, setIsActive]: [boolean, Function] = useState<boolean>(false)
  const [isFetching, setIsFetching]: [boolean, Function] = useState<boolean>(false)
  const [{ texts, drawProperties, memeSelected }]: [UseEditorInt, Function] = useEditor()

  const toggleActive = (): void => setIsActive(!isActive)

  const { meme, textbox } = useMemo(
    () => ({
      meme: new Meme(memeSelected),
      textbox: texts.map((text: TextBox) => ({
        ...text,
        value: '',
        centerX: Math.round((text.centerX / drawProperties.width) * memeSelected.width),
        centerY: Math.round((text.centerY / drawProperties.height) * memeSelected.height),
        width: Math.round((text.width / drawProperties.width) * memeSelected.width),
        height: Math.round((text.height / drawProperties.height) * memeSelected.height),
        rotate: Math.round(text.rotate)
      }))
    }),
    [texts, memeSelected]
  )

  const fetchMeme = useCallback(async () => {
    try {
      setIsFetching(true)
      await updateMeme({ meme, texts: textbox })
    } catch (error) {
      console.warn(error)
    } finally {
      setIsFetching(false)
    }
  }, [meme, textbox, setIsFetching])

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
        <Button onClick={fetchMeme} className="button-update" isLoading={isFetching}>
          Mettre à jour
        </Button>
        <ReactJson src={{ ...meme, texts: textbox }} enableClipboard displayObjectSize={false} displayDataTypes={false} />
      </div>
    </div>
  )
}

export default CanvasDebugger
