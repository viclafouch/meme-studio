import * as React from 'react'
import { useState, useRef, RefObject, useEffect } from 'react'
import { ReactSVG } from 'react-svg'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Gallery from '@client/components/Tabs/Gallery/Gallery'
import Customization from '@client/components/Tabs/Customization/Customization'
import Button from '@client/components/Button/Button'
import WrapperCanvas from '@client/components/WrapperCanvas/WrapperCanvas'
import Tab from '@client/components/Tabs/Tab'
import { EditorState } from '@client/store/EditorContext'
import { SET_MEME_SELECTED, RESIZE_WINDOW } from '@client/store/reducer/constants'
import { TAB_CUSTOMIZATION, TAB_GALLERY } from '@client/ts/shared/constants'
import Meme from '@client/ts/shared/models/Meme'
import Tools from '@client/components/Tools/Tools'
import Header from '@client/components/Header/Header'
import { endWithExt, innerDimensions, debug } from '@client/utils/index'
import { randomID } from '@shared/utils'
import DragAndDrop from '@client/components/DragAndDrop/DragAndDrop'
import { useWindowWidth, useEditor } from '@client/ts/shared/hooks'
import { getMeme } from '@client/ts/shared/api'
import CanvasDebugger from '@client/components/CanvasDebugger/CanvasDebugger'
import { IS_DEV } from '@shared/config'
import { hasRecoverVersion, formatRelativeDate } from '@client/utils/helpers'

