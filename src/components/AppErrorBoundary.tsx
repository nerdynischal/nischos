import { Component, type ErrorInfo, type ReactNode } from 'react'

type AppErrorBoundaryState = {
  hasError: boolean
}

export class AppErrorBoundary extends Component<
  { children: ReactNode },
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('nischalOS failed to render.', error, errorInfo)
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="fatal-error" role="alert">
        <section className="fatal-error-panel">
          <p className="fatal-error-label">nischalOS</p>
          <h1>Something went wrong.</h1>
          <p>The desktop could not start. Reload the page to try again.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload nischalOS
          </button>
        </section>
      </main>
    )
  }
}
