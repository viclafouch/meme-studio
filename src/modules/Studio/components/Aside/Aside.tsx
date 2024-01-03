'use client'

import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Button from '@components/Button'
import EmptyCustom from '@studio/components/Aside/Tabs/Customisation/EmptyCustom'
import { GallerySuspend } from '@studio/components/Aside/Tabs/Gallery'
import { css } from '@styled-system/css'
import { styled, VStack } from '@styled-system/jsx'
import {
  faCircleExclamation,
  faHeading,
  faImage
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMeme, useTab } from '@viclafouch/meme-studio-utilities/hooks'
import { Tab } from '@viclafouch/meme-studio-utilities/stores'
import Customisation from './Tabs/Customisation'
import Gallery from './Tabs/Gallery/Gallery'

const Aside = () => {
  const { currentTab, setCurrentTab } = useTab()
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
          // TODO: aria
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
        <ErrorBoundary
          fallback={
            <VStack textAlign="center" pt={5}>
              <FontAwesomeIcon
                className={css({ fontSize: 30 })}
                icon={faCircleExclamation}
              />
              Something went wrong
            </VStack>
          }
        >
          <React.Suspense fallback={<GallerySuspend />}>
            <Gallery />
          </React.Suspense>
        </ErrorBoundary>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>{meme ? <Customisation meme={meme} /> : <EmptyCustom />}</>
      )}
    </styled.aside>
  )
}

export default Aside
