/**
 * DOCX File Parser
 *
 * Parses DOCX files (.docx) using the mammoth library.
 * Extracts text from Microsoft Word documents.
 *
 * Spec: specs/content-parser.md (DOCX section, lines 39-43)
 */

import mammoth from 'mammoth';

/**
 * Parse a DOCX file and extract its text content
 *
 * @param file - The DOCX file to parse
 * @returns Promise resolving to the extracted text content
 * @throws Error if file cannot be read, is empty, or parsing fails
 *
 * @example
 * ```typescript
 * const file = new File([docxBuffer], 'document.docx', {
 *   type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
 * });
 * const text = await parseDocxFile(file);
 * console.log(text); // "Paragraph 1\n\nParagraph 2..."
 * ```
 */
export async function parseDocxFile(file: File): Promise<string> {
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Parse DOCX and extract text
  let result;
  try {
    // mammoth.extractRawText expects { arrayBuffer: ArrayBuffer }
    result = await mammoth.extractRawText({
      arrayBuffer: arrayBuffer
    } as any);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse DOCX: ${error.message}`);
    }
    throw new Error('Failed to parse DOCX: Unknown error');
  }

  // Get the extracted text
  const text = result.value;

  // Handle empty content
  if (!text || text.trim().length === 0) {
    throw new Error('DOCX contains no readable text content');
  }

  // Clean up excessive whitespace while preserving paragraph breaks
  const cleanedText = text
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n'); // Replace 3+ newlines with 2

  return cleanedText;
}

/**
 * Validate that a file is a DOCX file
 *
 * @param file - The file to validate
 * @returns true if file appears to be a DOCX file
 *
 * @example
 * ```typescript
 * const file = new File([buffer], 'document.docx', {
 *   type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
 * });
 * isDocxFile(file); // true
 * ```
 */
export function isDocxFile(file: File): boolean {
  // Check file extension
  const hasDocxExtension = file.name.toLowerCase().endsWith('.docx');

  // Check MIME type
  const validMimeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/docx',
    'application/octet-stream' // Sometimes DOCX files have generic MIME type
  ];
  const hasValidMimeType = validMimeTypes.includes(file.type) || file.type === '';

  return hasDocxExtension && hasValidMimeType;
}
