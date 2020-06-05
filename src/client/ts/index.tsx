import * as React from 'react'
import { render } from 'react-dom'
import App from './App'
import './i18n'

declare global {
  interface Window {
    prerenderReady: boolean
  }
}

render(<App />, document.getElementById('app-root'))

export const debounce = <F extends (...args: any) => any>(func: F, waitFor: number): any => {
  let timeout: ReturnType<typeof setTimeout>

  const debounced = (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced as (...args: Parameters<F>) => ReturnType<F>
}

document.addEventListener('DOMContentLoaded', function () {
  const enablePrerender = debounce(() => {
    window.prerenderReady = true
    observer.disconnect()
  }, 3000)

  const observer = new PerformanceObserver(enablePrerender)

  observer.observe({
    entryTypes: ['resource', 'paint']
  })
})
