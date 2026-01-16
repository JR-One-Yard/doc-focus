/**
 * Unified Parser Interface
 *
 * Routes file parsing to the appropriate parser based on file type.
 * Returns a standardized ParsedDocument object.
 *
 * Spec: specs/content-parser.md (File Processing Flow, lines 132-143)
 */

import type { ParsedDocument } from '../types';
import { parseTextToWords, countWords, validateText } from '../lib/text-parser';
import { parseTxtFile, isTxtFile } from './txt-parser';
import { parsePdfFile, isPdfFile } from './pdf-parser';
import { parseEpubFile, isEpubFile } from './epub-parser';
import { parseDocxFile, isDocxFile } from './docx-parser';

/**
 * Parse a file and extract its text content
 *
 * Routes to the appropriate parser based on file extension,
 * then processes the extracted text into a standardized format.
 *
 * @param file - The file to parse
 * @returns Promise resolving to a ParsedDocument object
 * @throws Error if file type is unsupported or parsing fails
 *
 * @example
 * ```typescript
 * const file = new File(['Hello world'], 'test.txt', { type: 'text/plain' });
 * const doc = await parseFile(file);
 * // doc = { words: ['Hello', 'world'], fileName: 'test.txt', totalWords: 2 }
 * ```
 */
export async function parseFile(file: File): Promise<ParsedDocument> {
  // Determine file type and route to appropriate parser
  let rawText: string;

  try {
    if (isTxtFile(file)) {
      rawText = await parseTxtFile(file);
    } else if (isPdfFile(file)) {
      rawText = await parsePdfFile(file);
    } else if (isEpubFile(file)) {
      rawText = await parseEpubFile(file);
    } else if (isDocxFile(file)) {
      rawText = await parseDocxFile(file);
    } else {
      throw new Error(
        `Unsupported file type. Please upload a .txt, .pdf, .epub, or .docx file.`
      );
    }
  } catch (error) {
    // Re-throw parser errors as-is (they already have good messages)
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to parse file: Unknown error');
  }

  // Validate the extracted text
  const validation = validateText(rawText);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid text content');
  }

  // Parse text into words
  const words = parseTextToWords(rawText);

  // Validate that we got some words
  if (words.length === 0) {
    throw new Error('This file contains no text. Please upload a file with readable content.');
  }

  // Count words (should match words.length, but using utility for consistency)
  const wordCount = countWords(rawText);

  // Return standardized ParsedDocument object
  return {
    words,
    fileName: file.name,
    totalWords: wordCount,
    fileSize: file.size,
  };
}

/**
 * Get supported file extensions
 *
 * @returns Array of supported file extensions (with dots)
 */
export function getSupportedExtensions(): string[] {
  return ['.txt', '.pdf', '.epub', '.docx'];
}

/**
 * Check if a file type is supported
 *
 * @param file - The file to check
 * @returns true if the file type is supported
 */
export function isSupportedFile(file: File): boolean {
  return isTxtFile(file) || isPdfFile(file) || isEpubFile(file) || isDocxFile(file);
}

// Re-export individual parsers for direct use if needed
export { parseTxtFile, isTxtFile } from './txt-parser';
export { parsePdfFile, isPdfFile } from './pdf-parser';
export { parseEpubFile, isEpubFile } from './epub-parser';
export { parseDocxFile, isDocxFile } from './docx-parser';
