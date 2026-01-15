/**
 * Speed Timer Utilities
 *
 * Converts between WPM (Words Per Minute) and milliseconds per word
 * for RSVP timing calculations.
 */

/**
 * Minimum allowed reading speed (WPM)
 * Below this speed, reading becomes tediously slow
 */
export const MIN_WPM = 50

/**
 * Maximum allowed reading speed (WPM)
 * Above this speed, comprehension degrades significantly (scientific research)
 * Reference: PROJECT-STATUS.md lines 169-198
 */
export const MAX_WPM = 350

/**
 * Speed at which comprehension warning should appear
 */
export const WARNING_WPM = 300

/**
 * Convert Words Per Minute to milliseconds per word
 *
 * @param wpm - Words per minute (must be between MIN_WPM and MAX_WPM)
 * @returns Milliseconds to display each word
 *
 * @example
 * wpmToMilliseconds(300) // returns 200 (200ms per word at 300 WPM)
 * wpmToMilliseconds(200) // returns 300 (300ms per word at 200 WPM)
 */
export function wpmToMilliseconds(wpm: number): number {
  // Clamp WPM to valid range
  const clampedWPM = Math.max(MIN_WPM, Math.min(MAX_WPM, wpm))

  // Calculate milliseconds per word
  // Formula: (60 seconds/minute * 1000 ms/second) / WPM = ms per word
  return Math.round(60000 / clampedWPM)
}

/**
 * Convert milliseconds per word to Words Per Minute
 *
 * @param ms - Milliseconds per word
 * @returns Words per minute
 *
 * @example
 * millisecondsToWPM(200) // returns 300 (300 WPM at 200ms per word)
 * millisecondsToWPM(300) // returns 200 (200 WPM at 300ms per word)
 */
export function millisecondsToWPM(ms: number): number {
  if (ms <= 0) return MAX_WPM

  const wpm = Math.round(60000 / ms)

  // Clamp to valid range
  return Math.max(MIN_WPM, Math.min(MAX_WPM, wpm))
}

/**
 * Validate if a WPM value is within allowed range
 *
 * @param wpm - Words per minute to validate
 * @returns true if WPM is valid, false otherwise
 */
export function isValidWPM(wpm: number): boolean {
  return wpm >= MIN_WPM && wpm <= MAX_WPM
}

/**
 * Check if WPM exceeds the comprehension warning threshold
 *
 * @param wpm - Words per minute to check
 * @returns true if warning should be displayed
 */
export function shouldShowSpeedWarning(wpm: number): boolean {
  return wpm > WARNING_WPM
}

/**
 * Calculate estimated reading time for a given word count at a specific WPM
 *
 * @param wordCount - Total number of words
 * @param wpm - Reading speed in words per minute
 * @returns Estimated reading time in seconds
 *
 * @example
 * estimateReadingTime(1500, 300) // returns 300 (5 minutes)
 */
export function estimateReadingTime(wordCount: number, wpm: number): number {
  if (wordCount <= 0 || wpm <= 0) return 0

  const minutes = wordCount / wpm
  return Math.ceil(minutes * 60) // Convert to seconds
}

/**
 * Format reading time in human-readable format
 *
 * @param seconds - Time in seconds
 * @returns Formatted string like "5m 30s" or "1h 15m"
 *
 * @example
 * formatReadingTime(330)  // returns "5m 30s"
 * formatReadingTime(4500) // returns "1h 15m"
 */
export function formatReadingTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return minutes > 0
      ? `${hours}h ${minutes}m`
      : `${hours}h`
  }

  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`
}
