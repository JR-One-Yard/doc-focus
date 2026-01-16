/**
 * EPUB File Parser
 *
 * Parses EPUB files (.epub) using the epubjs library.
 * Extracts text from all chapters in reading order.
 *
 * Spec: specs/content-parser.md (EPUB section, lines 32-37)
 */

import ePub from 'epubjs';
import type Book from 'epubjs/types/book';

/**
 * Parse an EPUB file and extract its text content
 *
 * @param file - The EPUB file to parse
 * @returns Promise resolving to the extracted text content
 * @throws Error if file cannot be read, is empty, or parsing fails
 *
 * @example
 * ```typescript
 * const file = new File([epubBuffer], 'book.epub', { type: 'application/epub+zip' });
 * const text = await parseEpubFile(file);
 * console.log(text); // "Chapter 1 content\n\nChapter 2 content..."
 * ```
 */
export async function parseEpubFile(file: File): Promise<string> {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load EPUB document
    let book: Book;
    try {
      book = ePub(arrayBuffer);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load EPUB: ${error.message}`);
      }
      throw new Error('Failed to load EPUB: Unknown error');
    }

    // Open the book to access its structure
    await book.ready;

    // Get the spine (ordered list of content documents)
    const spine = await book.loaded.spine;

    if (!spine || !spine.items || spine.items.length === 0) {
      throw new Error('EPUB contains no readable content');
    }

    // Extract text from all chapters
    const chapterTexts: string[] = [];

    for (const item of spine.items) {
      try {
        // Load the section
        const section = book.spine.get(item.href);

        if (!section) {
          continue;
        }

        // Load the section content
        await section.load(book.load.bind(book));

        // Get the text content (this strips HTML tags automatically)
        const doc = section.document;
        if (doc && doc.body) {
          const text = extractTextFromElement(doc.body);
          if (text.trim().length > 0) {
            chapterTexts.push(text);
          }
        }

        // Unload section to free memory
        section.unload();
      } catch (error) {
        // Log but continue processing other chapters
        console.warn(`Failed to extract text from chapter ${item.href}:`, error);
        continue;
      }
    }

    // Clean up
    book.destroy();

    // Handle empty content
    if (chapterTexts.length === 0) {
      throw new Error('EPUB contains no readable text content');
    }

    // Combine all chapters with double newline separator (preserves chapter structure)
    const fullText = chapterTexts.join('\n\n');

    return fullText;

  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof Error && (
      error.message.includes('Failed to') ||
      error.message.includes('EPUB contains')
    )) {
      throw error;
    }

    // Handle generic errors
    if (error instanceof Error) {
      throw new Error(`Failed to parse EPUB file: ${error.message}`);
    }
    throw new Error('Failed to parse EPUB file: Unknown error');
  }
}

/**
 * Extract text content from an HTML element, stripping all tags
 *
 * @param element - The HTML element to extract text from
 * @returns The extracted text content
 */
function extractTextFromElement(element: HTMLElement | Element): string {
  // Use textContent to automatically strip HTML tags
  const text = element.textContent || '';

  // Clean up excessive whitespace while preserving paragraph breaks
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

/**
 * Validate that a file is an EPUB file
 *
 * @param file - The file to validate
 * @returns true if file appears to be an EPUB file
 *
 * @example
 * ```typescript
 * const file = new File([buffer], 'book.epub', { type: 'application/epub+zip' });
 * isEpubFile(file); // true
 * ```
 */
export function isEpubFile(file: File): boolean {
  // Check file extension
  const hasEpubExtension = file.name.toLowerCase().endsWith('.epub');

  // Check MIME type
  const validMimeTypes = [
    'application/epub+zip',
    'application/epub',
    'application/x-epub+zip',
    'application/octet-stream' // Sometimes EPUB files have generic MIME type
  ];
  const hasValidMimeType = validMimeTypes.includes(file.type) || file.type === '';

  return hasEpubExtension && hasValidMimeType;
}
