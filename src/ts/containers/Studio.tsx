import * as React from 'react'
import { useState } from 'react'
import Meme from '@shared/models/Meme'
import GalleryTab from '@components/Tabs/Gallery/Gallery'
import CustomizationTab from '@components/Tabs/Customization/Customization'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@components/Button/Button'

const TAB_GALLERY = 'TAB_GALLERY'
const TAB_CUSTOMIZATION = 'TAB_CUSTOMIZATION'

type StudioProps = {
  memes: Array<Meme>
}

function Studio({ memes }: StudioProps): JSX.Element {
  const [currentTab, setCurrentTab] = useState<string>(TAB_GALLERY)
  const [memeSelected, setMemeSelected] = useState<Meme | null>(null)

  return (
    <div className="Studio">
      <div className="Studio__content">
        {memeSelected && <img src={memeSelected.url} />}
        {!memeSelected && <span>Select a template</span>}
      </div>
      <aside className="Studio__aside">
        <div className="buttons__actions">
          <Button
            className={currentTab === TAB_GALLERY ? 'tab-button-active' : null}
            onClick={(): void => setCurrentTab(TAB_GALLERY)}
            id="tab-gallery-btn"
          >
            <FontAwesomeIcon icon="image" />
          </Button>
          <Button
            className={currentTab === TAB_CUSTOMIZATION ? 'tab-button-active' : null}
            onClick={(): void => setCurrentTab(TAB_CUSTOMIZATION)}
            id="tab-customization-btn"
          >
            <FontAwesomeIcon icon="heading" />
          </Button>
        </div>
        <div
          className={`studio__tab ${currentTab === TAB_GALLERY ? 'studio__tab__active' : null}`}
          aria-hidden={currentTab !== TAB_GALLERY}
          id="gallery-tab"
        >
          <GalleryTab memes={memes} onSelectMeme={(meme: Meme): void => setMemeSelected(meme)} />
        </div>
        <div
          className={`studio__tab ${currentTab === TAB_CUSTOMIZATION ? 'studio__tab__active' : null}`}
          aria-hidden={currentTab !== TAB_CUSTOMIZATION}
          id="customization-tab"
        >
          <CustomizationTab memeSelected={memeSelected} />
        </div>
      </aside>
    </div>
  )
}

export default Studio
