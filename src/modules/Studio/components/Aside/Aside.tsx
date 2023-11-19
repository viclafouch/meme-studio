import React from 'react'
import { TextBox } from '@shared/schemas/textbox'
import { Tab } from '@stores/Editor/editor.types'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useTab } from '@stores/Editor/hooks/useTabs'
import { useTextboxes } from '@stores/Editor/hooks/useTextboxes'
import EmptyCustom from '@studio/components/Aside/Tabs/Customisation/EmptyCustom'
import { faHeading, faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Styled from './Aside.styled'
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
    <Styled.Aside>
      <Styled.Header>
        <Styled.Button
          id={'gallery' as Tab}
          onClick={handleChangeTab}
          rounded={false}
          $isActive={currentTab === 'gallery'}
        >
          <FontAwesomeIcon icon={faImage} />
        </Styled.Button>
        <Styled.Button
          id={'customization' as Tab}
          onClick={handleChangeTab}
          rounded={false}
          $isActive={currentTab === 'customization'}
        >
          <FontAwesomeIcon icon={faHeading} />
        </Styled.Button>
      </Styled.Header>
      {currentTab === 'gallery' ? (
        <Gallery />
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
    </Styled.Aside>
  )
}

export default Aside
