import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: 'Meme Studio | %s',
    default: ''
  }
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default RootLayout
