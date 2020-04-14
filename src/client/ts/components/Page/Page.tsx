import * as React from 'react'
import { useEffect } from 'react'
import { Route, RouteProps, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface PagePropsInt extends RouteProps {
  title?: string
}

const Page = (props: PagePropsInt): JSX.Element => {
  const location = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (props.title) {
      document.title = 'Meme Studio | ' + props.title
    } else {
      document.title = 'Meme Studio'
    }
  }, [location.key, i18n.language])

  const { title, ...rest } = props
  return <Route {...rest} />
}

export default Page
