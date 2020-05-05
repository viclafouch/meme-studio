import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Route, RouteProps, useLocation, RouteComponentProps, Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { hasRecoverVersion } from '@client/utils/helpers'
import Meme from '@client/ts/shared/models/Meme'

interface PagePropsInt extends RouteProps {
  pageMeta: {
    title: string
    description: string
  }
  computedMatch?: any
}

const renderMergedProps = (
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>,
  ...rest: any
): JSX.Element => {
  const finalProps = Object.assign({}, ...rest)
  return React.createElement(component, finalProps)
}

const SITE_URL: string = window.location.origin

const Page = (props: PagePropsInt): JSX.Element => {
  const { i18n } = useTranslation()
  const { pageMeta, component, ...rest } = props
  const { pathname } = useLocation()

  if (props.computedMatch.url === '/create' && hasRecoverVersion()) {
    let memeSaved: any = window.localStorage.getItem('memeSelected')
    memeSaved = new Meme(JSON.parse(memeSaved)) as Meme
    return <Redirect to={`/create/${memeSaved.id}`} />
  }

  return (
    <>
      <Helmet titleTemplate="Meme Studio | %s">
        <html lang={i18n.language} />
        <title lang={i18n.language}>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <link rel="canonical" href={`${SITE_URL}${pathname}`} />
        <base target="_blank" href={SITE_URL} />
      </Helmet>
      <Route
        {...rest}
        render={(routeProps: RouteComponentProps): JSX.Element => {
          return renderMergedProps(component, routeProps, rest)
        }}
      />
    </>
  )
}

export default Page
