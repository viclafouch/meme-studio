'use client'

import React from 'react'
import Button from '@components/Button'
import { Tab } from '@stores/Editor/editor.types'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useTab } from '@stores/Editor/hooks/useTabs'
import EmptyCustom from '@studio/components/Aside/Tabs/Customisation/EmptyCustom'
import { GallerySuspend } from '@studio/components/Aside/Tabs/Gallery'
import { styled } from '@styled-system/jsx'
import { faHeading, faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Customisation from './Tabs/Customisation'
import Gallery from './Tabs/Gallery/Gallery'

const Aside = () => {
  const [currentTab, setCurrentTab] = useTab()
  const meme = useMeme()

  const handleChangeTab = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentTab(event.currentTarget.id as Tab)
  }

  return (
    <styled.aside
      display="flex"
      width="full"
      flexDir="column"
      bgColor="secondary"
      zIndex={2}
      height="calc(100vh - 5rem)"
    >
      <styled.header display="flex" width="full">
        <Button
          id="gallery"
          onClick={handleChangeTab}
          fullWidth
          size="large"
          color={currentTab === 'gallery' ? 'primary' : 'primaryDark'}
          aria-current={currentTab === 'gallery'}
        >
          <FontAwesomeIcon icon={faImage} />
        </Button>
        <Button
          id="customization"
          fullWidth
          size="large"
          color={currentTab === 'customization' ? 'primary' : 'primaryDark'}
          onClick={handleChangeTab}
          aria-current={currentTab === 'customization'}
        >
          <FontAwesomeIcon icon={faHeading} />
        </Button>
      </styled.header>
      {currentTab === 'gallery' ? (
        <React.Suspense fallback={<GallerySuspend />}>
          <Gallery />
        </React.Suspense>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>{meme ? <Customisation meme={meme} /> : <EmptyCustom />}</>
      )}
    </styled.aside>
  )
}

export default Aside
