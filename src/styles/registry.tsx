/* eslint-disable react/hook-use-state */
'use client'

import React from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

const StyledComponentsRegistry = ({
  children
}: {
  children: React.ReactNode
}) => {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = React.useState(() => {
    return new ServerStyleSheet()
  })

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()

    return styles
  })

  if (typeof window !== 'undefined') {
    return children
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}

export default StyledComponentsRegistry
