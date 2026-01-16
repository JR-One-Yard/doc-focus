import { splitWordForOVP } from '../lib/ovp-calculator'
import './WordDisplay.css'

/**
 * WordDisplay Component
 *
 * Displays a single word with OVP (Optimal Viewing Position) highlighting.
 * The OVP letter (scientifically determined at ~30-35% into word) is highlighted
 * in red to guide the eye to the optimal reading position.
 *
 * @param word - The word to display with OVP highlighting
 */
export interface WordDisplayProps {
  word: string;
}

export function WordDisplay({ word }: WordDisplayProps) {
  // Handle empty word case
  if (!word || word.trim().length === 0) {
    return <div className="word-display" data-testid="word-display-empty"></div>
  }

  // Split word into three parts: before OVP, OVP letter, after OVP
  const { beforeOVP, ovpLetter, afterOVP } = splitWordForOVP(word)

  return (
    <div className="word-display" data-testid="word-display">
      <span className="word-before" data-testid="word-before">
        {beforeOVP}
      </span>
      <span className="word-ovp" data-testid="word-ovp">
        {ovpLetter}
      </span>
      <span className="word-after" data-testid="word-after">
        {afterOVP}
      </span>
    </div>
  )
}
