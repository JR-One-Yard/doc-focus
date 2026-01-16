import { useEffect, useRef } from 'react'
import { splitWordForOVP } from '../lib/ovp-calculator'
import './WordDisplay.css'

/**
 * WordDisplay Component
 *
 * Displays a single word with OVP (Optimal Viewing Position) highlighting.
 * The OVP letter stays at a FIXED screen position, and the word positions
 * itself around it for optimal RSVP reading.
 *
 * @param word - The word to display with OVP highlighting
 */
export interface WordDisplayProps {
  word: string;
}

export function WordDisplay({ word }: WordDisplayProps) {
  const wordRef = useRef<HTMLDivElement>(null)
  const beforeRef = useRef<HTMLSpanElement>(null)

  // Handle empty word case
  if (!word || word.trim().length === 0) {
    return <div className="word-display" data-testid="word-display-empty"></div>
  }

  // Split word into three parts: before OVP, OVP letter, after OVP
  const { beforeOVP, ovpLetter, afterOVP } = splitWordForOVP(word)

  // Position word so OVP letter stays at FIXED anchor point (0, 0) which is screen center
  useEffect(() => {
    if (wordRef.current && beforeRef.current) {
      // Measure the width of the "before" part
      const beforeWidth = beforeRef.current.offsetWidth

      // Also measure half the OVP letter width to center it on the anchor
      const ovpElement = wordRef.current.querySelector('.word-ovp') as HTMLElement
      const ovpHalfWidth = ovpElement ? ovpElement.offsetWidth / 2 : 0

      // Calculate offset: shift left by (beforeWidth + half of OVP width)
      const offset = beforeWidth + ovpHalfWidth

      // Apply transform to shift word left AND vertically center
      wordRef.current.style.transform = `translate(-${offset}px, -50%)`
    }
  }, [word, beforeOVP]) // Recalculate when word changes

  return (
    <div className="word-display" ref={wordRef} data-testid="word-display">
      <span className="word-before" ref={beforeRef} data-testid="word-before">
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
