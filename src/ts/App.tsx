import * as React from 'react'
import { DefaultProvider } from '@store/DefaultContext'
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary'
import MainContainer from '@containers/Main'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faImage, faHeading, faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { ModalProvider } from '@store/ModalContext'

library.add(faImage, faHeading, faTwitter, faDownload, faTrashAlt)

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <DefaultProvider>
        <ModalProvider>
          <div className="wrapper-container">
            <MainContainer />
          </div>
        </ModalProvider>
      </DefaultProvider>
    </ErrorBoundary>
  )
}

export default App
