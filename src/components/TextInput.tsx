import { useState } from 'react'
import { parseTextToWords, validateText, countWords } from '../lib/text-parser'
import type { ParsedDocument } from '../types'
import './TextInput.css'

/**
 * TextInput Component (Phase 1 Temporary)
 *
 * Provides a simple textarea for users to paste text and start reading.
 * This is a temporary component for Phase 1 testing. Will be replaced
 * with full file upload functionality in Phase 2.
 */
export interface TextInputProps {
  onDocumentLoad: (document: ParsedDocument) => void
  disabled?: boolean
}

export function TextInput({ onDocumentLoad, disabled = false }: TextInputProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleStartReading = () => {
    setError(null)

    // Validate text
    const validation = validateText(text)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid text')
      return
    }

    // Parse text into words
    const words = parseTextToWords(text)
    const wordCount = countWords(text)

    // Create parsed document
    const document: ParsedDocument = {
      words,
      fileName: 'Pasted Text',
      totalWords: wordCount,
    }

    // Load document
    onDocumentLoad(document)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    setError(null) // Clear error when user types
  }

  const wordCount = text.trim() ? countWords(text) : 0

  return (
    <div className="text-input" data-testid="text-input">
      <div className="text-input-header">
        <h2>Paste Your Text</h2>
        <p className="text-input-subtitle">
          Paste any text to start speed reading with RSVP
        </p>
      </div>

      <textarea
        className="text-input-textarea"
        value={text}
        onChange={handleTextChange}
        placeholder="Paste your text here..."
        disabled={disabled}
        data-testid="text-input-textarea"
        rows={10}
      />

      <div className="text-input-footer">
        <div className="text-input-info">
          {wordCount > 0 && (
            <span className="word-count" data-testid="word-count">
              {wordCount} words
            </span>
          )}
        </div>

        {error && (
          <div className="text-input-error" data-testid="text-input-error">
            {error}
          </div>
        )}

        <button
          className="text-input-button"
          onClick={handleStartReading}
          disabled={disabled || !text.trim()}
          data-testid="start-reading-button"
        >
          Start Reading
        </button>
      </div>

      <div className="text-input-note">
        <p>
          <strong>Note:</strong> This is a temporary text input for Phase 1.
          File upload (PDF, EPUB, DOCX, TXT) will be available in Phase 2.
        </p>
      </div>
    </div>
  )
}