function Studio(props: any): JSX.Element {
  const inputDrop: RefObject<HTMLInputElement> = useRef(null)
  const contentRef: RefObject<HTMLDivElement> = useRef(null)
  const { t, i18n } = useTranslation()
  const [lastVersion, setLastVersion]: [false | Date, Function] = useState<false | Date>(hasRecoverVersion())
  const [isActiveRecoverBox, setIsActiveRecoverBox]: [boolean, Function] = useState<boolean>(lastVersion instanceof Date)
  const { width, isMinLgSize } = useWindowWidth()
  const [currentTab, setCurrentTab]: [string, Function] = useState<string>(TAB_GALLERY)
  const [{ memeSelected }, dispatchEditor]: [EditorState, Function] = useEditor()

  useEffect(() => {
    if (isMinLgSize) {
      setCurrentTab(TAB_GALLERY)
    } else {
      setCurrentTab(null)
    }
  }, [isMinLgSize])

  useEffect(() => {
    const wrapper: HTMLElement = contentRef.current
    dispatchEditor({
      type: RESIZE_WINDOW,
      innerDimensions: innerDimensions(wrapper),
    })
  }, [width])

  const handleChooseMeme = async (meme: Meme): Promise<void> => {
    try {
      if (memeSelected && meme.id === memeSelected.id) return
      const { texts } = await getMeme(meme.id)
      dispatchEditor({
        type: SET_MEME_SELECTED,
        memeSelected: meme,
        texts,
      })
      setIsActiveRecoverBox(false)
      setLastVersion(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (hasRecoverVersion()) {
      let timeout = setTimeout(() => {
        setIsActiveRecoverBox(false)
        timeout = setTimeout(() => {
          setLastVersion(false)
        }, 2000) // Wait for the animation end
      }, 5000) // Show 5s for the user
      return (): void => clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (memeSelected) {
      document.title = `Meme Studio - ${memeSelected.name}`
      setCurrentTab(isMinLgSize ? TAB_CUSTOMIZATION : null)
    } else {
      document.title = `Meme Studio`
      setCurrentTab(isMinLgSize ? TAB_GALLERY : null)
    }
  }, [memeSelected])

  const handleImportImage = async (fileList?: FileList): Promise<void> => {
    const files = fileList || inputDrop.current.files
    if (!files.length) return
    else if (files.length > 1) return
    else if (!endWithExt(['.jpg', '.png', 'jpeg'], files[0].name)) return debug('extension not valid') // TODO

    try {
      const meme = new Meme({
        id: randomID(),
        uuid: randomID(),
        height: 0,
        width: 0,
        boxCount: 0,
        name: files[0].name,
        ext: files[0].name.split('.').pop().toLowerCase(),
        localImageUrl: window.URL.createObjectURL(files[0]),
      })

      const { width, height } = await meme.image

      meme.width = width
      meme.height = height
      dispatchEditor({
        type: SET_MEME_SELECTED,
        memeSelected: meme,
        texts: [],
      })
    } catch (error) {
      // TODO
      console.warn(error)
    }
  }

  const closeTabModal = (): void => setCurrentTab(null)

  return (
    <>
      <div className="page page-studio">
        <div className="ld ld-fall-ttb-in studio-header">
          <Header export={(): void => props.setIsModalExportOpen(true)} />
        </div>
        <div className="ld ld-float-btt-in studio-body">
          <div className="studio-tools">
            <Tools export={(): void => props.setIsModalExportOpen(true)} />
          </div>
          <div className={`studio-content ${memeSelected ? 'studio-content-active' : ''}`} ref={contentRef}>
            {lastVersion && (
              <div className={`recover-version-box ld ${isActiveRecoverBox ? 'ld-float-btt-in' : 'ld-fade-out'}`}>
                {t('studio.lastBackup')} <br />
                <p className="recover-version-box-date">{formatRelativeDate(lastVersion, new Date(), i18n.language)}</p>
              </div>
            )}
            {memeSelected && <WrapperCanvas changeTab={setCurrentTab} />}
            {IS_DEV && <CanvasDebugger />}
            {!memeSelected && (
              <div className="empty-meme">
                <ReactSVG src="images/choose-meme.svg" wrapper="span" className="choose-meme-svg" />
                {isMinLgSize ? (
                  <>
                    <p>
                      {t('studio.selectMeme')} <br />{' '}
                      <label className="import-image-label" htmlFor="local-meme">
                        <input
                          type="file"
                          ref={inputDrop}
                          onChange={(): any => handleImportImage()}
                          className="import-image-label-input"
                          accept="image/png, image/jpeg"
                          id="local-meme"
                        />
                        {t('studio.or')} <span className="import-image-label-text">{t('studio.importImage')}</span>.
                      </label>
                    </p>
                    <DragAndDrop onDrop={handleImportImage} id="dragenter-root" />
                  </>
                ) : (
                  <div className="empty-meme-buttons-container">
                    <Button className={'button-select-gallery'} big onClick={(): void => setCurrentTab(TAB_GALLERY)}>
                      Sélectionner un meme
                    </Button>
                    <label htmlFor="local-meme" className="import-image-label button button-big button-select-gallery">
                      <span>Importer un meme</span>
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
          <aside className="studio-aside">
            <header className="studio-aside-header">
              <Button
                className={`studio-aside-header-btn ${currentTab === TAB_GALLERY ? 'studio-aside-header-btn-active' : null}`}
                onClick={(): void => setCurrentTab(TAB_GALLERY)}
                id="tab-gallery-btn"
              >
                <FontAwesomeIcon className="icon-image" icon={['fas', 'image']} />
              </Button>
              <Button
                className={`studio-aside-header-btn ${
                  currentTab === TAB_CUSTOMIZATION ? 'studio-aside-header-btn-active' : null
                }`}
                onClick={(): void => setCurrentTab(TAB_CUSTOMIZATION)}
                id="tab-customization-btn"
              >
                <FontAwesomeIcon className="icon-heading" icon={['fas', 'heading']} />
              </Button>
            </header>
            <div className="studio-aside-content">
              <Tab active={currentTab === TAB_GALLERY} id="gallery-tab" onCloseModal={closeTabModal}>
                <Gallery onSelectMeme={handleChooseMeme} />
              </Tab>
              <Tab active={currentTab === TAB_CUSTOMIZATION} id="customization-tab" onCloseModal={closeTabModal}>
                <Customization />
              </Tab>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

export default Studio
