import * as React from 'react'
import * as nprogress from 'nprogress'
import * as Loadable from 'react-loadable'
import { LoadingComponentProps } from 'react-loadable'
import { Switch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Page from '@client/components/Page/Page'
import NotFound from '@client/containers/404'
import { usePageViews, useEditor } from '../shared/hooks'
import { UseEditorInt } from '../shared/validators'
import { FatalError } from '@client/components/ErrorBoundary/ErrorBoundary'

function Loading(props: LoadingComponentProps): JSX.Element {
  if (props.error) {
    return <FatalError />
  } else if (props.pastDelay) {
    nprogress.start()
    return null
  } else {
    return null
  }
}

const AboutAsync = Loadable({
  loader: async () => {
    const container = await import('@client/containers/About')
    nprogress.done()
    return container
  },
  loading: Loading,
  delay: 200,
  timeout: 5000
})

const HomeAsync = Loadable({
  loader: async () => {
    const container = await import('@client/containers/Home')
    nprogress.done()
    return container
  },
  loading: Loading,
  delay: 200,
  timeout: 5000
})

const StudioAsync = Loadable({
  loader: async () => {
    const container = await import('@client/containers/Studio')
    nprogress.done()
    return container
  },
  loading: Loading,
  delay: 200,
  timeout: 5000
})

StudioAsync.preload()

function routes(): JSX.Element {
  const { t } = useTranslation()
  const [{ memeSelected }]: [UseEditorInt, Function] = useEditor()
  usePageViews()

  return (
    <Switch>
      <Page exact path="/" title={t('makeYourOwnMeme')}>
        <HomeAsync />
      </Page>
      <Page path="/about" title={t('about')}>
        <AboutAsync />
      </Page>
      <Page path="/create" title={!memeSelected ? t('createAMeme') : memeSelected.name}>
        <StudioAsync />
      </Page>
      <Page path="*" title={t('notFound')}>
        <NotFound />
      </Page>
    </Switch>
  )
}

export default routes
