import type { ParsedDocument } from '../types'
import { estimateReadingTime, formatReadingTime } from '../lib/speed-timer'
import './FileInfo.css'

export interface FileInfoProps {
  /** The parsed document to display info for */
  document: ParsedDocument
  /** Current reading speed in WPM */
  speed: number
}

/**
 * FileInfo component
 *
 * Displays metadata about the currently loaded document:
 * - File name
 * - Total word count
 * - Estimated reading time at current speed
 * - File size (KB/MB)
 * - File type
 *
 * Spec: specs/file-management.md (File Information Display, lines 75-82)
 */
export function FileInfo({ document, speed }: FileInfoProps) {
  // Extract file type from file name
  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toUpperCase()
    return extension || 'UNKNOWN'
  }

  // Format file size to human-readable format
  const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes) return 'Unknown'

    const kb = bytes / 1024
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`
    }

    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
  }

  // Calculate estimated reading time
  const timeInSeconds = estimateReadingTime(document.totalWords, speed)
  const formattedTime = formatReadingTime(timeInSeconds)

  const fileType = getFileType(document.fileName)
  const fileSize = formatFileSize(document.fileSize)

  return (
    <div className="file-info" role="region" aria-label="Document information">
      <div className="file-info-grid">
        <div className="file-info-item">
          <span className="file-info-label">File:</span>
          <span className="file-info-value" title={document.fileName}>
            {document.fileName}
          </span>
        </div>

        <div className="file-info-item">
          <span className="file-info-label">Type:</span>
          <span className="file-info-value">{fileType}</span>
        </div>

        <div className="file-info-item">
          <span className="file-info-label">Words:</span>
          <span className="file-info-value">
            {document.totalWords.toLocaleString()}
          </span>
        </div>

        <div className="file-info-item">
          <span className="file-info-label">Size:</span>
          <span className="file-info-value">{fileSize}</span>
        </div>

        <div className="file-info-item">
          <span className="file-info-label">Estimated time:</span>
          <span className="file-info-value" title={`At ${speed} WPM`}>
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  )
}
