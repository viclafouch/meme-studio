import * as React from 'react'
import { useContext } from 'react'
import Export from '../components/Modal/Export/Export'
import { EditorInt, EditorContext, EditorDispatch } from '@client/store/EditorContext'
import Router from '../routes'

function Main(): JSX.Element {
  const [{ isExportModalActive }]: [EditorInt, EditorDispatch] = useContext(EditorContext)

  return (
    <main className="main-wrapper">
      <Router />
      {isExportModalActive && <Export />}
    </main>
  )
}

export default Main
