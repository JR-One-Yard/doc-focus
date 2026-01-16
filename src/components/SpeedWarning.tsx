import { useState, useRef, useEffect } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap'
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
  const [dismissedAtSpeed, setDismissedAtSpeed] = useState<number | null>(null)
  const prevSpeedRef = useRef(speed)

  // Compute visibility: show if above threshold and either never dismissed or speed increased since dismissal
  const shouldShowWarning =
    speed > WARNING_THRESHOLD &&
    (dismissedAtSpeed === null || speed > dismissedAtSpeed)

  // Reset dismissed state when speed drops below threshold
  // This effect syncs dismissedAtSpeed state with speed prop changes
  useEffect(() => {
    const prevSpeed = prevSpeedRef.current
    prevSpeedRef.current = speed

    // Only reset if speed dropped from above threshold to below threshold
    // This is intentional - we want to reset the dismissed state when speed changes
    if (prevSpeed > WARNING_THRESHOLD && speed <= WARNING_THRESHOLD && dismissedAtSpeed !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissedAtSpeed(null)
    }
  }, [speed, dismissedAtSpeed])

  // Focus trap to keep keyboard focus within modal
  const modalRef = useFocusTrap<HTMLDivElement>(shouldShowWarning)

  const handleDismiss = () => {
    setDismissedAtSpeed(speed)
    onDismiss?.()
  }

  // Don't show if speed is below threshold or user has dismissed
  if (!shouldShowWarning) {
    return null
  }

  return (
    <div className="speed-warning-overlay">
      <div
        ref={modalRef}
        className="speed-warning-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="speed-warning-title"
        aria-describedby="speed-warning-description"
      >
        <div className="speed-warning-header">
          <h3 id="speed-warning-title">⚠️ High Speed Warning</h3>
          <button
            className="close-button"
            onClick={handleDismiss}
            aria-label="Dismiss warning"
          >
            ×
          </button>
        </div>
        <div className="speed-warning-content" id="speed-warning-description">
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
