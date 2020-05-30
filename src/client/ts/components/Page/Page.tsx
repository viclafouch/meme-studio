import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Route, RouteProps, useLocation, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EditorContext, EditorState } from '@client/store/EditorContext'

interface PagePropsInt extends RouteProps {
  pageMeta: {
    title: string
    description: string
  }
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
  const { pageMeta, component, ...rest } = props
  const { i18n } = useTranslation()
  const { pathname } = useLocation()

  return (
    <>
      <EditorContext.Consumer>
        {([{ memeSelected }]: [EditorState]): React.ReactChild => (
          <Helmet titleTemplate="Meme Studio | %s">
            <html lang={i18n.language} />
            <title lang={i18n.language}>
              {memeSelected && pathname.startsWith('/create') ? memeSelected.name(i18n.language) : pageMeta.title}
            </title>
            {memeSelected && pathname.startsWith('/create') && (
              <meta name="keywords" content={memeSelected.keywords(i18n.language)} />
            )}
            <meta name="description" content={pageMeta.description} />
            <link rel="canonical" href={`${SITE_URL}${pathname}`} />
            <base target="_blank" href={SITE_URL} />
          </Helmet>
        )}
      </EditorContext.Consumer>

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
