'use client'

import React from 'react'
import Button from '@components/Button'
import { TextBox } from '@shared/schemas/textbox'
import { Tab } from '@stores/Editor/editor.types'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useTab } from '@stores/Editor/hooks/useTabs'
import { useTextboxes } from '@stores/Editor/hooks/useTextboxes'
import EmptyCustom from '@studio/components/Aside/Tabs/Customisation/EmptyCustom'
import { styled } from '@styled-system/jsx'
import { faHeading, faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Customisation from './Tabs/Customisation'
import Gallery from './Tabs/Gallery/Gallery'

export type AsideProps = {
  textboxRefs: Record<TextBox['id'], React.RefObject<HTMLTextAreaElement>>
}

const Aside = ({ textboxRefs }: AsideProps) => {
  const [currentTab, setCurrentTab] = useTab()
  const { textboxes } = useTextboxes()
  const meme = useMeme()

  const handleChangeTab = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentTab(event.currentTarget.id as Tab)
  }

  return (
    <styled.aside
      display="flex"
      width="full"
      flexDir="column"
      bg="gray.400"
      zIndex={2}
      height="calc(100vh - 5rem)"
    >
      <styled.header display="flex" width="full">
        <Button
          id="gallery"
          onClick={handleChangeTab}
          fullWidth
          aria-current={currentTab === 'gallery'}
        >
          <FontAwesomeIcon icon={faImage} />
        </Button>
        <Button
          id="customization"
          fullWidth
          onClick={handleChangeTab}
          aria-current={currentTab === 'customization'}
        >
          <FontAwesomeIcon icon={faHeading} />
        </Button>
      </styled.header>
      {currentTab === 'gallery' ? (
        <React.Suspense fallback={<div>waiting 100....</div>}>
          <Gallery />
        </React.Suspense>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {meme ? (
            <Customisation
              meme={meme}
              textboxes={textboxes}
              textboxRefs={textboxRefs}
            />
          ) : (
            <EmptyCustom />
          )}
        </>
      )}
    </styled.aside>
  )
}

export default Aside
