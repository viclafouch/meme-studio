import * as React from 'react'
import { useState, useContext } from 'react'
import { ReactSVG } from 'react-svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Gallery from '@components/Tabs/Gallery/Gallery'
import Customization from '@components/Tabs/Customization/Customization'
import Button from '@components/Button/Button'
import WrapperCanvas from '@components/WrapperCanvas/WrapperCanvas'
import Tab from '@components/Tabs/Tab'
import { EditorContext, EditorState } from '@store/EditorContext'
import { HistoryContext, HistoryState, HistoryDispatcher } from '@store/HistoryContext'
import { SET_TEXTS, SET_MEME_SELECTED } from '@store/reducer/constants'
import { TAB_CUSTOMIZATION, TAB_GALLERY } from '@shared/constants'
import Meme from '@shared/models/Meme'
import TextBox from '@shared/models/TextBox'
import Tools from '@components/Tools/Tools'
import Header from '@components/Header/Header'

function Studio(props: any): JSX.Element {
  const [currentTab, setCurrentTab]: [string, Function] = useState<string>(TAB_GALLERY)
  const [, { setToHistoryDebounced }]: [HistoryState, HistoryDispatcher] = useContext(HistoryContext)
  const [{ memeSelected, drawProperties }, dispatchEditor]: [EditorState, Function] = useContext(EditorContext)

  const handleCustomizeTexts = (texts: Array<TextBox>, type: string): void => {
    dispatchEditor({
      type: SET_TEXTS,
      texts
    })
    setToHistoryDebounced({
      type,
      texts,
      drawProperties
    })
  }

  const handleChooseMeme = (meme: Meme): void =>
    dispatchEditor({
      type: SET_MEME_SELECTED,
      memeSelected: meme
    })

  return (
    <div className="page page-studio">
      <div className="ld ld-fall-ttb-in studio-header">
        <Header export={(): void => props.setIsModalExportOpen(true)} />
      </div>
      <div className="ld ld-float-btt-in studio-body">
        <div className="studio-tools">
          <Tools />
        </div>
        <div className="studio-content">
          {memeSelected && <WrapperCanvas changeTab={setCurrentTab} onCustomizeTexts={handleCustomizeTexts} />}
          {!memeSelected && (
            <div className="empty-meme">
              <ReactSVG src="images/choose-meme.svg" wrapper="span" className="choose-meme-svg" />
              <p>Please, select a meme to custom</p>
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
              className={`studio-aside-header-btn ${currentTab === TAB_CUSTOMIZATION ? 'studio-aside-header-btn-active' : null}`}
              onClick={(): void => setCurrentTab(TAB_CUSTOMIZATION)}
              id="tab-customization-btn"
            >
              <FontAwesomeIcon className="icon-heading" icon={['fas', 'heading']} />
            </Button>
          </header>
          <div className="studio-aside-content">
            <Tab active={currentTab === TAB_GALLERY} id="gallery-tab">
              <Gallery onSelectMeme={handleChooseMeme} />
            </Tab>
            <Tab active={currentTab === TAB_CUSTOMIZATION} id="customization-tab">
              <Customization onCustomizeTexts={handleCustomizeTexts} />
            </Tab>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Studio
