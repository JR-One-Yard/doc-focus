import { useCallback, useRef } from 'react'
import './ProgressBar.css'
import { calculateProgress, progressToIndex } from '../lib/text-parser'

export interface ProgressBarProps {
  /** Current word index (0-indexed) */
  currentIndex: number
  /** Total number of words in document */
  totalWords: number
  /** Callback when user clicks/drags to jump to a position */
  onJumpToPosition: (index: number) => void
  /** Whether the progress bar is disabled (e.g., during loading) */
  disabled?: boolean
}

/**
 * ProgressBar component
 *
 * Visual horizontal progress bar showing reading position
 * - Fills from left to right as user progresses through document
 * - Clickable to jump to specific positions
 * - Updates in real-time during playback
 * - Full accessibility support
 *
 * Spec: specs/progress-tracking.md (Visual Progress, lines 26-30)
 */
export function ProgressBar({
  currentIndex,
  totalWords,
  onJumpToPosition,
  disabled = false,
}: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Calculate current progress percentage
  const progressPercentage = calculateProgress(currentIndex, totalWords)

  /**
   * Handle click on progress bar to jump to position
   */
  const handleProgressBarClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !progressBarRef.current) return

      const rect = progressBarRef.current.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const percentage = (clickX / rect.width) * 100

      // Convert percentage to word index
      const targetIndex = progressToIndex(percentage, totalWords)

      // Jump to the calculated position
      onJumpToPosition(targetIndex)
    },
    [disabled, totalWords, onJumpToPosition]
  )

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return

      // Allow jumping with left/right arrow keys
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        const newIndex = Math.max(0, currentIndex - 1)
        onJumpToPosition(newIndex)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        const newIndex = Math.min(totalWords - 1, currentIndex + 1)
        onJumpToPosition(newIndex)
      } else if (event.key === 'Home') {
        event.preventDefault()
        onJumpToPosition(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        onJumpToPosition(totalWords - 1)
      }
    },
    [disabled, currentIndex, totalWords, onJumpToPosition]
  )

  // Format progress for accessibility
  const progressLabel = `Reading progress: ${Math.round(progressPercentage)}% complete, word ${currentIndex + 1} of ${totalWords}`

  return (
    <div className="progress-bar-container">
      <div
        ref={progressBarRef}
        className={`progress-bar-track ${disabled ? 'disabled' : ''}`}
        onClick={handleProgressBarClick}
        onKeyDown={handleKeyDown}
        role="progressbar"
        aria-label={progressLabel}
        aria-valuenow={Math.round(progressPercentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={disabled ? -1 : 0}
        title={`Click to jump to position (${Math.round(progressPercentage)}% complete)`}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
