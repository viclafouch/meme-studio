import React from 'react'
import { useTranslations } from 'next-intl'
import Button from '@components/Button'
import Sad from '@components/icons/Sad'
import { styled, VStack } from '@styled-system/jsx'
import { useTab } from '@viclafouch/meme-studio-utilities/hooks'

const EmptyCustom = () => {
  const t = useTranslations()
  const { setCurrentTab } = useTab()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setCurrentTab('gallery')
  }

  return (
    <VStack justify="center" flex={1} textAlign="center" gap="1">
      <Sad width={50} />
      <styled.p mb={4} color="white">
        {t('common.noSelectedMeme')}
      </styled.p>
      <Button rounded size="small" type="button" onClick={handleClick}>
        {t('common.browseMemes')}
      </Button>
    </VStack>
  )
}

export default EmptyCustom
