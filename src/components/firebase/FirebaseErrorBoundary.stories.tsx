import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { FirebaseErrorBoundary } from './FirebaseErrorBoundary';

/**
 * Helper component that throws an error when rendered
 */
function ErrorThrowingComponent({ message }: { message: string }): never {
  throw new Error(message);
}

/**
 * The FirebaseErrorBoundary component catches Firebase-related errors
 * in child components and displays a user-friendly error message with
 * retry functionality.
 *
 * ## Features
 *
 * - Catches errors from Firebase operations (Auth, Firestore, Storage)
 * - Displays user-friendly error messages using `getFirebaseErrorMessage`
 * - Provides a "Try again" button to reset the error state
 * - Supports custom fallback UI via the `fallback` prop
 * - Optional `onError` callback for error logging/reporting
 *
 * ## Usage
 *
 * Wrap Firebase-dependent components to provide graceful error handling:
 *
 * ```tsx
 * <FirebaseErrorBoundary
 *   fallback={<CustomErrorComponent />}
 *   onError={(error) => logError(error)}
 * >
 *   <FirestoreDataComponent />
 * </FirebaseErrorBoundary>
 * ```
 */
const meta: Meta<typeof FirebaseErrorBoundary> = {
  title: 'Components/Firebase/ErrorBoundary',
  component: FirebaseErrorBoundary,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'The child components to wrap',
      control: false,
    },
    fallback: {
      description: 'Custom UI to show when an error occurs',
      control: false,
    },
    onError: {
      description: 'Callback function called when an error is caught',
      action: 'error',
    },
  },
  args: {
    onError: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state showing children without errors.
 * The error boundary renders its children normally when no errors occur.
 */
export const Default: Story = {
  args: {
    children: (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-green-800">
          This content is rendered normally when no errors occur.
        </p>
      </div>
    ),
  },
};

/**
 * Error state showing the default fallback UI.
 * When an error is caught, the boundary displays an error message
 * with a "Try again" button.
 *
 * Note: Due to how error boundaries work in Storybook, you may see
 * the error overlay in development mode. Dismiss it to see the fallback UI.
 */
export const WithError: Story = {
  args: {
    children: <ErrorThrowingComponent message="Firebase operation failed" />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the default error fallback UI when a Firebase error occurs.',
      },
    },
  },
};

/**
 * Error state with a custom fallback component.
 * Use the `fallback` prop to provide custom error UI that matches
 * your application design.
 */
export const WithCustomFallback: Story = {
  args: {
    children: <ErrorThrowingComponent message="Connection failed" />,
    fallback: (
      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-6 text-center">
        <h3 className="mb-2 text-lg font-bold text-yellow-800">
          Oops! Something went wrong
        </h3>
        <p className="mb-4 text-yellow-700">
          We could not connect to the service. Please refresh the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
        >
          Refresh Page
        </button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates using a custom fallback component for error display.',
      },
    },
  },
};
