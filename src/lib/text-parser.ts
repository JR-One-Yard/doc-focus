/**
 * Text Parser Utilities
 *
 * Core text processing functions for RSVP reading.
 * Handles text cleaning, normalization, and word extraction.
 */

/**
 * Parse raw text into an array of words for RSVP display
 *
 * @param text - Raw text content to parse
 * @returns Array of words (with punctuation preserved)
 *
 * @example
 * parseTextToWords("Hello, world! This is a test.")
 * // returns ["Hello,", "world!", "This", "is", "a", "test."]
 */
export function parseTextToWords(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return []
  }

  // Clean and normalize the text
  const cleaned = cleanText(text)

  // Split on whitespace and filter out empty strings
  const words = cleaned.split(/\s+/).filter(word => word.length > 0)

  return words
}

/**
 * Clean and normalize text
 * - Remove excessive whitespace
 * - Normalize line breaks
 * - Preserve paragraph breaks
 *
 * @param text - Raw text to clean
 * @returns Cleaned text
 */
export function cleanText(text: string): string {
  if (!text) return ''

  return text
    // Normalize line endings to \n
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Preserve paragraph breaks (double newlines)
    .replace(/\n\n+/g, '\n\n')
    // Replace single newlines with spaces
    .replace(/\n/g, ' ')
    // Collapse multiple spaces into single space
    .replace(/\s+/g, ' ')
    // Trim leading/trailing whitespace
    .trim()
}

/**
 * Extract text content from HTML string
 * Strips HTML tags but preserves text content
 *
 * @param html - HTML string
 * @returns Plain text content
 */
export function extractTextFromHTML(html: string): string {
  if (!html) return ''

  // Create a temporary DOM element to parse HTML
  const temp = document.createElement('div')
  temp.innerHTML = html

  // Get text content (automatically strips tags)
  return temp.textContent || temp.innerText || ''
}

/**
 * Count total words in text
 *
 * @param text - Text to count words in
 * @returns Number of words
 */
export function countWords(text: string): number {
  return parseTextToWords(text).length
}

/**
 * Calculate reading progress as a percentage
 *
 * @param currentIndex - Current word index (0-based)
 * @param totalWords - Total number of words
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(currentIndex: number, totalWords: number): number {
  if (totalWords === 0) return 0

  const progress = ((currentIndex + 1) / totalWords) * 100
  return Math.min(100, Math.max(0, progress))
}

/**
 * Convert progress percentage to word index
 *
 * @param percentage - Progress percentage (0-100)
 * @param totalWords - Total number of words
 * @returns Word index (0-based)
 */
export function progressToIndex(percentage: number, totalWords: number): number {
  if (totalWords === 0) return 0

  const clampedPercentage = Math.min(100, Math.max(0, percentage))
  return Math.floor((clampedPercentage / 100) * totalWords)
}

/**
 * Validate if text content is usable for RSVP reading
 *
 * @param text - Text to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validateText(text: string): { isValid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      error: 'Text is empty or contains only whitespace'
    }
  }

  const words = parseTextToWords(text)

  if (words.length === 0) {
    return {
      isValid: false,
      error: 'No readable words found in text'
    }
  }

  if (words.length === 1) {
    return {
      isValid: true,
      error: 'Warning: Text contains only one word'
    }
  }

  return { isValid: true }
}

/**
 * Strip punctuation from a word
 * Useful for word processing that needs clean words
 *
 * @param word - Word with possible punctuation
 * @returns Word without leading/trailing punctuation
 *
 * @example
 * stripPunctuation("hello,")  // returns "hello"
 * stripPunctuation("'world'") // returns "world"
 */
export function stripPunctuation(word: string): string {
  // Remove leading and trailing punctuation but preserve internal characters
  return word.replace(/^[^\w]+|[^\w]+$/g, '')
}
