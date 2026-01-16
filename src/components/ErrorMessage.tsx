/**
 * ErrorMessage Component
 *
 * Displays error messages with "Try Again" action.
 * Used for file upload and parsing errors.
 *
 * Spec: specs/file-management.md (Error Messages, lines 167-185)
 */

import './ErrorMessage.css';

interface ErrorMessageProps {
  /** The error message to display */
  message: string;
  /** Callback when user clicks "Try Again" */
  onRetry: () => void;
  /** Optional title for the error (defaults to "Error") */
  title?: string;
  /** Whether to show the retry button (default: true) */
  showRetry?: boolean;
}

/**
 * ErrorMessage Component
 *
 * Displays an error message with optional retry action.
 *
 * @example
 * ```tsx
 * <ErrorMessage
 *   message="File too large. Maximum file size is 50 MB."
 *   onRetry={() => console.log('Retry clicked')}
 * />
 * ```
 */
export function ErrorMessage({
  message,
  onRetry,
  title = 'Error',
  showRetry = true,
}: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert" aria-live="assertive">
      <div className="error-message__content">
        <div className="error-message__icon" aria-hidden="true">
          ⚠️
        </div>
        <div className="error-message__text">
          <h3 className="error-message__title">{title}</h3>
          <p className="error-message__description">{message}</p>
        </div>
      </div>
      {showRetry && (
        <button
          className="error-message__retry-button"
          onClick={onRetry}
          type="button"
          aria-label="Try again with a different file"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
