import * as React from 'react'
import AbortController from 'abort-controller'
import * as Loadable from 'react-loadable'
import { useState, useRef, RefObject, useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '@client/components/Button/Button'
import WrapperCanvas from '@client/components/WrapperCanvas/WrapperCanvas'
import { EditorState } from '@client/store/EditorContext'
import { SET_MEME_SELECTED, RESIZE_WINDOW, SET_TEXT_ID_SELECTED, SET_CURRENT_TAB } from '@client/store/reducer/constants'
import { TAB_CUSTOMIZATION, TAB_GALLERY } from '@client/ts/shared/constants'
import Meme from '@client/ts/shared/models/Meme'
import Tools from '@client/components/Tools/Tools'
import Header from '@client/components/Header/Header'
import { endWithExt, innerDimensions } from '@client/utils/index'
import { randomID } from '@shared/utils'
import DragAndDrop from '@client/components/DragAndDrop/DragAndDrop'
import { useWindowWidth, useEditor } from '@client/ts/shared/hooks'
import { getMeme } from '@client/ts/shared/api'
import { IS_DEV } from '@shared/config'
import { hasRecoverVersion, formatRelativeDate } from '@client/utils/helpers'
import { DefaultContext, DefaultState } from '@client/store/DefaultContext'
import Aside from '@client/components/Aside/Aside'
import '@client/scss/pages/studio.scss'

const CanvasDebuggerAsync = Loadable({
  loader: async () => import('@client/components/CanvasDebugger/CanvasDebugger'),
  loading: () => null
})

function Studio(props: RouteComponentProps<{ memeId?: string }>): JSX.Element {
  const inputDrop: RefObject<HTMLInputElement> = useRef(null)
  const contentRef: RefObject<HTMLDivElement> = useRef(null)
  const [{ theme }]: [DefaultState] = useContext(DefaultContext)
  const { t, i18n } = useTranslation()
  const [lastVersion, setLastVersion]: [false | Date, Function] = useState<false | Date>(hasRecoverVersion())
  const [isActiveRecoverBox, setIsActiveRecoverBox]: [boolean, Function] = useState<boolean>(lastVersion instanceof Date)
  const { width, isMinLgSize } = useWindowWidth()
  const [{ memeSelected }, dispatchEditor]: [EditorState, Function] = useEditor()
  const [uploadError, setUploadError]: [string, Function] = useState<string | null>(null)

  useEffect(() => {
    const wrapper: HTMLElement = contentRef.current
    dispatchEditor({
      type: RESIZE_WINDOW,
      innerDimensions: innerDimensions(wrapper)
    })
  }, [width])

  useEffect(() => {
    const memeIdParams = props.match.params.memeId
    const handleChooseMeme = async (memeId: string, controller: AbortController): Promise<void> => {
      try {
        const { texts, meme } = await getMeme(memeId, {
          signal: controller.signal
        })
        dispatchEditor({
          type: SET_MEME_SELECTED,
          memeSelected: meme,
          texts
        })
        setIsActiveRecoverBox(false)
        setLastVersion(false)
        setUploadError(null)
      } catch (error) {
        if (error.name !== 'AbortError') console.error(error)
        else console.error('Too short')
      }
    }
    const controller = new AbortController()
    let memeSaved: any = window.localStorage.getItem('memeSelected')
    if (memeIdParams) {
      if (hasRecoverVersion()) {
        memeSaved = new Meme(JSON.parse(memeSaved)) as Meme
        if (memeSaved.id !== memeIdParams) handleChooseMeme(memeIdParams, controller)
      } else {
        handleChooseMeme(memeIdParams, controller)
      }
    }
    return (): void => {
      controller.abort()
    }
  }, [props.match.params.memeId, dispatchEditor, setIsActiveRecoverBox, setLastVersion, setUploadError])

  useEffect(() => {
    let timeout: any
    if (hasRecoverVersion()) {
      timeout = setTimeout(() => {
        setIsActiveRecoverBox(false)
        timeout = setTimeout(() => {
          setLastVersion(false)
        }, 2000) // Wait for the animation end
      }, 5000) // Show 5s for the user
    }
    return (): void => {
      clearTimeout(timeout)
      dispatchEditor({
        type: SET_TEXT_ID_SELECTED,
        textIdSelected: null
      })
    }
  }, [])

  useEffect(() => {
    if (memeSelected) {
      document.title = `Meme Studio | ${memeSelected.name}`
      // Go on tab custom only on desktop
      dispatchEditor({
        type: SET_CURRENT_TAB,
        currentTab: isMinLgSize ? TAB_CUSTOMIZATION : null
      })
    } else {
      dispatchEditor({
        type: SET_CURRENT_TAB,
        currentTab: isMinLgSize ? TAB_GALLERY : null
      })
    }
  }, [memeSelected])

  const handleImportImage = async (fileList?: FileList): Promise<void> => {
    const files = fileList || inputDrop.current.files
    if (files.length > 1) {
      setUploadError('studio.errorMultipleFiles')
      return
    } else if (!endWithExt(['.jpg', '.png', 'jpeg'], files[0].name)) {
      setUploadError('studio.errorExtensionFile')
      return
    }

    try {
      const meme = new Meme({
        id: randomID(),
        height: 0,
        width: 0,
        boxCount: 0,
        name: files[0].name,
        filename: files[0].name,
        localImageUrl: window.URL.createObjectURL(files[0])
      })

      const { width, height } = await meme.image

      meme.width = width
      meme.height = height
      dispatchEditor({
        type: SET_MEME_SELECTED,
        memeSelected: meme,
        texts: []
      })
    } catch (error) {
      console.warn(error)
      setUploadError('unknownError')
    }
  }

  return (
    <div className="page studio">
      <Header isAnimate />
      <div className="ld ld-float-btt-in studio-body">
        <Tools />
        <div className={`studio-content ${memeSelected ? 'studio-content-active' : ''}`} ref={contentRef}>
          {memeSelected && <div className="studio-content-overley" style={{ backgroundImage: `url(${memeSelected.url()})` }} />}
          {lastVersion && (
            <div className={`recover-version-box ld ${isActiveRecoverBox ? 'ld-float-btt-in' : 'ld-fade-out'}`}>
              {t('studio.lastBackup')} <br />
              <p className="recover-version-box-date">{formatRelativeDate(lastVersion, new Date(), i18n.language)}</p>
            </div>
          )}
          {memeSelected && <WrapperCanvas />}
          {IS_DEV && memeSelected && <CanvasDebuggerAsync theme={theme} />}
          {!memeSelected && (
            <div className="empty-meme">
              <img src="/images/choose-meme.svg" width="360" height="308" className="choose-meme-img" />
              {isMinLgSize ? (
                <>
                  <p>
                    {t('studio.selectMemeFrom')} <br />{' '}
                    <label className="import-image-label" htmlFor="local-meme">
                      <input
                        type="file"
                        ref={inputDrop}
                        onChange={(): any => handleImportImage()}
                        className="import-image-label-input"
                        accept="image/png, image/jpeg"
                        id="local-meme"
                      />
                      {t('studio.or')} <span className="import-image-label-text">{t('studio.dropAnImage')}</span>.
                    </label>
                  </p>
                  <p
                    className="import-image-error"
                    style={{
                      ...(!uploadError ? { display: 'none' } : null)
                    }}
                  >
                    {t(uploadError)}
                  </p>
                  <DragAndDrop onDrop={handleImportImage} id="dragenter-root" />
                </>
              ) : (
                <div className="empty-meme-buttons-container">
                  <Button
                    className={'button-select-gallery'}
                    big
                    onClick={(): void =>
                      dispatchEditor({
                        type: SET_CURRENT_TAB,
                        currentTab: TAB_GALLERY
                      })
                    }
                  >
                    {t('studio.selectAMeme')}
                  </Button>
                  <label htmlFor="local-meme" className="import-image-label button button-big button-select-gallery">
                    <span>{t('studio.importAnImage')}</span>
                    <input
                      type="file"
                      ref={inputDrop}
                      onChange={(): any => handleImportImage()}
                      className="import-image-label-input"
                      accept="image/png, image/jpeg"
                      id="local-meme"
                    />
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
        <Aside />
      </div>
    </div>
  )
}

export default Studio
