/**
 * LoadingSpinner Component
 *
 * Displays a loading spinner with file parsing status message.
 * Shown during file parsing operations with option to cancel.
 *
 * Spec: specs/user-interface.md (Loading States, lines 105-112)
 */

import './LoadingSpinner.css';

export interface LoadingSpinnerProps {
  /** Name of the file being parsed */
  fileName: string;
  /** Optional callback to cancel the parsing operation */
  onCancel?: () => void;
}

/**
 * LoadingSpinner Component
 *
 * Displays an animated loading spinner with parsing status message.
 * Includes accessibility features for screen readers.
 *
 * @example
 * ```tsx
 * <LoadingSpinner
 *   fileName="document.pdf"
 *   onCancel={() => console.log('Cancelled')}
 * />
 * ```
 */
export function LoadingSpinner({ fileName, onCancel }: LoadingSpinnerProps) {
  return (
    <div
      className="loading-spinner"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-spinner__container">
        {/* Animated spinner */}
        <div className="loading-spinner__icon" aria-hidden="true">
          <div className="spinner"></div>
        </div>

        {/* Status message */}
        <p className="loading-spinner__message">
          Parsing <span className="loading-spinner__filename">{fileName}</span>...
        </p>

        {/* Screen reader announcement */}
        <span className="sr-only">
          Parsing file {fileName}. Please wait.
        </span>

        {/* Cancel button (if onCancel provided) */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="loading-spinner__cancel"
            aria-label="Cancel file parsing"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
