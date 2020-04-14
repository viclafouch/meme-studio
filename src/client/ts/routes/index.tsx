import * as React from 'react'
import { Switch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Page from '@client/components/Page/Page'
import About from '@client/containers/About'
import Studio from '@client/containers/Studio'
import Home from '@client/containers/Home'
import NotFound from '@client/containers/404'
import { usePageViews, useEditor } from '../shared/hooks'
import { UseEditorInt } from '../shared/validators'

function routes(): JSX.Element {
  const { t } = useTranslation()
  const [{ memeSelected }]: [UseEditorInt, Function] = useEditor()
  usePageViews()

  return (
    <Switch>
      <Page exact path="/">
        <Home />
      </Page>
      <Page path="/about" title={t('about')}>
        <About />
      </Page>
      <Page path="/create" title={!memeSelected ? t('createAMeme') : memeSelected.name}>
        <Studio />
      </Page>
      <Page path="*" title={t('notFound')}>
        <NotFound />
      </Page>
    </Switch>
  )
}

export default routes
