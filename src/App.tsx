import { useState, useEffect, useRef, useCallback } from 'react'
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
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp'
import { FileInfo } from './components/FileInfo'
import { SpeedControl } from './components/SpeedControl'
import { useRSVPPlayback } from './hooks/useRSVPPlayback'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { isValidWPM } from './lib/speed-timer'
import { parseFile } from './parsers/index'
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
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false)

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
  const saveCurrentPosition = useCallback(() => {
    if (!currentDocument || !currentDocumentId.current) return

    saveReadingPosition({
      documentId: currentDocumentId.current,
      fileName: currentDocument.fileName,
      currentWordIndex: playback.currentIndex,
      totalWords: currentDocument.totalWords,
      timestamp: Date.now(),
      speed,
    })
  }, [currentDocument, playback.currentIndex, speed])

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
  }, [currentDocument, playback.isPlaying, saveCurrentPosition])

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
  }, [currentDocument, saveCurrentPosition])

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
      // Parse the file using unified parser (supports TXT, PDF, EPUB, DOCX)
      const document = await parseFile(file)

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
    onShowHelp: () => setShowKeyboardHelp(true),
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

      <main>
        {!hasDocument && !isLoading ? (
          // Upload Screen - shown when no document is loaded
          <div className="upload-screen">
          <div className="upload-header">
            <div>
              <h1>FastReader</h1>
              <p>Speed reading with RSVP + OVP</p>
            </div>
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className="control-button help-button"
              aria-label="Show keyboard shortcuts"
              title="Keyboard shortcuts"
            >
              ⌨️ Shortcuts
            </button>
          </div>

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
                aria-label="Previous word"
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
                aria-label={playback.isPlaying ? 'Pause reading' : 'Play reading'}
                aria-pressed={playback.isPlaying}
              >
                {playback.isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>

              <button
                onClick={playback.next}
                disabled={
                  playback.currentIndex >= currentDocument.totalWords - 1
                }
                className="control-button"
                aria-label="Next word"
              >
                Next →
              </button>
            </div>

            {/* Speed Control (P3-1) */}
            <SpeedControl speed={speed} onSpeedChange={handleSpeedChange} />

            {/* Close Document */}
            <button
              onClick={handleCloseDocument}
              className="control-button close-button"
              aria-label="Close document and return to upload screen"
            >
              Close Document
            </button>

            {/* Keyboard Shortcuts Help Button */}
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className="control-button help-button"
              aria-label="Show keyboard shortcuts"
              title="Keyboard shortcuts (Press ?)"
            >
              ⌨️ Shortcuts
            </button>
          </div>

          {/* Speed Warning Modal (overlay) */}
          <SpeedWarning speed={speed} />
        </div>
        ) : null}
      </main>

      {/* Keyboard Shortcuts Help Modal (global, can be shown from anywhere) */}
      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
    </div>
  )
}

export default App
