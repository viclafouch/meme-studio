import React from 'react'
import { Metadata } from 'next'
import { Alata } from 'next/font/google'
import { ModalOutlet } from '@stores/Modal/Modal.provider'
import QueryProvider from '../queries/QueryProvider'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../../styles/globals.css'

const atlata = Alata({ weight: '400', subsets: ['latin'] })

const metadata: Metadata = {
  title: {
    template: 'Meme Studio | %s',
    default: 'Créer un mème'
  }
}

export { metadata }

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr">
      <body className={atlata.className}>
        <QueryProvider>
          {children}
          <ModalOutlet />
        </QueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
