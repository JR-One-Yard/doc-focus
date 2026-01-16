/**
 * Tests for FileInfo Component
 *
 * Tests file metadata display, formatting, and accessibility.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FileInfo } from './FileInfo'
import type { ParsedDocument } from '../types'

describe('FileInfo', () => {
  const mockDocument: ParsedDocument = {
    words: ['test', 'document', 'content'],
    fileName: 'test-document.txt',
    totalWords: 1500,
    fileSize: 10240, // 10 KB
  }

  describe('rendering', () => {
    it('should render file name', () => {
      render(<FileInfo document={mockDocument} speed={250} />)

      expect(screen.getByText('test-document.txt')).toBeInTheDocument()
    })

    it('should render file type extracted from extension', () => {
      render(<FileInfo document={mockDocument} speed={250} />)

      expect(screen.getByText('TXT')).toBeInTheDocument()
    })

    it('should render word count', () => {
      render(<FileInfo document={mockDocument} speed={250} />)

      expect(screen.getByText('1,500')).toBeInTheDocument()
    })

    it('should render file size', () => {
      render(<FileInfo document={mockDocument} speed={250} />)

      expect(screen.getByText('10.0 KB')).toBeInTheDocument()
    })

    it('should render estimated reading time', () => {
      // 1500 words at 250 WPM = 6 minutes = 360 seconds
      render(<FileInfo document={mockDocument} speed={250} />)

      expect(screen.getByText('6m')).toBeInTheDocument()
    })

    it('should render all labels', () => {
      render(<FileInfo document={mockDocument} speed={250} />)

      expect(screen.getByText('File:')).toBeInTheDocument()
      expect(screen.getByText('Type:')).toBeInTheDocument()
      expect(screen.getByText('Words:')).toBeInTheDocument()
      expect(screen.getByText('Size:')).toBeInTheDocument()
      expect(screen.getByText('Estimated time:')).toBeInTheDocument()
    })
  })

  describe('file type extraction', () => {
    it('should extract PDF file type', () => {
      const pdfDoc: ParsedDocument = {
        ...mockDocument,
        fileName: 'document.pdf',
      }
      render(<FileInfo document={pdfDoc} speed={250} />)

      expect(screen.getByText('PDF')).toBeInTheDocument()
    })

    it('should extract EPUB file type', () => {
      const epubDoc: ParsedDocument = {
        ...mockDocument,
        fileName: 'book.epub',
      }
      render(<FileInfo document={epubDoc} speed={250} />)

      expect(screen.getByText('EPUB')).toBeInTheDocument()
    })

    it('should extract DOCX file type', () => {
      const docxDoc: ParsedDocument = {
        ...mockDocument,
        fileName: 'report.docx',
      }
      render(<FileInfo document={docxDoc} speed={250} />)

      expect(screen.getByText('DOCX')).toBeInTheDocument()
    })

    it('should handle file with no extension', () => {
      const noExtDoc: ParsedDocument = {
        ...mockDocument,
        fileName: 'document',
      }
      render(<FileInfo document={noExtDoc} speed={250} />)

      expect(screen.getByText('DOCUMENT')).toBeInTheDocument()
    })

    it('should handle uppercase extensions', () => {
      const upperDoc: ParsedDocument = {
        ...mockDocument,
        fileName: 'document.TXT',
      }
      render(<FileInfo document={upperDoc} speed={250} />)

      expect(screen.getByText('TXT')).toBeInTheDocument()
    })
  })

  describe('file size formatting', () => {
    it('should format bytes to KB (< 1 MB)', () => {
      const smallDoc: ParsedDocument = {
        ...mockDocument,
        fileSize: 5120, // 5 KB
      }
      render(<FileInfo document={smallDoc} speed={250} />)

      expect(screen.getByText('5.0 KB')).toBeInTheDocument()
    })

    it('should format bytes to MB (>= 1 MB)', () => {
      const largeDoc: ParsedDocument = {
        ...mockDocument,
        fileSize: 2097152, // 2 MB
      }
      render(<FileInfo document={largeDoc} speed={250} />)

      expect(screen.getByText('2.0 MB')).toBeInTheDocument()
    })

    it('should handle large file sizes', () => {
      const hugeDoc: ParsedDocument = {
        ...mockDocument,
        fileSize: 52428800, // 50 MB
      }
      render(<FileInfo document={hugeDoc} speed={250} />)

      expect(screen.getByText('50.0 MB')).toBeInTheDocument()
    })

    it('should show Unknown when file size is undefined', () => {
      const noSizeDoc: ParsedDocument = {
        ...mockDocument,
        fileSize: undefined,
      }
      render(<FileInfo document={noSizeDoc} speed={250} />)

      expect(screen.getByText('Unknown')).toBeInTheDocument()
    })

    it('should show Unknown when file size is 0', () => {
      const zeroDoc: ParsedDocument = {
        ...mockDocument,
        fileSize: 0,
      }
      render(<FileInfo document={zeroDoc} speed={250} />)

      expect(screen.getByText('Unknown')).toBeInTheDocument()
    })

    it('should format decimal places correctly', () => {
      const decimalDoc: ParsedDocument = {
        ...mockDocument,
        fileSize: 1536, // 1.5 KB
      }
      render(<FileInfo document={decimalDoc} speed={250} />)

      expect(screen.getByText('1.5 KB')).toBeInTheDocument()
    })
  })

  describe('word count formatting', () => {
    it('should format large numbers with commas', () => {
      const largeDoc: ParsedDocument = {
        ...mockDocument,
        totalWords: 123456,
      }
      render(<FileInfo document={largeDoc} speed={250} />)

      expect(screen.getByText('123,456')).toBeInTheDocument()
    })

    it('should handle small word counts', () => {
      const smallDoc: ParsedDocument = {
        ...mockDocument,
        totalWords: 50,
      }
      render(<FileInfo document={smallDoc} speed={250} />)

      expect(screen.getByText('50')).toBeInTheDocument()
    })
  })

  describe('estimated reading time', () => {
    it('should calculate time for fast speed (350 WPM)', () => {
      // 1500 words at 350 WPM = ~4.3 minutes = 258 seconds (Math.ceil)
      render(<FileInfo document={mockDocument} speed={350} />)

      expect(screen.getByText('4m 18s')).toBeInTheDocument()
    })

    it('should calculate time for slow speed (50 WPM)', () => {
      // 1500 words at 50 WPM = 30 minutes
      render(<FileInfo document={mockDocument} speed={50} />)

      expect(screen.getByText('30m')).toBeInTheDocument()
    })

    it('should update when speed changes', () => {
      const { rerender } = render(<FileInfo document={mockDocument} speed={250} />)
      expect(screen.getByText('6m')).toBeInTheDocument()

      // Increase speed - should reduce time
      rerender(<FileInfo document={mockDocument} speed={300} />)
      expect(screen.getByText('5m')).toBeInTheDocument()
    })

    it('should show hours for long documents', () => {
      const longDoc: ParsedDocument = {
        ...mockDocument,
        totalWords: 30000,
      }
      // 30000 words at 250 WPM = 120 minutes = 2 hours
      render(<FileInfo document={longDoc} speed={250} />)

      expect(screen.getByText('2h')).toBeInTheDocument()
    })

    it('should show hours and minutes for very long documents', () => {
      const veryLongDoc: ParsedDocument = {
        ...mockDocument,
        totalWords: 37500,
      }
      // 37500 words at 250 WPM = 150 minutes = 2h 30m
      render(<FileInfo document={veryLongDoc} speed={250} />)

      expect(screen.getByText('2h 30m')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have region role', () => {
      render(<FileInfo document={mockDocument} speed={250} />)

      expect(screen.getByRole('region', { name: /document information/i })).toBeInTheDocument()
    })

    it('should have aria-label for region', () => {
      const { container } = render(<FileInfo document={mockDocument} speed={250} />)

      const region = container.querySelector('[role="region"]')
      expect(region).toHaveAttribute('aria-label', 'Document information')
    })

    it('should have title attribute on file name for long names', () => {
      const longNameDoc: ParsedDocument = {
        ...mockDocument,
        fileName: 'very-long-file-name-that-might-get-truncated.txt',
      }
      render(<FileInfo document={longNameDoc} speed={250} />)

      const fileName = screen.getByText('very-long-file-name-that-might-get-truncated.txt')
      expect(fileName).toHaveAttribute('title', 'very-long-file-name-that-might-get-truncated.txt')
    })

    it('should have title attribute on estimated time showing speed', () => {
      render(<FileInfo document={mockDocument} speed={250} />)

      const time = screen.getByText('6m')
      expect(time).toHaveAttribute('title', 'At 250 WPM')
    })
  })

  describe('styling', () => {
    it('should apply base CSS class', () => {
      const { container } = render(<FileInfo document={mockDocument} speed={250} />)

      const fileInfo = container.querySelector('.file-info')
      expect(fileInfo).toBeInTheDocument()
    })

    it('should apply grid layout class', () => {
      const { container } = render(<FileInfo document={mockDocument} speed={250} />)

      expect(container.querySelector('.file-info-grid')).toBeInTheDocument()
    })

    it('should apply item classes', () => {
      const { container } = render(<FileInfo document={mockDocument} speed={250} />)

      const items = container.querySelectorAll('.file-info-item')
      expect(items.length).toBe(5) // File, Type, Words, Size, Time
    })

    it('should apply label and value classes', () => {
      const { container } = render(<FileInfo document={mockDocument} speed={250} />)

      const labels = container.querySelectorAll('.file-info-label')
      const values = container.querySelectorAll('.file-info-value')

      expect(labels.length).toBe(5)
      expect(values.length).toBe(5)
    })
  })

  describe('edge cases', () => {
    it('should handle document with 0 words', () => {
      const emptyDoc: ParsedDocument = {
        ...mockDocument,
        totalWords: 0,
      }
      render(<FileInfo document={emptyDoc} speed={250} />)

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should handle very large word counts', () => {
      const massiveDoc: ParsedDocument = {
        ...mockDocument,
        totalWords: 1000000,
      }
      render(<FileInfo document={massiveDoc} speed={250} />)

      expect(screen.getByText('1,000,000')).toBeInTheDocument()
    })

    it('should handle file name with multiple dots', () => {
      const multiDotDoc: ParsedDocument = {
        ...mockDocument,
        fileName: 'my.file.name.v2.final.txt',
      }
      render(<FileInfo document={multiDotDoc} speed={250} />)

      expect(screen.getByText('my.file.name.v2.final.txt')).toBeInTheDocument()
      expect(screen.getByText('TXT')).toBeInTheDocument()
    })
  })
})
