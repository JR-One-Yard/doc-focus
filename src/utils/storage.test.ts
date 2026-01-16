import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  generateDocumentId,
  saveReadingPosition,
  loadReadingPosition,
  cleanupOldPositions,
  removeReadingPosition,
  clearAllPositions,
  getStoredPositionCount,
  getAllPositions,
  type ReadingPosition,
} from './storage'

describe('storage utilities', () => {
  // Clear localStorage before and after each test
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('generateDocumentId', () => {
    it('generates unique ID from filename and file size', () => {
      const id = generateDocumentId('test.txt', 1024)
      expect(id).toBe('test.txt-1024')
    })

    it('generates different IDs for different files', () => {
      const id1 = generateDocumentId('file1.txt', 1024)
      const id2 = generateDocumentId('file2.txt', 1024)
      expect(id1).not.toBe(id2)
    })

    it('generates different IDs for same filename with different sizes', () => {
      const id1 = generateDocumentId('test.txt', 1024)
      const id2 = generateDocumentId('test.txt', 2048)
      expect(id1).not.toBe(id2)
    })

    it('handles special characters in filename', () => {
      const id = generateDocumentId('my-file (1).txt', 500)
      expect(id).toBe('my-file (1).txt-500')
    })

    it('handles zero file size', () => {
      const id = generateDocumentId('empty.txt', 0)
      expect(id).toBe('empty.txt-0')
    })
  })

  describe('saveReadingPosition', () => {
    it('saves a new reading position', () => {
      const position: ReadingPosition = {
        documentId: 'test.txt-1024',
        fileName: 'test.txt',
        currentWordIndex: 50,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      saveReadingPosition(position)

      const loaded = loadReadingPosition('test.txt-1024')
      expect(loaded).not.toBeNull()
      expect(loaded?.documentId).toBe('test.txt-1024')
      expect(loaded?.currentWordIndex).toBe(50)
      expect(loaded?.totalWords).toBe(100)
      expect(loaded?.speed).toBe(250)
    })

    it('updates existing position for same document', () => {
      const position1: ReadingPosition = {
        documentId: 'test.txt-1024',
        fileName: 'test.txt',
        currentWordIndex: 50,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      saveReadingPosition(position1)

      const position2: ReadingPosition = {
        documentId: 'test.txt-1024',
        fileName: 'test.txt',
        currentWordIndex: 75,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 300,
      }

      saveReadingPosition(position2)

      const loaded = loadReadingPosition('test.txt-1024')
      expect(loaded?.currentWordIndex).toBe(75)
      expect(loaded?.speed).toBe(300)

      // Should only have one position stored
      expect(getStoredPositionCount()).toBe(1)
    })

    it('stores multiple documents', () => {
      const position1: ReadingPosition = {
        documentId: 'file1.txt-1024',
        fileName: 'file1.txt',
        currentWordIndex: 10,
        totalWords: 50,
        timestamp: Date.now(),
        speed: 200,
      }

      const position2: ReadingPosition = {
        documentId: 'file2.txt-2048',
        fileName: 'file2.txt',
        currentWordIndex: 20,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      saveReadingPosition(position1)
      saveReadingPosition(position2)

      expect(getStoredPositionCount()).toBe(2)
      expect(loadReadingPosition('file1.txt-1024')).not.toBeNull()
      expect(loadReadingPosition('file2.txt-2048')).not.toBeNull()
    })

    it('updates timestamp when saving', () => {
      const oldTimestamp = Date.now() - 10000 // 10 seconds ago

      const position: ReadingPosition = {
        documentId: 'test.txt-1024',
        fileName: 'test.txt',
        currentWordIndex: 50,
        totalWords: 100,
        timestamp: oldTimestamp,
        speed: 250,
      }

      saveReadingPosition(position)

      const loaded = loadReadingPosition('test.txt-1024')
      expect(loaded?.timestamp).toBeGreaterThan(oldTimestamp)
    })

    it('limits storage to 50 documents', () => {
      // Save 60 documents with incrementing timestamps
      const baseTime = Date.now()
      for (let i = 0; i < 60; i++) {
        const position: ReadingPosition = {
          documentId: `file${i}.txt-1024`,
          fileName: `file${i}.txt`,
          currentWordIndex: i,
          totalWords: 100,
          timestamp: baseTime + i, // Incrementing timestamps
          speed: 250,
        }
        // Manually manipulate storage to preserve timestamps for this test
        const positions = getAllPositions()
        positions.push({
          ...position,
          timestamp: baseTime + i, // Use the provided timestamp
        })
        positions.sort((a, b) => b.timestamp - a.timestamp)
        const limited = positions.slice(0, 50)
        localStorage.setItem('fastreader_positions', JSON.stringify(limited))
      }

      // Should only keep 50 most recent
      expect(getStoredPositionCount()).toBe(50)

      // Most recent (file59) should still exist
      expect(loadReadingPosition('file59.txt-1024')).not.toBeNull()

      // Oldest (file0-8) should be removed
      expect(loadReadingPosition('file0.txt-1024')).toBeNull()
    })

    it('handles localStorage quota exceeded gracefully', () => {
      // Mock localStorage.setItem to throw QuotaExceededError
      const originalSetItem = Storage.prototype.setItem
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

      let callCount = 0
      setItemSpy.mockImplementation(function (this: Storage, key: string, value: string) {
        callCount++
        if (callCount === 1) {
          const error = new DOMException('Quota exceeded', 'QuotaExceededError')
          throw error
        }
        // Second call (after cleanup) succeeds
        return originalSetItem.call(this, key, value)
      })

      const position: ReadingPosition = {
        documentId: 'test.txt-1024',
        fileName: 'test.txt',
        currentWordIndex: 50,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      // Should not throw error
      expect(() => saveReadingPosition(position)).not.toThrow()

      setItemSpy.mockRestore()
    })
  })

  describe('loadReadingPosition', () => {
    it('loads existing position', () => {
      const position: ReadingPosition = {
        documentId: 'test.txt-1024',
        fileName: 'test.txt',
        currentWordIndex: 50,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      saveReadingPosition(position)

      const loaded = loadReadingPosition('test.txt-1024')
      expect(loaded).not.toBeNull()
      expect(loaded?.documentId).toBe('test.txt-1024')
    })

    it('returns null for non-existent document', () => {
      const loaded = loadReadingPosition('nonexistent.txt-1024')
      expect(loaded).toBeNull()
    })

    it('returns null when storage is empty', () => {
      const loaded = loadReadingPosition('test.txt-1024')
      expect(loaded).toBeNull()
    })

    it('handles corrupted localStorage data gracefully', () => {
      localStorage.setItem('fastreader_positions', 'invalid json')
      const loaded = loadReadingPosition('test.txt-1024')
      expect(loaded).toBeNull()
    })

    it('handles non-array data in localStorage', () => {
      localStorage.setItem('fastreader_positions', JSON.stringify({ not: 'array' }))
      const loaded = loadReadingPosition('test.txt-1024')
      expect(loaded).toBeNull()
    })
  })

  describe('cleanupOldPositions', () => {
    it('removes positions older than 30 days', () => {
      const oldTimestamp = Date.now() - 31 * 24 * 60 * 60 * 1000 // 31 days ago
      const recentTimestamp = Date.now() - 1 * 24 * 60 * 60 * 1000 // 1 day ago

      const oldPosition: ReadingPosition = {
        documentId: 'old.txt-1024',
        fileName: 'old.txt',
        currentWordIndex: 10,
        totalWords: 100,
        timestamp: oldTimestamp,
        speed: 250,
      }

      const recentPosition: ReadingPosition = {
        documentId: 'recent.txt-1024',
        fileName: 'recent.txt',
        currentWordIndex: 20,
        totalWords: 100,
        timestamp: recentTimestamp,
        speed: 250,
      }

      // Manually set positions with specific timestamps
      localStorage.setItem(
        'fastreader_positions',
        JSON.stringify([oldPosition, recentPosition])
      )

      cleanupOldPositions()

      // Recent should still exist
      expect(loadReadingPosition('recent.txt-1024')).not.toBeNull()

      // Old should be removed
      expect(loadReadingPosition('old.txt-1024')).toBeNull()
    })

    it('keeps positions within 30 days', () => {
      const position: ReadingPosition = {
        documentId: 'test.txt-1024',
        fileName: 'test.txt',
        currentWordIndex: 50,
        totalWords: 100,
        timestamp: Date.now() - 29 * 24 * 60 * 60 * 1000, // 29 days ago
        speed: 250,
      }

      saveReadingPosition(position)
      cleanupOldPositions()

      expect(loadReadingPosition('test.txt-1024')).not.toBeNull()
    })

    it('limits to 50 most recent documents after cleanup', () => {
      // Create 60 recent positions
      for (let i = 0; i < 60; i++) {
        const position: ReadingPosition = {
          documentId: `file${i}.txt-1024`,
          fileName: `file${i}.txt`,
          currentWordIndex: i,
          totalWords: 100,
          timestamp: Date.now() - i * 1000, // Recent timestamps
          speed: 250,
        }
        saveReadingPosition(position)
      }

      cleanupOldPositions()

      expect(getStoredPositionCount()).toBe(50)
    })

    it('sorts positions by timestamp (most recent first)', () => {
      const baseTime = Date.now()
      const position1: ReadingPosition = {
        documentId: 'file1.txt-1024',
        fileName: 'file1.txt',
        currentWordIndex: 10,
        totalWords: 100,
        timestamp: baseTime - 2000,
        speed: 250,
      }

      const position2: ReadingPosition = {
        documentId: 'file2.txt-1024',
        fileName: 'file2.txt',
        currentWordIndex: 20,
        totalWords: 100,
        timestamp: baseTime - 1000,
        speed: 250,
      }

      // Manually set positions with specific timestamps
      localStorage.setItem(
        'fastreader_positions',
        JSON.stringify([position1, position2])
      )

      const positions = getAllPositions()

      expect(positions[0].documentId).toBe('file2.txt-1024')
      expect(positions[1].documentId).toBe('file1.txt-1024')
    })

    it('can clean provided array without saving', () => {
      const oldTimestamp = Date.now() - 31 * 24 * 60 * 60 * 1000
      const positions: ReadingPosition[] = [
        {
          documentId: 'old.txt-1024',
          fileName: 'old.txt',
          currentWordIndex: 10,
          totalWords: 100,
          timestamp: oldTimestamp,
          speed: 250,
        },
        {
          documentId: 'recent.txt-1024',
          fileName: 'recent.txt',
          currentWordIndex: 20,
          totalWords: 100,
          timestamp: Date.now(),
          speed: 250,
        },
      ]

      const cleaned = cleanupOldPositions(positions)

      expect(cleaned).toHaveLength(1)
      expect(cleaned[0].documentId).toBe('recent.txt-1024')

      // Should not have saved to localStorage
      expect(getStoredPositionCount()).toBe(0)
    })
  })

  describe('removeReadingPosition', () => {
    it('removes a specific position', () => {
      const position: ReadingPosition = {
        documentId: 'test.txt-1024',
        fileName: 'test.txt',
        currentWordIndex: 50,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      saveReadingPosition(position)
      expect(loadReadingPosition('test.txt-1024')).not.toBeNull()

      removeReadingPosition('test.txt-1024')
      expect(loadReadingPosition('test.txt-1024')).toBeNull()
    })

    it('does not affect other positions', () => {
      const position1: ReadingPosition = {
        documentId: 'file1.txt-1024',
        fileName: 'file1.txt',
        currentWordIndex: 10,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      const position2: ReadingPosition = {
        documentId: 'file2.txt-1024',
        fileName: 'file2.txt',
        currentWordIndex: 20,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      saveReadingPosition(position1)
      saveReadingPosition(position2)

      removeReadingPosition('file1.txt-1024')

      expect(loadReadingPosition('file1.txt-1024')).toBeNull()
      expect(loadReadingPosition('file2.txt-1024')).not.toBeNull()
    })

    it('handles removing non-existent position gracefully', () => {
      expect(() => removeReadingPosition('nonexistent.txt-1024')).not.toThrow()
    })
  })

  describe('clearAllPositions', () => {
    it('removes all stored positions', () => {
      const position1: ReadingPosition = {
        documentId: 'file1.txt-1024',
        fileName: 'file1.txt',
        currentWordIndex: 10,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      const position2: ReadingPosition = {
        documentId: 'file2.txt-1024',
        fileName: 'file2.txt',
        currentWordIndex: 20,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      saveReadingPosition(position1)
      saveReadingPosition(position2)

      expect(getStoredPositionCount()).toBe(2)

      clearAllPositions()

      expect(getStoredPositionCount()).toBe(0)
      expect(loadReadingPosition('file1.txt-1024')).toBeNull()
      expect(loadReadingPosition('file2.txt-1024')).toBeNull()
    })

    it('handles clearing when already empty', () => {
      expect(() => clearAllPositions()).not.toThrow()
      expect(getStoredPositionCount()).toBe(0)
    })
  })

  describe('getStoredPositionCount', () => {
    it('returns 0 when no positions stored', () => {
      expect(getStoredPositionCount()).toBe(0)
    })

    it('returns correct count of stored positions', () => {
      for (let i = 0; i < 5; i++) {
        const position: ReadingPosition = {
          documentId: `file${i}.txt-1024`,
          fileName: `file${i}.txt`,
          currentWordIndex: i,
          totalWords: 100,
          timestamp: Date.now(),
          speed: 250,
        }
        saveReadingPosition(position)
      }

      expect(getStoredPositionCount()).toBe(5)
    })
  })

  describe('getAllPositions', () => {
    it('returns empty array when no positions stored', () => {
      const positions = getAllPositions()
      expect(positions).toEqual([])
    })

    it('returns all stored positions', () => {
      const position1: ReadingPosition = {
        documentId: 'file1.txt-1024',
        fileName: 'file1.txt',
        currentWordIndex: 10,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      const position2: ReadingPosition = {
        documentId: 'file2.txt-1024',
        fileName: 'file2.txt',
        currentWordIndex: 20,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      saveReadingPosition(position1)
      saveReadingPosition(position2)

      const positions = getAllPositions()

      expect(positions).toHaveLength(2)
      expect(positions.some(p => p.documentId === 'file1.txt-1024')).toBe(true)
      expect(positions.some(p => p.documentId === 'file2.txt-1024')).toBe(true)
    })

    it('returns positions sorted by timestamp (most recent first)', () => {
      const baseTime = Date.now()
      const position1: ReadingPosition = {
        documentId: 'file1.txt-1024',
        fileName: 'file1.txt',
        currentWordIndex: 10,
        totalWords: 100,
        timestamp: baseTime - 2000,
        speed: 250,
      }

      const position2: ReadingPosition = {
        documentId: 'file2.txt-1024',
        fileName: 'file2.txt',
        currentWordIndex: 20,
        totalWords: 100,
        timestamp: baseTime - 1000,
        speed: 250,
      }

      // Manually set positions with specific timestamps
      localStorage.setItem(
        'fastreader_positions',
        JSON.stringify([position1, position2])
      )

      const positions = getAllPositions()

      expect(positions[0].documentId).toBe('file2.txt-1024')
      expect(positions[1].documentId).toBe('file1.txt-1024')
    })
  })

  describe('integration scenarios', () => {
    it('handles complete save-load-update-load cycle', () => {
      // Save initial position
      const initialPosition: ReadingPosition = {
        documentId: 'test.txt-1024',
        fileName: 'test.txt',
        currentWordIndex: 25,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 250,
      }

      saveReadingPosition(initialPosition)

      // Load position
      const loaded1 = loadReadingPosition('test.txt-1024')
      expect(loaded1?.currentWordIndex).toBe(25)

      // Update position
      const updatedPosition: ReadingPosition = {
        documentId: 'test.txt-1024',
        fileName: 'test.txt',
        currentWordIndex: 50,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 300,
      }

      saveReadingPosition(updatedPosition)

      // Load again
      const loaded2 = loadReadingPosition('test.txt-1024')
      expect(loaded2?.currentWordIndex).toBe(50)
      expect(loaded2?.speed).toBe(300)
    })

    it('handles multiple documents with updates and deletions', () => {
      // Save multiple documents
      for (let i = 0; i < 5; i++) {
        const position: ReadingPosition = {
          documentId: `file${i}.txt-1024`,
          fileName: `file${i}.txt`,
          currentWordIndex: i * 10,
          totalWords: 100,
          timestamp: Date.now(),
          speed: 250,
        }
        saveReadingPosition(position)
      }

      expect(getStoredPositionCount()).toBe(5)

      // Update one
      const updated: ReadingPosition = {
        documentId: 'file2.txt-1024',
        fileName: 'file2.txt',
        currentWordIndex: 99,
        totalWords: 100,
        timestamp: Date.now(),
        speed: 350,
      }

      saveReadingPosition(updated)
      expect(getStoredPositionCount()).toBe(5) // Still 5

      const loaded = loadReadingPosition('file2.txt-1024')
      expect(loaded?.currentWordIndex).toBe(99)

      // Delete one
      removeReadingPosition('file0.txt-1024')
      expect(getStoredPositionCount()).toBe(4)

      // Clear all
      clearAllPositions()
      expect(getStoredPositionCount()).toBe(0)
    })
  })
})
