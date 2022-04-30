import React from 'react'
import { faHeading, faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tab } from '@stores/Editor/editor'
import { useTab } from '@stores/Editor/hooks/useTabs'

import Styled from './aside.styled'
import Customisation from './Tabs/Customisation/Customisation'
import Gallery from './Tabs/Gallery/Gallery'

const Aside = () => {
  const [currentTab, setCurrentTab] = useTab()

  const handleChangeTab = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentTab(event.currentTarget.id as Tab)
  }

  return (
    <Styled.Aside>
      <Styled.Header>
        <Styled.Button
          id={'gallery' as Tab}
          onClick={handleChangeTab}
          $isActive={currentTab === 'gallery'}
        >
          <FontAwesomeIcon icon={faImage} />
        </Styled.Button>
        <Styled.Button
          id={'customization' as Tab}
          onClick={handleChangeTab}
          $isActive={currentTab === 'customization'}
        >
          <FontAwesomeIcon icon={faHeading} />
        </Styled.Button>
      </Styled.Header>
      {currentTab === 'gallery' ? <Gallery /> : <Customisation />}
    </Styled.Aside>
  )
}

export default Aside
