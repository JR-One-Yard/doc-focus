/**
 * TXT File Parser
 *
 * Parses plain text files (.txt) using the FileReader API.
 * Handles UTF-8 encoding and various text formats.
 *
 * Spec: specs/content-parser.md (TXT section, lines 19-23)
 */

/**
 * Parse a TXT file and extract its text content
 *
 * @param file - The TXT file to parse
 * @returns Promise resolving to the text content
 * @throws Error if file cannot be read or is empty
 *
 * @example
 * ```typescript
 * const file = new File(['Hello world'], 'test.txt', { type: 'text/plain' });
 * const text = await parseTxtFile(file);
 * console.log(text); // "Hello world"
 * ```
 */
export async function parseTxtFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;

      if (typeof result !== 'string') {
        reject(new Error('Failed to read file as text'));
        return;
      }

      // Handle empty files
      if (result.trim().length === 0) {
        reject(new Error('File contains no text content'));
        return;
      }

      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${reader.error?.message || 'Unknown error'}`));
    };

    // Read as text with UTF-8 encoding (default)
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Validate that a file is a TXT file
 *
 * @param file - The file to validate
 * @returns true if file appears to be a TXT file
 *
 * @example
 * ```typescript
 * const file = new File(['test'], 'doc.txt', { type: 'text/plain' });
 * isTxtFile(file); // true
 * ```
 */
export function isTxtFile(file: File): boolean {
  // Check file extension
  const hasTextExtension = file.name.toLowerCase().endsWith('.txt');

  // Check MIME type (may be empty or generic for TXT files)
  const validMimeTypes = ['text/plain', 'text/txt', ''];
  const hasValidMimeType = validMimeTypes.includes(file.type);

  return hasTextExtension && hasValidMimeType;
}
