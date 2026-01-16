import { useState } from 'react'
import './App.css'
import type { ParsedDocument } from './types'
import { SPEED_LIMITS } from './types'
import { RSVPDisplay } from './components/RSVPDisplay'
import { TextInput } from './components/TextInput'
import { FileUpload } from './components/FileUpload'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorMessage } from './components/ErrorMessage'
import { ProgressDisplay } from './components/ProgressDisplay'
import { SpeedWarning } from './components/SpeedWarning'
import { useRSVPPlayback } from './hooks/useRSVPPlayback'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { isValidWPM } from './lib/speed-timer'
import { parseTxtFile } from './parsers/txt-parser'
import { parseTextToWords, countWords } from './lib/text-parser'

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

  // Use RSVP playback hook (only when we have a document)
  const playback = useRSVPPlayback({
    words: currentDocument?.words || [],
    speed,
    onComplete: () => {
      // Auto-stop when playback completes
    },
  })

  // Determine which screen to show
  const hasDocument = currentDocument !== null

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
    playback.pause()
    setCurrentDocument(null)
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
                onClick={playback.isPlaying ? playback.pause : playback.play}
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

            {/* Speed Control */}
            <div className="speed-control">
              <label htmlFor="speed-input">Speed (WPM):</label>
              <input
                id="speed-input"
                type="number"
                min={SPEED_LIMITS.MIN_WPM}
                max={SPEED_LIMITS.MAX_WPM}
                step={25}
                value={speed}
                onChange={(e) => handleSpeedChange(Number(e.target.value))}
                className="speed-input"
              />
            </div>

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
