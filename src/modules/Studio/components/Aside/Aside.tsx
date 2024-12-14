'use client'

import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslations } from 'next-intl'
import { TabButton } from '@studio/components/Aside/Aside.styles'
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
import type { Tab } from '@viclafouch/meme-studio-utilities/stores'
import Customisation from './Tabs/Customisation'
import Gallery from './Tabs/Gallery/Gallery'

const Aside = () => {
  const t = useTranslations()
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
        <TabButton
          id="gallery"
          aria-label={t('tools.goToGallery')}
          onClick={handleChangeTab}
          aria-current={currentTab === 'gallery'}
        >
          <FontAwesomeIcon icon={faImage} />
        </TabButton>
        <TabButton
          id="customization"
          aria-label={t('tools.goToCustomization')}
          onClick={handleChangeTab}
          aria-current={currentTab === 'customization'}
        >
          <FontAwesomeIcon icon={faHeading} />
        </TabButton>
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
        <>{meme ? <Customisation meme={meme} /> : <EmptyCustom />}</>
      )}
    </styled.aside>
  )
}

export default Aside
