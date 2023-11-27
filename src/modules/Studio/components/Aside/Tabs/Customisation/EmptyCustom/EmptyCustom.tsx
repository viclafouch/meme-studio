import React from 'react'
import Sad from '@components/icons/Sad'
import { styled, VStack } from '@styled-system/jsx'

const EmptyCustom = () => {
  return (
    <VStack justify="center" flex={1} textAlign="center" gap="1">
      <Sad width={50} />
      <styled.p color="white">No meme selected</styled.p>
    </VStack>
  )
}

export default EmptyCustom
