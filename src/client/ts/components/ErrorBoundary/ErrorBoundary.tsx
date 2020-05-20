import * as React from 'react'
import { ReactSVG } from 'react-svg'
import { useTranslation } from 'react-i18next'
import './error-boundary.scss'

export const FatalError = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="error-boundary">
      <ReactSVG
        beforeInjection={(svg: SVGElement): void => {
          svg.classList.add('error-boundary-img')
          svg.setAttribute('style', 'width: 300px; height: 300px')
        }}
        src="/images/oops.svg"
        wrapper="div"
      />
      <span>{t('oops')}</span>
      <a href="/" className="back-to-home">
        {t('backToHome')}
      </a>
    </div>
  )
}

export class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  }

  static getDerivedStateFromError(): any {
    return { hasError: true }
  }

  componentDidCatch(error: Error): void {
    console.error(error)
  }

  render(): React.ReactNode {
    const { hasError } = this.state
    const { children } = this.props
    if (hasError) return <FatalError />
    return children
  }
}

export default ErrorBoundary
