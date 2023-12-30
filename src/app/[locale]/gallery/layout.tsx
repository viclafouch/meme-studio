import React from 'react'
import Footer from '@components/Footer'
import Header from '@components/Header'
import LocaleSelector from '@components/LocaleSelector'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header actions={<LocaleSelector />} />
      {children}
      <Footer />
    </>
  )
}

export default Layout
