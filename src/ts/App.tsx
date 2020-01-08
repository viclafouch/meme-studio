import * as React from 'react'
import { DefaultProvider } from '@store/DefaultContext'
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary'
import MainContainer from '@containers/Main'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faImage,
  faHeading,
  faDownload,
  faTrashAlt,
  faPlus,
  faCropAlt,
  faUndoAlt,
  faRedoAlt,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { ModalProvider } from '@store/ModalContext'
import { EditorProvider } from '@store/EditorContext'
import { HistoryProvider } from '@store/HistoryContext'

library.add(faImage, faHeading, faTwitter, faDownload, faTrashAlt, faPlus, faCropAlt, faUndoAlt, faRedoAlt, faQuestionCircle)

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <DefaultProvider>
        <ModalProvider>
          <EditorProvider>
            <HistoryProvider>
              <div className="wrapper-container">
                <MainContainer />
              </div>
            </HistoryProvider>
          </EditorProvider>
        </ModalProvider>
      </DefaultProvider>
    </ErrorBoundary>
  )
}

export default App
