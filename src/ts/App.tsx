import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
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
  faQuestionCircle,
  faTrashRestoreAlt,
  faGlobe,
  faArrowCircleDown,
  faEraser
} from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { ModalProvider } from '@store/ModalContext'
import { EditorProvider } from '@store/EditorContext'
import { HistoryProvider } from '@store/HistoryContext'

library.add(
  faImage,
  faHeading,
  faTwitter,
  faDownload,
  faTrashAlt,
  faPlus,
  faCropAlt,
  faUndoAlt,
  faRedoAlt,
  faQuestionCircle,
  faTrashRestoreAlt,
  faGlobe,
  faArrowCircleDown,
  faEraser
)

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <Router>
        <DefaultProvider>
          <ModalProvider>
            <EditorProvider>
              <HistoryProvider>
                <MainContainer />
              </HistoryProvider>
            </EditorProvider>
          </ModalProvider>
        </DefaultProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
