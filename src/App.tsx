import { useState } from 'react'
import './App.css'
import { AppState, SPEED_LIMITS } from './types'

/**
 * FastReader - Speed Reading Application
 * Main application component managing global state and screen routing
 */
function App() {
  // Initialize app state
  const [appState, setAppState] = useState<AppState>({
    currentDocument: null,
    currentWordIndex: 0,
    isPlaying: false,
    speed: SPEED_LIMITS.DEFAULT_WPM,
    isLoading: false,
    error: null,
  })

  // State setters for child components
  const setCurrentDocument = (document: AppState['currentDocument']) => {
    setAppState(prev => ({
      ...prev,
      currentDocument: document,
      currentWordIndex: 0, // Reset to beginning when new document loaded
      isPlaying: false, // Stop playback when new document loaded
      error: null, // Clear any previous errors
    }))
  }

  const setCurrentWordIndex = (index: number) => {
    setAppState(prev => ({ ...prev, currentWordIndex: index }))
  }

  const setIsPlaying = (playing: boolean) => {
    setAppState(prev => ({ ...prev, isPlaying: playing }))
  }

  const setSpeed = (speed: number) => {
    setAppState(prev => ({ ...prev, speed }))
  }

  const setIsLoading = (loading: boolean) => {
    setAppState(prev => ({ ...prev, isLoading: loading }))
  }

  const setError = (error: string | null) => {
    setAppState(prev => ({ ...prev, error, isLoading: false }))
  }

  // Determine which screen to show
  const hasDocument = appState.currentDocument !== null

  return (
    <div className="app">
      {!hasDocument ? (
        // Upload Screen - shown when no document is loaded
        <div className="upload-screen">
          <h1>FastReader</h1>
          <p>Speed reading with RSVP + OVP</p>

          {appState.error && (
            <div className="error-message">
              {appState.error}
            </div>
          )}

          {appState.isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="upload-placeholder">
              <p>File upload will be implemented in Phase 2</p>
              <p>For now, use the text input below (Phase 1)</p>
            </div>
          )}
        </div>
      ) : (
        // Reading Screen - shown when document is loaded
        <div className="reading-screen">
          <div className="rsvp-display-placeholder">
            <p>RSVP Display (CP-2) - Word {appState.currentWordIndex + 1} of {appState.currentDocument.totalWords}</p>
            <p>Current word: {appState.currentDocument.words[appState.currentWordIndex] || ''}</p>
            <p>Speed: {appState.speed} WPM</p>
            <p>Playing: {appState.isPlaying ? 'Yes' : 'No'}</p>
          </div>

          <div className="controls-placeholder">
            <button onClick={() => setCurrentDocument(null)}>
              Close Document
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
