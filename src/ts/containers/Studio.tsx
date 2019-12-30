import * as React from 'react'
import { useState, useContext } from 'react'
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

function Studio(): JSX.Element {
  const [currentTab, setCurrentTab]: [string, Function] = useState<string>(TAB_GALLERY)
  const [, { setToHistory }]: [HistoryState, HistoryDispatcher] = useContext(HistoryContext)
  const [{ memeSelected, drawProperties }, dispatchEditor]: [EditorState, Function] = useContext(EditorContext)

  const handleCustomizeTexts = (texts: Array<TextBox>, type: string): void => {
    dispatchEditor({
      type: SET_TEXTS,
      texts
    })
    setToHistory({
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
    <div className="Studio">
      <div className="Studio__content">
        {memeSelected && <WrapperCanvas changeTab={setCurrentTab} onCustomizeTexts={handleCustomizeTexts} />}
        {!memeSelected && <span>Select a template</span>}
      </div>
      <aside className="Studio__aside">
        <div className="tabs__buttons__container">
          <Button
            className={currentTab === TAB_GALLERY ? 'tab__button__active' : null}
            onClick={(): void => setCurrentTab(TAB_GALLERY)}
            id="tab-gallery-btn"
          >
            <FontAwesomeIcon className="icon-image" icon={['fas', 'image']} />
          </Button>
          <Button
            className={currentTab === TAB_CUSTOMIZATION ? 'tab__button__active' : null}
            onClick={(): void => setCurrentTab(TAB_CUSTOMIZATION)}
            id="tab-customization-btn"
          >
            <FontAwesomeIcon className="icon-heading" icon={['fas', 'heading']} />
          </Button>
        </div>
        <Tab active={currentTab === TAB_GALLERY} id="gallery-tab">
          <Gallery onSelectMeme={handleChooseMeme} />
        </Tab>
        <Tab active={currentTab === TAB_CUSTOMIZATION} id="customization-tab">
          <Customization onCustomizeTexts={handleCustomizeTexts} />
        </Tab>
      </aside>
    </div>
  )
}

export default Studio
