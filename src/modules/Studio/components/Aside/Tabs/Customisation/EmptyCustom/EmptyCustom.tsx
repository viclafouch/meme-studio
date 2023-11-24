import React from 'react'
import Sad from '@components/icons/Sad'
import { Flex, styled } from '@styled-system/jsx'

const EmptyCustom = () => {
  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      flex={1}
      textAlign="center"
      gap="1"
    >
      <Sad width={50} />
      <styled.p color="white">No meme selected</styled.p>
    </Flex>
  )
}

export default EmptyCustom
