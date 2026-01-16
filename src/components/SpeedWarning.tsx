import { useState, useEffect } from 'react'
import './SpeedWarning.css'

export interface SpeedWarningProps {
  /** Current reading speed in WPM */
  speed: number
  /** Callback when user dismisses the warning */
  onDismiss?: () => void
}

/**
 * SpeedWarning component
 *
 * Displays a modal warning when reading speed exceeds 300 WPM
 * Warns users about potential comprehension trade-offs at high speeds
 *
 * The warning is dismissible but will reappear if speed increases again above threshold
 *
 * Spec: specs/speed-controls.md (Warning Messages, lines 106-118)
 */
export function SpeedWarning({ speed, onDismiss }: SpeedWarningProps) {
  const WARNING_THRESHOLD = 300
  const [isDismissed, setIsDismissed] = useState(false)
  const [lastWarningSpeed, setLastWarningSpeed] = useState(0)

  // Reset dismissed state when speed changes significantly
  useEffect(() => {
    // If speed goes back below threshold, reset dismissed state
    if (speed <= WARNING_THRESHOLD) {
      setIsDismissed(false)
      setLastWarningSpeed(0)
    }
    // If speed increases again after being dismissed, show warning again
    else if (speed > lastWarningSpeed && isDismissed) {
      setIsDismissed(false)
    }
  }, [speed, lastWarningSpeed, isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setLastWarningSpeed(speed)
    onDismiss?.()
  }

  // Don't show if speed is below threshold or user has dismissed
  if (speed <= WARNING_THRESHOLD || isDismissed) {
    return null
  }

  return (
    <div className="speed-warning-overlay">
      <div className="speed-warning-modal">
        <div className="speed-warning-header">
          <h3>⚠️ High Speed Warning</h3>
          <button
            className="close-button"
            onClick={handleDismiss}
            aria-label="Dismiss warning"
          >
            ×
          </button>
        </div>
        <div className="speed-warning-content">
          <p>
            <strong>At speeds above 300 WPM, comprehension may decrease significantly.</strong>
          </p>
          <p>This speed is best for:</p>
          <ul>
            <li>Skimming emails and routine documents</li>
            <li>Re-reading familiar material</li>
            <li>Initial review before deep reading</li>
          </ul>
          <p>Not recommended for:</p>
          <ul>
            <li>Learning new material</li>
            <li>Technical documentation</li>
            <li>Content requiring retention</li>
          </ul>
        </div>
        <div className="speed-warning-footer">
          <button className="dismiss-button" onClick={handleDismiss}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}
