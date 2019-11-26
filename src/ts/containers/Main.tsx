import * as React from 'react'
import Button from '../components/Button/Button'

function Main(): JSX.Element {
  return (
    <main>
      <div className="main__header">
        <h1>Meme Studio</h1>
        <p>Create a meme from JPG, GIF or PNG images. Edit your image and make a meme.</p>
      </div>
      <div className="main__body">
        <Button>Get started</Button>
      </div>
    </main>
  )
}

export default Main
