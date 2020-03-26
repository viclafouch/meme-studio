import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import ReactJson from 'react-json-view'
import { UseEditorInt } from '@client/ts/shared/validators'
import { useEditor } from '@client/ts/shared/hooks'
import './canvas-debugger.scss'

function CanvasDebugger(): JSX.Element {
  const { t } = useTranslation()
  const [isActive, setIsActive]: [boolean, Function] = useState<boolean>(false)
  const [{ texts, drawProperties, memeSelected }]: [UseEditorInt, Function] = useEditor()

  const toggleActive = (): void => setIsActive(!isActive)

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
          ...(!isActive ? { display: 'none' } : null),
        }}
      >
        <ReactJson
          src={{ texts, drawProperties, memeSelected }}
          enableClipboard
          displayObjectSize={false}
          displayDataTypes={false}
        />
      </div>
    </div>
  )
}

export default CanvasDebugger
