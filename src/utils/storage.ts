/**
 * LocalStorage utilities for persisting reading positions
 *
 * Manages reading progress across sessions using browser localStorage.
 * Stores position, speed, and metadata for up to 50 recent documents.
 *
 * Spec: specs/progress-tracking.md (LocalStorage Schema, lines 124-136)
 */

const STORAGE_KEY = 'fastreader_positions'
const MAX_STORED_DOCUMENTS = 50
const MAX_AGE_DAYS = 30

/**
 * Reading position data stored in localStorage
 */
export interface ReadingPosition {
  /** Unique identifier for the document (filename + filesize) */
  documentId: string
  /** Original file name */
  fileName: string
  /** Current word index (0-based) */
  currentWordIndex: number
  /** Total number of words in document */
  totalWords: number
  /** Unix timestamp (milliseconds) when position was saved */
  timestamp: number
  /** Reading speed in WPM at time of save */
  speed: number
}

/**
 * Generate unique document ID from filename and file size
 *
 * Uses simple concatenation for MVP. More robust content hashing
 * could be implemented in the future.
 *
 * @param fileName - Name of the file
 * @param fileSize - Size of the file in bytes
 * @returns Unique document identifier
 *
 * Spec: specs/progress-tracking.md (Document Identification, lines 106-120)
 */
export function generateDocumentId(fileName: string, fileSize: number): string {
  return `${fileName}-${fileSize}`
}

/**
 * Load all reading positions from localStorage
 *
 * @returns Array of reading positions sorted by timestamp (most recent first), or empty array if none found
 */
function loadAllPositions(): ReadingPosition[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      return []
    }

    const positions = JSON.parse(data) as ReadingPosition[]
    if (!Array.isArray(positions)) {
      return []
    }

    // Always sort by timestamp (most recent first) for consistency
    return positions.sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error('Failed to load reading positions:', error)
    return []
  }
}

/**
 * Save all reading positions to localStorage
 *
 * @param positions - Array of reading positions to save
 */
function saveAllPositions(positions: ReadingPosition[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
  } catch (error) {
    console.error('Failed to save reading positions:', error)
    // Handle localStorage quota exceeded gracefully
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Cleaning up old positions...')
      // Try to clean up and save again
      const cleaned = cleanupOldPositions(positions)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
      } catch (retryError) {
        console.error('Failed to save even after cleanup:', retryError)
      }
    }
  }
}

/**
 * Save reading position for a document
 *
 * Updates existing position if document already has saved progress,
 * or creates new entry. Automatically manages storage limits.
 *
 * @param position - Reading position to save
 *
 * Spec: specs/progress-tracking.md (LocalStorage Schema, lines 124-136)
 */
export function saveReadingPosition(position: ReadingPosition): void {
  const positions = loadAllPositions()

  // Find existing position for this document
  const existingIndex = positions.findIndex(
    p => p.documentId === position.documentId
  )

  if (existingIndex >= 0) {
    // Update existing position
    positions[existingIndex] = {
      ...position,
      timestamp: Date.now(),
    }
  } else {
    // Add new position
    positions.push({
      ...position,
      timestamp: Date.now(),
    })
  }

  // Sort by timestamp (most recent first)
  positions.sort((a, b) => b.timestamp - a.timestamp)

  // Limit to MAX_STORED_DOCUMENTS
  const limitedPositions = positions.slice(0, MAX_STORED_DOCUMENTS)

  saveAllPositions(limitedPositions)
}

/**
 * Load reading position for a specific document
 *
 * @param documentId - Unique document identifier
 * @returns Reading position if found, null otherwise
 *
 * Spec: specs/progress-tracking.md (LocalStorage Schema, lines 124-136)
 */
export function loadReadingPosition(documentId: string): ReadingPosition | null {
  const positions = loadAllPositions()
  return positions.find(p => p.documentId === documentId) || null
}

/**
 * Remove old reading positions from storage
 *
 * Removes positions older than MAX_AGE_DAYS and keeps only
 * MAX_STORED_DOCUMENTS most recent positions.
 *
 * @param positions - Optional array of positions to clean (uses stored if not provided)
 * @returns Cleaned array of positions
 *
 * Spec: specs/progress-tracking.md (Cleanup Strategy, lines 162-166)
 */
export function cleanupOldPositions(
  positions?: ReadingPosition[]
): ReadingPosition[] {
  const allPositions = positions || loadAllPositions()

  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000 // Convert days to milliseconds
  const cutoffTime = Date.now() - maxAge

  // Filter out positions older than MAX_AGE_DAYS
  const recentPositions = allPositions.filter(p => p.timestamp >= cutoffTime)

  // Sort by timestamp (most recent first)
  recentPositions.sort((a, b) => b.timestamp - a.timestamp)

  // Keep only MAX_STORED_DOCUMENTS most recent
  const cleanedPositions = recentPositions.slice(0, MAX_STORED_DOCUMENTS)

  // Save cleaned positions back to storage (only if we loaded from storage)
  if (!positions) {
    saveAllPositions(cleanedPositions)
  }

  return cleanedPositions
}

/**
 * Remove a specific reading position
 *
 * @param documentId - Document ID to remove
 */
export function removeReadingPosition(documentId: string): void {
  const positions = loadAllPositions()
  const filtered = positions.filter(p => p.documentId !== documentId)
  saveAllPositions(filtered)
}

/**
 * Clear all reading positions from localStorage
 *
 * Useful for testing or user-initiated data clearing.
 */
export function clearAllPositions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear reading positions:', error)
  }
}

/**
 * Get count of stored reading positions
 *
 * @returns Number of stored positions
 */
export function getStoredPositionCount(): number {
  return loadAllPositions().length
}

/**
 * Get all stored reading positions
 *
 * Useful for displaying reading history to user.
 *
 * @returns Array of all stored reading positions
 */
export function getAllPositions(): ReadingPosition[] {
  return loadAllPositions()
}
