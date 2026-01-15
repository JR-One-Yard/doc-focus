/**
 * OVP (Optimal Viewing Position) Calculator
 *
 * Calculates the optimal letter position for eye fixation within a word
 * to achieve fastest word recognition.
 *
 * Based on scientific research showing OVP is approximately 30-35% into
 * the word from the start for English text.
 *
 * Reference: PROJECT-STATUS.md lines 72-80
 */

/**
 * Calculate the optimal viewing position (0-indexed) for a given word
 *
 * @param word - The word to calculate OVP for
 * @returns The 0-indexed position of the optimal letter to highlight
 *
 * @example
 * calculateOVP("the")        // returns 1 (h)
 * calculateOVP("reading")    // returns 2 (a)
 * calculateOVP("comprehension") // returns 3 (p)
 */
export function calculateOVP(word: string): number {
  const length = word.length

  // Handle edge cases
  if (length === 0) return 0
  if (length === 1) return 0

  // Words ≤3 letters: position 1 (second character)
  if (length <= 3) return 1

  // Words 4-6 letters: position 2 (third character)
  if (length <= 6) return 2

  // Words 7-9 letters: ~35% into word
  if (length <= 9) return Math.floor(length * 0.35)

  // Words ≥10 letters: ~30% into word
  return Math.floor(length * 0.30)
}

/**
 * Split a word into three parts for OVP highlighting:
 * - Before OVP
 * - OVP letter (to be highlighted)
 * - After OVP
 *
 * @param word - The word to split
 * @returns Object with beforeOVP, ovpLetter, and afterOVP strings
 *
 * @example
 * splitWordForOVP("reading")
 * // returns { beforeOVP: "re", ovpLetter: "a", afterOVP: "ding" }
 */
export function splitWordForOVP(word: string): {
  beforeOVP: string
  ovpLetter: string
  afterOVP: string
} {
  if (!word || word.length === 0) {
    return { beforeOVP: '', ovpLetter: '', afterOVP: '' }
  }

  const ovpIndex = calculateOVP(word)

  return {
    beforeOVP: word.slice(0, ovpIndex),
    ovpLetter: word[ovpIndex] || '',
    afterOVP: word.slice(ovpIndex + 1)
  }
}
