import * as React from 'react'
import { render } from 'react-dom'
import Meme from './shared/models/Meme'
import App from './App'
import './i18n'

let lastMemes: any = window.localStorage.getItem('lastMemes')
const promises: Array<Promise<void>> = []

if (lastMemes) {
  lastMemes = JSON.parse(lastMemes) as Array<any>
  lastMemes = lastMemes.map((item: object) => new Meme(item)) as Array<Meme>
  for (const meme of lastMemes) {
    promises.push(meme.image)
  }
}

Promise.all(promises).then(() => render(<App />, document.getElementById('app-root')))
