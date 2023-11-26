import React from 'react'
import { Alata } from 'next/font/google'
import { ModalOutlet } from '@stores/Modal/Modal.provider'
import { Flex } from '@styled-system/jsx'
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
            <Flex direction="column" w="full" minH="100vh">
              {children}
              <ModalOutlet />
            </Flex>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

export default RootLayout
