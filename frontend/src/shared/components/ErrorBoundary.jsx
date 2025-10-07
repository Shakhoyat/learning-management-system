import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-message">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>

            <div className="error-actions">
              <button
                className="retry-button"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              >
                Try Again
              </button>
              <button
                className="refresh-button"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre className="error-stack">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>

          <style jsx>{`
            .error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 400px;
              padding: 2rem;
            }
            
            .error-container {
              text-align: center;
              max-width: 500px;
            }
            
            .error-title {
              font-size: 1.5rem;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 1rem;
            }
            
            .error-message {
              color: #6b7280;
              margin-bottom: 2rem;
              line-height: 1.6;
            }
            
            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              margin-bottom: 2rem;
            }
            
            .retry-button,
            .refresh-button {
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 0.375rem;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            
            .retry-button {
              background-color: #3b82f6;
              color: white;
            }
            
            .retry-button:hover {
              background-color: #2563eb;
            }
            
            .refresh-button {
              background-color: #6b7280;
              color: white;
            }
            
            .refresh-button:hover {
              background-color: #4b5563;
            }
            
            .error-details {
              text-align: left;
              margin-top: 2rem;
              padding: 1rem;
              background-color: #f9fafb;
              border-radius: 0.375rem;
              border: 1px solid #e5e7eb;
            }
            
            .error-stack {
              font-family: monospace;
              font-size: 0.75rem;
              color: #dc2626;
              white-space: pre-wrap;
              overflow-x: auto;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;