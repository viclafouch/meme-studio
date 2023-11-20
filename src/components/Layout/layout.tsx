'use client'

import React from 'react'
import Styled from './layout.styled'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = (props: LayoutProps) => {
  const { children } = props

  return <Styled.Wrapper>{children}</Styled.Wrapper>
}

export default Layout
