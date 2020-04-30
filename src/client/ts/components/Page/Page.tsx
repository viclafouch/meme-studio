import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Route, RouteProps, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface PagePropsInt extends RouteProps {
  pageMeta: {
    title: string
    description: string
  }
}

const Page = (props: PagePropsInt): JSX.Element => {
  const { i18n } = useTranslation()
  const { pageMeta, children, ...rest } = props

  return (
    <Route {...rest}>
      <Helmet titleTemplate="Meme Studio | %s">
        <html lang={i18n.language} />
        <title lang={i18n.language}>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
      </Helmet>
      {children}
    </Route>
  )
}

export default Page
