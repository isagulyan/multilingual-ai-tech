import { ReactNode, Component, ErrorInfo } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              We're sorry for the inconvenience. An unexpected error occurred.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left text-xs font-mono">
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white mb-2">
                  Error Details (Development)
                </summary>
                <p className="text-red-600 dark:text-red-400 break-words">
                  {this.state.error.message}
                </p>
              </details>
            )}
            <button
              onClick={this.reset}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-all active:scale-95"
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
