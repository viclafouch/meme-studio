import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { DefaultProvider } from '@client/store/DefaultContext'
import ErrorBoundary from '@client/components/ErrorBoundary/ErrorBoundary'
import MainContainer from '@client/containers/Main'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage'
import { faHeading } from '@fortawesome/free-solid-svg-icons/faHeading'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'
import { faCropAlt } from '@fortawesome/free-solid-svg-icons/faCropAlt'
import { faCrop } from '@fortawesome/free-solid-svg-icons/faCrop'
import { faUndoAlt } from '@fortawesome/free-solid-svg-icons/faUndoAlt'
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons/faRedoAlt'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle'
import { faTrashRestoreAlt } from '@fortawesome/free-solid-svg-icons/faTrashRestoreAlt'
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe'
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons/faArrowCircleDown'
import { faEraser } from '@fortawesome/free-solid-svg-icons/faEraser'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faChartArea } from '@fortawesome/free-solid-svg-icons/faChartArea'
import { faClone } from '@fortawesome/free-solid-svg-icons/faClone'
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon'
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun'
import { faFlask } from '@fortawesome/free-solid-svg-icons/faFlask'
import { faClipboard } from '@fortawesome/free-solid-svg-icons/faClipboard'
import { EditorProvider } from '@client/store/EditorContext'

library.add(
  faImage,
  faHeading,
  faTwitter,
  faDownload,
  faTrashAlt,
  faPlus,
  faCropAlt,
  faCrop,
  faUndoAlt,
  faRedoAlt,
  faQuestionCircle,
  faTrashRestoreAlt,
  faGlobe,
  faArrowCircleDown,
  faEraser,
  faTimes,
  faSave,
  faCode,
  faClone,
  faMoon,
  faSun,
  faChartArea,
  faClipboard,
  faFlask
)

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <DefaultProvider>
          <EditorProvider>
            <MainContainer />
          </EditorProvider>
        </DefaultProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
