import React from 'react'
import Footer from '@components/Footer'
import Header from '@components/Header'
import LocaleSelector from '@components/LocaleSelector'
import { css } from '@styled-system/css'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header actions={<LocaleSelector />} />
      <main className={css({ flex: 1 })}>{children}</main>
      <Footer />
    </>
  )
}

export default Layout
