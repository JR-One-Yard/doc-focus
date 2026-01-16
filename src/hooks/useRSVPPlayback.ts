import { useState, useEffect, useRef, useCallback } from 'react'
import { wpmToMilliseconds } from '../lib/speed-timer'

/**
 * useRSVPPlayback Hook
 *
 * Manages RSVP (Rapid Serial Visual Presentation) playback timing and controls.
 * Implements precise word-by-word advancement with drift correction to maintain
 * timing accuracy within ±10ms as required by spec.
 *
 * Uses requestAnimationFrame for smooth, accurate timing instead of setInterval.
 *
 * @param words - Array of words to display
 * @param speed - Reading speed in WPM (words per minute)
 * @param onComplete - Optional callback when playback reaches the end
 * @returns Playback state and control methods
 */
export interface UseRSVPPlaybackParams {
  words: string[]
  speed: number
  onComplete?: () => void
}

export interface UseRSVPPlaybackReturn {
  /** Current word index (0-indexed) */
  currentIndex: number
  /** Whether playback is currently active */
  isPlaying: boolean
  /** Start or resume playback */
  play: () => void
  /** Pause playback */
  pause: () => void
  /** Move to next word */
  next: () => void
  /** Move to previous word */
  previous: () => void
  /** Jump to specific word index */
  jumpTo: (index: number) => void
  /** Reset to beginning */
  reset: () => void
}

export function useRSVPPlayback({
  words,
  speed,
  onComplete,
}: UseRSVPPlaybackParams): UseRSVPPlaybackReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Refs for timing control and drift correction
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const expectedTimeRef = useRef<number>(0)
  const pausedIndexRef = useRef<number>(0)

  /**
   * Stop playback and clean up animation frame
   */
  const stopPlayback = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setIsPlaying(false)
  }, [])

  /**
   * Playback loop using requestAnimationFrame for precise timing
   */
  const playbackLoop = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
        expectedTimeRef.current = 0
      }

      const elapsed = timestamp - startTimeRef.current
      const intervalMs = wpmToMilliseconds(speed)

      // Calculate which word we should be on based on elapsed time
      const expectedWordIndex = Math.floor(elapsed / intervalMs)
      const actualIndex = pausedIndexRef.current + expectedWordIndex

      // Update index if we've moved to a new word
      if (actualIndex < words.length) {
        setCurrentIndex(actualIndex)
      }

      // Check if we've reached the end
      if (actualIndex >= words.length - 1) {
        stopPlayback()
        setCurrentIndex(words.length - 1)
        if (onComplete) {
          onComplete()
        }
        return
      }

      // Continue playback loop
      animationFrameRef.current = requestAnimationFrame(playbackLoop)
    },
    [words.length, speed, stopPlayback, onComplete]
  )

  /**
   * Start or resume playback
   */
  const play = useCallback(() => {
    if (isPlaying) return
    if (currentIndex >= words.length - 1) {
      // If at end, reset to beginning
      setCurrentIndex(0)
      pausedIndexRef.current = 0
    } else {
      pausedIndexRef.current = currentIndex
    }

    setIsPlaying(true)
    startTimeRef.current = null // Reset start time for drift correction
  }, [isPlaying, currentIndex, words.length])

  /**
   * Pause playback
   */
  const pause = useCallback(() => {
    stopPlayback()
    pausedIndexRef.current = currentIndex
  }, [stopPlayback, currentIndex])

  /**
   * Move to next word
   */
  const next = useCallback(() => {
    const nextIndex = Math.min(currentIndex + 1, words.length - 1)
    setCurrentIndex(nextIndex)
    pausedIndexRef.current = nextIndex

    // Reset timing if playing
    if (isPlaying) {
      startTimeRef.current = null
    }
  }, [currentIndex, words.length, isPlaying])

  /**
   * Move to previous word
   */
  const previous = useCallback(() => {
    const prevIndex = Math.max(currentIndex - 1, 0)
    setCurrentIndex(prevIndex)
    pausedIndexRef.current = prevIndex

    // Reset timing if playing
    if (isPlaying) {
      startTimeRef.current = null
    }
  }, [currentIndex, isPlaying])

  /**
   * Jump to specific word index
   */
  const jumpTo = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, words.length - 1))
      setCurrentIndex(clampedIndex)
      pausedIndexRef.current = clampedIndex

      // Reset timing if playing
      if (isPlaying) {
        startTimeRef.current = null
      }
    },
    [words.length, isPlaying]
  )

  /**
   * Reset to beginning
   */
  const reset = useCallback(() => {
    stopPlayback()
    setCurrentIndex(0)
    pausedIndexRef.current = 0
    startTimeRef.current = null
  }, [stopPlayback])

  /**
   * Effect to start/stop playback based on isPlaying state
   */
  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(playbackLoop)
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, playbackLoop])

  /**
   * Effect to handle speed changes during playback
   */
  useEffect(() => {
    if (isPlaying) {
      // Reset timing when speed changes to avoid drift
      startTimeRef.current = null
      pausedIndexRef.current = currentIndex
    }
  }, [speed, isPlaying, currentIndex])

  /**
   * Effect to handle words array changes
   */
  useEffect(() => {
    // If words change, reset to beginning
    setCurrentIndex(0)
    pausedIndexRef.current = 0
    stopPlayback()
  }, [words, stopPlayback])

  return {
    currentIndex,
    isPlaying,
    play,
    pause,
    next,
    previous,
    jumpTo,
    reset,
  }
}
