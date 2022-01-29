import React from 'react'

import styles from './layout.module.scss'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = (props: LayoutProps) => {
  const { children } = props
  return <div className={styles.main__wrapper}>{children}</div>
}

export default Layout
