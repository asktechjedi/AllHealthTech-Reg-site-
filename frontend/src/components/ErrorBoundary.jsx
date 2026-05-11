import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info)
    this.setState({ errorInfo: info?.componentStack })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="max-w-md text-gray-500">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          {this.state.errorInfo && (
            <pre className="max-w-2xl text-left text-xs text-red-600 bg-red-50 p-4 rounded-lg overflow-auto max-h-48">
              {this.state.errorInfo}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
