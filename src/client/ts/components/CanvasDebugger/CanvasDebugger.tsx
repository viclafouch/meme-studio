import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import ReactJson from 'react-json-view'
import { UseEditorInt } from '@client/ts/shared/validators'
import { useEditor } from '@client/ts/shared/hooks'
import TextBox from '@client/ts/shared/models/TextBox'
import './canvas-debugger.scss'

function CanvasDebugger(): JSX.Element {
  const { t } = useTranslation()
  const [isActive, setIsActive]: [boolean, Function] = useState<boolean>(false)
  const [{ texts, drawProperties, memeSelected }]: [UseEditorInt, Function] = useEditor()

  const toggleActive = (): void => setIsActive(!isActive)

  const object = memeSelected
    ? {
        name: memeSelected.name,
        width: memeSelected.width,
        height: memeSelected.height,
        boxCount: memeSelected.boxCount,
        uuid: memeSelected.uuid,
        ext: memeSelected.ext,
        texts: texts.map(({ ...text }: TextBox) => {
          const t = {
            ...text,
            value: '',
            centerX: Math.round((text.centerX / drawProperties.width) * memeSelected.width),
            centerY: Math.round((text.centerY / drawProperties.height) * memeSelected.height),
            width: Math.round((text.width / drawProperties.width) * memeSelected.width),
            height: Math.round((text.height / drawProperties.height) * memeSelected.height),
            rotate: Math.round(text.rotate)
          }
          delete t.base
          delete t.id
          delete t.uuid
          return t
        })
      }
    : {}

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
        <ReactJson src={object} enableClipboard displayObjectSize={false} displayDataTypes={false} />
      </div>
    </div>
  )
}

export default CanvasDebugger
