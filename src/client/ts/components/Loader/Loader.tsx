import * as React from 'react'
import { ReactSVG } from 'react-svg'
import { useTranslation } from 'react-i18next'
import './loader.scss'

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

function Loader(): JSX.Element {
  const { i18n } = useTranslation()

  let loader

  if (!isSafari) {
    loader =
      i18n.language === 'fr' ? (
        <ReactSVG src="/images/dual-ball-fr.svg" wrapper="span" />
      ) : (
        <ReactSVG src="/images/dual-ball-en.svg" wrapper="span" />
      )
  } else {
    loader = <img src="/images/loading.gif" alt="Loading" />
  }

  return (
    <div className="loader" aria-busy="true">
      {loader}
    </div>
  )
}

export default Loader
