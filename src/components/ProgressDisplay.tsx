export interface ProgressDisplayProps {
  /** Current word index (0-indexed) */
  currentIndex: number
  /** Total number of words in document */
  totalWords: number
}

/**
 * ProgressDisplay component
 *
 * Displays the current reading position as "Word X of Y"
 * Updates in real-time during playback
 *
 * Spec: specs/progress-tracking.md (Position Tracking, lines 20-24)
 */
export function ProgressDisplay({
  currentIndex,
  totalWords,
}: ProgressDisplayProps) {
  // Display as 1-indexed for user-facing text (Word 1, not Word 0)
  const currentWord = currentIndex + 1
  const percentage = totalWords > 0 ? Math.round((currentWord / totalWords) * 100) : 0

  return (
    <div className="progress-display">
      <span className="word-counter">
        Word {currentWord.toLocaleString()} of {totalWords.toLocaleString()}
      </span>
      <span className="percentage"> ({percentage}%)</span>
    </div>
  )
}
