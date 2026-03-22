import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * React Error Boundary — catches rendering errors anywhere in the child tree
 * and displays a fallback UI instead of a white screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section
          id="error-boundary-fallback"
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            gap: '1.5rem',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ opacity: 0.7, maxWidth: '40ch' }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'linear-gradient(135deg, var(--brand-accent, #38bdf8), var(--brand-primary, #6366f1))',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Refresh Page
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
