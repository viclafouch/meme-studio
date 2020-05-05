import * as React from 'react'
import Button from '@client/components/Button/Button'
import { TAB_CUSTOMIZATION, TAB_GALLERY } from '@client/ts/shared/constants'
import { EditorState } from '@client/store/EditorContext'
import { useEditor } from '@client/ts/shared/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SET_CURRENT_TAB } from '@client/store/reducer/constants'
import Tab from './Tabs/Tab'
import Gallery from './Tabs/Gallery/Gallery'
import Customization from './Tabs/Customization/Customization'
import './aside.scss'

function Aside(): JSX.Element {
  const [{ currentTab }, dispatchEditor]: [EditorState, Function] = useEditor()

  return (
    <aside className="studio-aside">
      <header className="studio-aside-header">
        <Button
          aria-label="Gallery tab"
          className={`studio-aside-header-btn ${currentTab === TAB_GALLERY ? 'studio-aside-header-btn-active' : null}`}
          onClick={(): void =>
            dispatchEditor({
              type: SET_CURRENT_TAB,
              currentTab: TAB_GALLERY
            })
          }
          id="tab-gallery-btn"
        >
          <FontAwesomeIcon className="icon-image" icon={['fas', 'image']} />
        </Button>
        <Button
          aria-label="Customization tab"
          className={`studio-aside-header-btn ${currentTab === TAB_CUSTOMIZATION ? 'studio-aside-header-btn-active' : null}`}
          onClick={(): void =>
            dispatchEditor({
              type: SET_CURRENT_TAB,
              currentTab: TAB_CUSTOMIZATION
            })
          }
          id="tab-customization-btn"
        >
          <FontAwesomeIcon className="icon-heading" icon={['fas', 'heading']} />
        </Button>
      </header>
      <div className="studio-aside-content">
        <Tab
          active={currentTab === TAB_GALLERY}
          id="gallery-tab"
          onCloseModal={(): void =>
            dispatchEditor({
              type: SET_CURRENT_TAB,
              currentTab: null
            })
          }
        >
          <Gallery />
        </Tab>
        <Tab
          active={currentTab === TAB_CUSTOMIZATION}
          id="customization-tab"
          onCloseModal={(): void =>
            dispatchEditor({
              type: SET_CURRENT_TAB,
              currentTab: null
            })
          }
        >
          <Customization />
        </Tab>
      </div>
    </aside>
  )
}

export default Aside
