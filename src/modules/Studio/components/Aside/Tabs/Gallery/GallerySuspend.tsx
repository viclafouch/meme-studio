import React from 'react'
import { Skeleton, styled, VStack } from '@styled-system/jsx'
import { skeleton } from '@styled-system/patterns'

const skeletons = [1, 2, 3, 4, 5] as const

const GallerySuspend = () => {
  return (
    <VStack gap="0" h="full" w="full">
      <styled.div overflowY="auto" w="full">
        <styled.ul w="full" bgColor="gray.300">
          {skeletons.map((skeletonId) => {
            return (
              <li key={skeletonId}>
                <Skeleton
                  className={skeleton({
                    w: 'full',
                    h: '200px',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'gray.600'
                  })}
                />
              </li>
            )
          })}
        </styled.ul>
      </styled.div>
    </VStack>
  )
}

export default GallerySuspend
