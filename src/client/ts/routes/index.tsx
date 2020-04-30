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

const TermsAsync = Loadable({
  loader: async () => {
    const container = await import('@client/containers/Terms')
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
      <Page
        exact
        path="/"
        pageMeta={{
          title: t('home.meta.title'),
          description: t('home.meta.description')
        }}
      >
        <HomeAsync />
      </Page>
      <Page
        path="/about"
        pageMeta={{
          title: t('about.meta.title'),
          description: t('about.meta.description')
        }}
      >
        <AboutAsync />
      </Page>
      <Page
        path="/terms"
        pageMeta={{
          title: t('legal.meta.title'),
          description: t('legal.meta.description')
        }}
      >
        <TermsAsync />
      </Page>
      <Page
        path="/create"
        pageMeta={{
          title: !memeSelected ? t('studio.meta.title') : memeSelected.name,
          description: t('studio.meta.description')
        }}
      >
        <StudioAsync />
      </Page>
      <Page
        path="*"
        pageMeta={{
          title: t('notFound.meta.title'),
          description: t('notFound.meta.description')
        }}
      >
        <NotFound />
      </Page>
    </Switch>
  )
}

export default routes
