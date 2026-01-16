import { useState, useEffect, useRef } from 'react'
import './App.css'
import type { ParsedDocument } from './types'
import { SPEED_LIMITS } from './types'
import { RSVPDisplay } from './components/RSVPDisplay'
import { TextInput } from './components/TextInput'
import { FileUpload } from './components/FileUpload'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorMessage } from './components/ErrorMessage'
import { ProgressDisplay } from './components/ProgressDisplay'
import { ProgressBar } from './components/ProgressBar'
import { SpeedWarning } from './components/SpeedWarning'
import { FileInfo } from './components/FileInfo'
import { SpeedControl } from './components/SpeedControl'
import { useRSVPPlayback } from './hooks/useRSVPPlayback'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { isValidWPM } from './lib/speed-timer'
import { parseTxtFile } from './parsers/txt-parser'
import { parseTextToWords, countWords } from './lib/text-parser'
import {
  generateDocumentId,
  saveReadingPosition,
  loadReadingPosition,
  cleanupOldPositions,
} from './utils/storage'

/**
 * FastReader - Speed Reading Application
 * Main application component managing global state and screen routing
 */
function App() {
  // Initialize app state
  const [currentDocument, setCurrentDocument] = useState<ParsedDocument | null>(
    null
  )
  const [speed, setSpeed] = useState<number>(SPEED_LIMITS.DEFAULT_WPM)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingFileName, setLoadingFileName] = useState<string>('')

  // Track document ID for storage
  const currentDocumentId = useRef<string | null>(null)

  // Debounce timer for auto-save
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Use RSVP playback hook (only when we have a document)
  const playback = useRSVPPlayback({
    words: currentDocument?.words || [],
    speed,
    onComplete: () => {
      // Auto-stop when playback completes and save position
      if (currentDocument && currentDocumentId.current) {
        saveCurrentPosition()
      }
    },
  })

  // Determine which screen to show
  const hasDocument = currentDocument !== null

  // P4-6: Cleanup old positions on app initialization
  useEffect(() => {
    cleanupOldPositions()
  }, [])

  // Helper function to save current position
  const saveCurrentPosition = () => {
    if (!currentDocument || !currentDocumentId.current) return

    saveReadingPosition({
      documentId: currentDocumentId.current,
      fileName: currentDocument.fileName,
      currentWordIndex: playback.currentIndex,
      totalWords: currentDocument.totalWords,
      timestamp: Date.now(),
      speed,
    })
  }

  // P4-3, P4-4: Auto-save position during reading (debounced)
  useEffect(() => {
    if (!currentDocument || !playback.isPlaying) return

    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    // Save position every 5 seconds during playback
    saveTimerRef.current = setTimeout(() => {
      saveCurrentPosition()
    }, 5000)

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [currentDocument, playback.currentIndex, playback.isPlaying, speed])

  // P4-3: Save position on browser close/reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentDocument && currentDocumentId.current) {
        saveCurrentPosition()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentDocument, playback.currentIndex, speed])

  // Handle document load from TextInput
  const handleDocumentLoad = (document: ParsedDocument) => {
    setCurrentDocument(document)
    setError(null)
  }

  // Handle file selection and parsing
  const handleFileSelect = async (file: File) => {
    setIsLoading(true)
    setLoadingFileName(file.name)
    setError(null)

    try {
      // Parse the file based on type
      // Currently only TXT is supported (P2-1 complete)
      // PDF, EPUB, DOCX parsers coming in P2-5, P2-6, P2-7
      let text: string

      if (file.name.toLowerCase().endsWith('.txt')) {
        text = await parseTxtFile(file)
      } else {
        throw new Error(
          'Unsupported file type. Currently only .txt files are supported.'
        )
      }

      // Parse text into words
      const words = parseTextToWords(text)
      const wordCount = countWords(text)

      // Create parsed document
      const document: ParsedDocument = {
        words,
        fileName: file.name,
        totalWords: wordCount,
        fileSize: file.size,
      }

      // P4-2: Generate document ID for storage
      const documentId = generateDocumentId(file.name, file.size)
      currentDocumentId.current = documentId

      // P4-5: Load saved position if it exists
      const savedPosition = loadReadingPosition(documentId)

      if (savedPosition) {
        // Restore saved position
        playback.jumpTo(savedPosition.currentWordIndex)
        setSpeed(savedPosition.speed)
      }

      setCurrentDocument(document)
      setError(null)
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to parse file. Please try another file.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
      setLoadingFileName('')
    }
  }

  // Handle file parsing error
  const handleFileError = (errorMessage: string) => {
    setError(errorMessage)
  }

  // Handle cancel parsing
  const handleCancelParsing = () => {
    setIsLoading(false)
    setLoadingFileName('')
    setError('File parsing cancelled')
  }

  // Handle close document
  const handleCloseDocument = () => {
    // P4-3: Save position before closing
    if (currentDocument && currentDocumentId.current) {
      saveCurrentPosition()
    }

    playback.pause()
    setCurrentDocument(null)
    currentDocumentId.current = null
  }

  // Handle speed change
  const handleSpeedChange = (newSpeed: number) => {
    if (isValidWPM(newSpeed)) {
      setSpeed(newSpeed)
    }
  }

  // Handle speed increment/decrement (for keyboard shortcuts)
  const handleIncreaseSpeed = () => {
    const newSpeed = Math.min(speed + 25, SPEED_LIMITS.MAX_WPM)
    setSpeed(newSpeed)
  }

  const handleDecreaseSpeed = () => {
    const newSpeed = Math.max(speed - 25, SPEED_LIMITS.MIN_WPM)
    setSpeed(newSpeed)
  }

  // Handle play/pause toggle (for keyboard shortcuts)
  const handleTogglePlayPause = () => {
    if (playback.isPlaying) {
      playback.pause()
      // P4-3: Save position when pausing
      if (currentDocument && currentDocumentId.current) {
        saveCurrentPosition()
      }
    } else {
      playback.play()
    }
  }

  // Keyboard shortcuts (only enabled when document is loaded)
  useKeyboardShortcuts({
    onTogglePlayPause: handleTogglePlayPause,
    onPrevious: playback.previous,
    onNext: playback.next,
    onIncreaseSpeed: handleIncreaseSpeed,
    onDecreaseSpeed: handleDecreaseSpeed,
    onClose: handleCloseDocument,
    enabled: hasDocument,
  })

  return (
    <div className="app">
      {/* Loading State - shown during file parsing */}
      {isLoading && (
        <LoadingSpinner
          fileName={loadingFileName}
          onCancel={handleCancelParsing}
        />
      )}

      {!hasDocument && !isLoading ? (
        // Upload Screen - shown when no document is loaded
        <div className="upload-screen">
          <h1>FastReader</h1>
          <p>Speed reading with RSVP + OVP</p>

          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => setError(null)}
              showRetry={false}
            />
          )}

          <FileUpload
            onFileSelect={handleFileSelect}
            onError={handleFileError}
            disabled={isLoading}
          />

          <div className="divider">
            <span>or</span>
          </div>

          <TextInput
            onDocumentLoad={handleDocumentLoad}
            disabled={isLoading}
          />
        </div>
      ) : !isLoading && currentDocument ? (
        // Reading Screen - shown when document is loaded
        <div className="reading-screen">
          {/* Visual Progress Bar (top of screen) */}
          <ProgressBar
            currentIndex={playback.currentIndex}
            totalWords={currentDocument.totalWords}
            onJumpToPosition={playback.jumpTo}
            disabled={false}
          />

          {/* Progress Display */}
          <ProgressDisplay
            currentIndex={playback.currentIndex}
            totalWords={currentDocument.totalWords}
          />

          {/* RSVP Display with OVP highlighting */}
          <RSVPDisplay
            word={currentDocument.words[playback.currentIndex] || ''}
            currentIndex={playback.currentIndex}
            totalWords={currentDocument.totalWords}
          />

          {/* Basic Controls (Phase 1) */}
          <div className="controls-panel">
            {/* File Information Display (P2-9) */}
            <FileInfo document={currentDocument} speed={speed} />

            {/* Playback Controls */}
            <div className="playback-controls">
              <button
                onClick={playback.previous}
                disabled={playback.currentIndex === 0}
                className="control-button"
              >
                ← Previous
              </button>

              <button
                onClick={() => {
                  if (playback.isPlaying) {
                    playback.pause()
                    // P4-3: Save position when pausing
                    if (currentDocument && currentDocumentId.current) {
                      saveCurrentPosition()
                    }
                  } else {
                    playback.play()
                  }
                }}
                className="control-button play-button"
              >
                {playback.isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>

              <button
                onClick={playback.next}
                disabled={
                  playback.currentIndex >= currentDocument.totalWords - 1
                }
                className="control-button"
              >
                Next →
              </button>
            </div>

            {/* Speed Control (P3-1) */}
            <SpeedControl speed={speed} onSpeedChange={handleSpeedChange} />

            {/* Close Document */}
            <button onClick={handleCloseDocument} className="control-button close-button">
              Close Document
            </button>
          </div>

          {/* Speed Warning Modal (overlay) */}
          <SpeedWarning speed={speed} />
        </div>
      ) : null}
    </div>
  )
}

export default App
