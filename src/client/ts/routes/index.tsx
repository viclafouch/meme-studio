import * as React from 'react'
import * as nprogress from 'nprogress'
import * as Loadable from 'react-loadable'
import { LoadingComponentProps } from 'react-loadable'
import { Switch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Page from '@client/components/Page/Page'
import NotFound from '@client/containers/404'
import { usePageViews } from '../shared/hooks'
import { FatalError } from '@client/components/ErrorBoundary/ErrorBoundary'
import { loadFonts } from '@client/components/WrapperCanvas/WrapperCanvas'

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

const QaAsync = Loadable({
  loader: async () => {
    const container = await import('@client/containers/qa')
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

const GalleryAsync = Loadable({
  loader: async () => {
    const container = await import('@client/containers/Gallery')
    nprogress.done()
    return container
  },
  loading: Loading,
  delay: 200,
  timeout: 5000
})

export const StudioAsync = Loadable({
  loader: async () => {
    await loadFonts
    const container = await import('@client/containers/Studio')
    nprogress.done()
    return container
  },
  loading: Loading,
  delay: 200,
  timeout: 5000
})

function Routes(): JSX.Element {
  const { t } = useTranslation()
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
        component={HomeAsync}
      />
      <Page
        path="/about"
        pageMeta={{
          title: t('about.meta.title'),
          description: t('about.meta.description')
        }}
        component={AboutAsync}
      />
      <Page
        path="/terms"
        pageMeta={{
          title: t('legal.meta.title'),
          description: t('legal.meta.description')
        }}
        component={TermsAsync}
      />
      <Page
        path="/qa"
        pageMeta={{
          title: t('qa.meta.title'),
          description: t('qa.meta.description')
        }}
        component={QaAsync}
      />
      <Page
        exact
        path="/create"
        pageMeta={{
          title: t('studio.meta.title'),
          description: t('studio.meta.description')
        }}
        component={StudioAsync}
      />
      <Page
        path="/create/:memeId"
        pageMeta={{
          title: t('studio.meta.title'),
          description: t('studio.meta.description')
        }}
        component={StudioAsync}
      />
      <Page
        path="/gallery"
        pageMeta={{
          title: t('gallery.meta.title'),
          description: t('gallery.meta.description')
        }}
        component={GalleryAsync}
      />
      <Page
        path="*"
        pageMeta={{
          title: t('notFound.meta.title'),
          description: t('notFound.meta.description')
        }}
        component={NotFound}
      />
    </Switch>
  )
}

export default React.memo(Routes)
