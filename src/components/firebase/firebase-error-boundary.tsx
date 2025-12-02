'use client';

import { Component, type ReactNode } from 'react';

import { getFirebaseErrorMessage } from '@/lib/firebase/errors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for catching Firebase-related errors
 *
 * Wraps Firebase-dependent components to provide graceful error handling
 * with user-friendly messages and retry functionality.
 *
 * @example
 * ```tsx
 * <FirebaseErrorBoundary
 *   fallback={<CustomErrorComponent />}
 *   onError={(error) => logError(error)}
 * >
 *   <FirestoreDataComponent />
 * </FirebaseErrorBoundary>
 * ```
 */
export class FirebaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 font-semibold text-red-800">
            Something went wrong
          </h2>
          <p className="mb-4 text-red-600">
            {getFirebaseErrorMessage(this.state.error)}
          </p>
          <button
            onClick={this.handleRetry}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
