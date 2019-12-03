import * as React from 'react'
import { DefaultProvider } from '@store/DefaultContext'
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary'
import MainContainer from '@containers/Main'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faImage, faHeading, faDownload } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { ModalProvider } from '@store/ModalContext'

library.add(faImage, faHeading, faTwitter, faDownload)

function App(): JSX.Element {
  return (
    <>
      <a href="https://github.com/viclafouch/meme-studio" target="_blank" id="fork-me" rel="noopener noreferrer">
        <img
          src="https://camo.githubusercontent.com/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67"
          alt="Fork me on GitHub"
          data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"
        />
      </a>
      <ErrorBoundary>
        <DefaultProvider>
          <ModalProvider>
            <div className="wrapper-container">
              <MainContainer />
            </div>
          </ModalProvider>
        </DefaultProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
