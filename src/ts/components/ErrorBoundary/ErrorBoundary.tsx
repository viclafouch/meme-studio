import * as React from 'react'
import './error-boundary.scss'

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
    if (hasError) {
      return (
        <div className="Error-boundary">
          <img id="error-image" src="https://www.gstatic.com/youtube/img/creator/error_illustration_v2.svg" />
          <span>Oops something went wrong</span>
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary
