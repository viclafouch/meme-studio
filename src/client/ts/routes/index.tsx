import * as React from 'react'
import loadable from '@loadable/component'
import { Switch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import * as nprogress from 'nprogress'
import { TFunction } from 'i18next'
import Page from '@client/components/Page/Page'
import NotFound from '@client/containers/404'
import { usePageViews } from '../shared/hooks'
import { loadFonts } from '@client/components/WrapperCanvas/WrapperCanvas'

nprogress.start()

const resolveComponent = (components: any): React.ComponentType => {
  nprogress.done()
  return components.default
}

export const routes = {
  home: {
    path: '/',
    Component: loadable(() => import('@client/containers/Home'), {
      resolveComponent: resolveComponent
    }),
    exact: true,
    metas: {
      title: (t: TFunction): string => t('about.meta.title'),
      description: (t: TFunction): string => t('about.meta.description')
    }
  },
  about: {
    path: '/about',
    Component: loadable(() => import('@client/containers/About'), {
      resolveComponent: resolveComponent
    }),
    exact: true,
    metas: {
      title: (t: TFunction): string => t('about.meta.title'),
      description: (t: TFunction): string => t('about.meta.description')
    }
  },
  qa: {
    path: '/qa',
    Component: loadable(() => import('@client/containers/qa'), {
      resolveComponent: resolveComponent
    }),
    exact: true,
    metas: {
      title: (t: TFunction): string => t('qa.meta.title'),
      description: (t: TFunction): string => t('qa.meta.description')
    }
  },
  terms: {
    path: '/terms',
    Component: loadable(() => import('@client/containers/Terms'), {
      resolveComponent: resolveComponent
    }),
    exact: true,
    metas: {
      title: (t: TFunction): string => t('legal.meta.title'),
      description: (t: TFunction): string => t('legal.meta.description')
    }
  },
  gallery: {
    path: '/gallery',
    Component: loadable(() => import('@client/containers/Gallery'), {
      resolveComponent: resolveComponent
    }),
    exact: true,
    metas: {
      title: (t: TFunction): string => t('gallery.meta.title'),
      description: (t: TFunction): string => t('gallery.meta.description')
    }
  }
}

export const StudioAsync = loadable(
  async () => {
    await loadFonts
    return import('@client/containers/Studio')
  },
  {
    resolveComponent: resolveComponent
  }
)

function Routes(): JSX.Element {
  const { t } = useTranslation()
  usePageViews()

  return (
    <Switch>
      {(Object.keys(routes) as Array<keyof typeof routes>).map(name => {
        const route = routes[name] as any
        return (
          <Page
            key={route.path}
            exact={route.exact}
            path={route.path}
            pageMeta={{
              title: route.metas.title(t),
              description: route.metas.description(t)
            }}
            component={route.Component}
          />
        )
      })}
      <Page
        path="/create"
        exact
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
