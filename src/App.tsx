import { useState } from 'react'
import './App.css'
import { AppState, SPEED_LIMITS, ParsedDocument } from './types'
import { RSVPDisplay } from './components/RSVPDisplay'
import { TextInput } from './components/TextInput'
import { useRSVPPlayback } from './hooks/useRSVPPlayback'
import { isValidWPM, shouldShowSpeedWarning } from './lib/speed-timer'

/**
 * FastReader - Speed Reading Application
 * Main application component managing global state and screen routing
 */
function App() {
  // Initialize app state
  const [currentDocument, setCurrentDocument] = useState<ParsedDocument | null>(
    null
  )
  const [speed, setSpeed] = useState(SPEED_LIMITS.DEFAULT_WPM)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="app">
      {!hasDocument ? (
        // Upload Screen - shown when no document is loaded
        <div className="upload-screen">
          <h1>FastReader</h1>
          <p>Speed reading with RSVP + OVP</p>

          {error && <div className="error-message">{error}</div>}

          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            <TextInput
              onDocumentLoad={handleDocumentLoad}
              disabled={isLoading}
            />
          )}
        </div>
      ) : (
        // Reading Screen - shown when document is loaded
        <div className="reading-screen">
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
              {shouldShowSpeedWarning(speed) && (
                <span className="speed-warning">⚠️ High speed may reduce comprehension</span>
              )}
            </div>

            {/* Close Document */}
            <button onClick={handleCloseDocument} className="control-button close-button">
              Close Document
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
