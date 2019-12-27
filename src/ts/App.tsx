import * as React from 'react'
import { DefaultProvider } from '@store/DefaultContext'
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary'
import MainContainer from '@containers/Main'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faImage, faHeading, faDownload, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { ModalProvider } from '@store/ModalContext'
import { EditorProvider } from '@store/EditorContext'

library.add(faImage, faHeading, faTwitter, faDownload, faTrashAlt, faPlus)

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <DefaultProvider>
        <ModalProvider>
          <EditorProvider>
            <div className="wrapper-container">
              <MainContainer />
            </div>
          </EditorProvider>
        </ModalProvider>
      </DefaultProvider>
    </ErrorBoundary>
  )
}

export default App
