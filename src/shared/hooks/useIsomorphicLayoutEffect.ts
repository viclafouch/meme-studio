import { useEffect, useLayoutEffect } from 'react'
import { matchIsClientSide } from '@shared/helpers/dom'

const useIsomorphicLayoutEffect = matchIsClientSide()
  ? useLayoutEffect
  : useEffect

export { useIsomorphicLayoutEffect }
