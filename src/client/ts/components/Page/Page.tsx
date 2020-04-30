import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Route, RouteProps, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface PagePropsInt extends RouteProps {
  pageMeta: {
    title: string
    description: string
  }
}

const SITE_URL: string = window.location.origin

const Page = (props: PagePropsInt): JSX.Element => {
  const { i18n } = useTranslation()
  const { pageMeta, children, ...rest } = props
  const { pathname } = useLocation()

  return (
    <Route {...rest}>
      <Helmet titleTemplate="Meme Studio | %s">
        <html lang={i18n.language} />
        <title lang={i18n.language}>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <link rel="canonical" href={`${SITE_URL}${pathname}`} />
        <base target="_blank" href={SITE_URL} />
      </Helmet>
      {children}
    </Route>
  )
}

export default Page
