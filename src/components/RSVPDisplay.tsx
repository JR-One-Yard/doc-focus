import { WordDisplay } from './WordDisplay'
import './RSVPDisplay.css'

/**
 * RSVPDisplay Component
 *
 * Container for RSVP (Rapid Serial Visual Presentation) word display.
 * Shows one word at a time with OVP highlighting at a fixed screen position.
 *
 * The component is centered absolutely on screen to ensure the OVP letter
 * position remains constant across all words.
 */
export interface RSVPDisplayProps {
  /** Current word to display */
  word: string;
  /** Current word index (0-indexed) */
  currentIndex: number;
  /** Total number of words in document */
  totalWords: number;
}

export function RSVPDisplay({ word, currentIndex, totalWords }: RSVPDisplayProps) {
  return (
    <div className="rsvp-display" data-testid="rsvp-display">
      {/* Screen reader live region for word announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
        data-testid="rsvp-live-region"
      >
        {word}
      </div>

      {/* Main word display - absolutely centered */}
      <div className="rsvp-word-container" aria-hidden="true">
        <WordDisplay word={word} />
      </div>

      {/* Progress indicator - bottom of display */}
      <div className="rsvp-progress" data-testid="rsvp-progress" aria-live="polite">
        Word {currentIndex + 1} of {totalWords}
      </div>
    </div>
  )
}
