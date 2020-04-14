import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import About from '@client/containers/About'
import Studio from '@client/containers/Studio'
import Intro from '@client/containers/Intro'
import { usePageViews } from '../shared/hooks'

function routes(): JSX.Element {
  usePageViews()

  return (
    <Switch>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/create">
        <Studio />
      </Route>
      <Route path="/">
        <Intro />
      </Route>
    </Switch>
  )
}

export default routes
