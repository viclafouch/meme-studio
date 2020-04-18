import * as React from 'react'
import { ReactSVG } from 'react-svg'
import './error-boundary.scss'

export const FatalError = (): JSX.Element => (
  <div className="error-boundary">
    <ReactSVG className="error-boundary-img" src="images/error_illustration_v2.svg" wrapper="div" />
    <span>Oops something went wrong</span>
  </div>
)

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
