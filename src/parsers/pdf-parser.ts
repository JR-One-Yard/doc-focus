/**
 * PDF File Parser
 *
 * Parses PDF files (.pdf) using the pdfjs-dist library.
 * Extracts text from all pages in reading order.
 *
 * Spec: specs/content-parser.md (PDF section, lines 25-30)
 */

import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import type {
  PDFDocumentProxy,
  PDFPageProxy,
  TextContent,
  TextItem
} from 'pdfjs-dist/types/src/display/api';

// Configure PDF.js worker
// In test environment (Node.js), use the legacy build for compatibility
// In browser (production), use the worker from public folder
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
  // Test environment: use a path compatible with Node.js ESM loader
  // Using require.resolve would be ideal but not available in ESM
  // Instead, use a relative path from node_modules
  GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.min.mjs';
} else {
  // Production environment: use the worker from public folder
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

/**
 * Parse a PDF file and extract its text content
 *
 * @param file - The PDF file to parse
 * @returns Promise resolving to the extracted text content
 * @throws Error if file cannot be read, is empty, or parsing fails
 *
 * @example
 * ```typescript
 * const file = new File([pdfBuffer], 'document.pdf', { type: 'application/pdf' });
 * const text = await parsePdfFile(file);
 * console.log(text); // "Page 1 content\n\nPage 2 content..."
 * ```
 */
export async function parsePdfFile(file: File): Promise<string> {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
    });

    let pdfDoc: PDFDocumentProxy;
    try {
      pdfDoc = await loadingTask.promise;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load PDF: ${error.message}`);
      }
      throw new Error('Failed to load PDF: Unknown error');
    }

    const numPages = pdfDoc.numPages;

    // Handle PDFs with no pages
    if (numPages === 0) {
      throw new Error('PDF contains no pages');
    }

    // Extract text from all pages
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page: PDFPageProxy = await pdfDoc.getPage(pageNum);
        const textContent: TextContent = await page.getTextContent();

        // Extract text from all items
        const pageText = textContent.items
          .map((item) => {
            // TextContent.items can contain TextItem or TextMarkedContent
            // Only TextItem has 'str' property
            if ('str' in item) {
              return (item as TextItem).str;
            }
            return '';
          })
          .join(' ');

        pageTexts.push(pageText);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to extract text from page ${pageNum}: ${error.message}`);
        }
        throw new Error(`Failed to extract text from page ${pageNum}: Unknown error`);
      }
    }

    // Combine all pages with double newline separator (preserves paragraph structure)
    const fullText = pageTexts.join('\n\n');

    // Handle empty content (e.g., image-only PDFs)
    if (fullText.trim().length === 0) {
      throw new Error('PDF contains no readable text content');
    }

    return fullText;

  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof Error && (
      error.message.includes('Failed to') ||
      error.message.includes('PDF contains')
    )) {
      throw error;
    }

    // Handle generic errors
    if (error instanceof Error) {
      throw new Error(`Failed to parse PDF file: ${error.message}`);
    }
    throw new Error('Failed to parse PDF file: Unknown error');
  }
}

/**
 * Validate that a file is a PDF file
 *
 * @param file - The file to validate
 * @returns true if file appears to be a PDF file
 *
 * @example
 * ```typescript
 * const file = new File([buffer], 'doc.pdf', { type: 'application/pdf' });
 * isPdfFile(file); // true
 * ```
 */
export function isPdfFile(file: File): boolean {
  // Check file extension
  const hasPdfExtension = file.name.toLowerCase().endsWith('.pdf');

  // Check MIME type
  const validMimeTypes = ['application/pdf', 'application/x-pdf'];
  const hasValidMimeType = validMimeTypes.includes(file.type);

  return hasPdfExtension && hasValidMimeType;
}
