import React from 'react'
import { Alata } from 'next/font/google'
import { ModalOutlet } from '@stores/Modal/Modal.provider'
import StyledComponentsRegistry from '@styles/registry'
import QueryProvider from '../queries/QueryProvider'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../../styles/globals.css'

const atlata = Alata({ weight: '400', subsets: ['latin'] })

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr">
      <body className={atlata.className}>
        <StyledComponentsRegistry>
          <QueryProvider>
            {children}
            <ModalOutlet />
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

export default RootLayout
