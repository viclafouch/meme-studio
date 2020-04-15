import * as React from 'react'
import { ReactSVG } from 'react-svg'
import { useTranslation } from 'react-i18next'
import './loader.scss'

function Loader(): JSX.Element {
  const { i18n } = useTranslation()

  return (
    <div className="loader" aria-busy="true">
      {i18n.language === 'fr' ? (
        <ReactSVG src="images/dual-ball-fr.svg" wrapper="span" />
      ) : (
        <ReactSVG src="images/dual-ball-en.svg" wrapper="span" />
      )}
    </div>
  )
}

export default Loader
