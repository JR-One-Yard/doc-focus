/**
 * File Validation Utilities
 *
 * Validates file types, sizes, and content for upload.
 * Provides standardized error messages.
 *
 * Spec: specs/file-management.md (File Validation, lines 33-37; Error Messages, lines 167-185)
 */

/** Maximum file size: 50 MB */
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB in bytes

/** Large file warning threshold: 10 MB */
export const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024; // 10 MB in bytes

/** Supported file extensions */
export const SUPPORTED_EXTENSIONS = ['.txt', '.pdf', '.epub', '.docx'] as const;

/** Valid MIME types mapped to extensions */
export const VALID_MIME_TYPES: Record<string, string[]> = {
  'text/plain': ['.txt'],
  'application/pdf': ['.pdf'],
  'application/epub+zip': ['.epub'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

/**
 * File validation result
 */
export interface ValidationResult {
  /** Whether the file is valid */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
  /** Warning message (file is valid but has issues) */
  warning?: string;
}

/**
 * Validate file extension
 *
 * @param fileName - The name of the file to validate
 * @returns true if extension is supported
 *
 * @example
 * ```typescript
 * isValidExtension('document.pdf'); // true
 * isValidExtension('image.jpg'); // false
 * ```
 */
export function isValidExtension(fileName: string): boolean {
  const lowerFileName = fileName.toLowerCase();
  return SUPPORTED_EXTENSIONS.some((ext) => lowerFileName.endsWith(ext));
}

/**
 * Get file extension from filename
 *
 * @param fileName - The file name
 * @returns The file extension (including dot) or empty string
 *
 * @example
 * ```typescript
 * getFileExtension('document.pdf'); // '.pdf'
 * getFileExtension('README'); // ''
 * ```
 */
export function getFileExtension(fileName: string): string {
  const match = fileName.toLowerCase().match(/\.[^.]+$/);
  return match ? match[0] : '';
}

/**
 * Validate MIME type matches file extension
 *
 * @param fileName - The file name
 * @param mimeType - The MIME type
 * @returns true if MIME type is valid for the extension
 *
 * @example
 * ```typescript
 * isValidMimeType('doc.pdf', 'application/pdf'); // true
 * isValidMimeType('doc.pdf', 'text/plain'); // false
 * ```
 */
export function isValidMimeType(fileName: string, mimeType: string): boolean {
  const extension = getFileExtension(fileName);

  // For empty MIME types, just check extension (some browsers don't provide MIME)
  if (!mimeType) {
    return isValidExtension(fileName);
  }

  // Check if MIME type is in our supported list
  const validExtensions = VALID_MIME_TYPES[mimeType];
  if (!validExtensions) {
    return false;
  }

  return validExtensions.includes(extension);
}

/**
 * Validate file size
 *
 * @param fileSize - The file size in bytes
 * @returns ValidationResult with error or warning
 *
 * @example
 * ```typescript
 * validateFileSize(1024); // { isValid: true }
 * validateFileSize(60 * 1024 * 1024); // { isValid: false, error: '...' }
 * ```
 */
export function validateFileSize(fileSize: number): ValidationResult {
  if (fileSize > MAX_FILE_SIZE) {
    const sizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `File too large. Maximum file size is 50 MB. Your file: ${sizeMB} MB`,
    };
  }

  if (fileSize > LARGE_FILE_THRESHOLD) {
    const sizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    return {
      isValid: true,
      warning: `Large file detected (${sizeMB} MB). Parsing may take longer.`,
    };
  }

  return { isValid: true };
}

/**
 * Validate file type (extension and MIME type)
 *
 * @param fileName - The file name
 * @param mimeType - The MIME type
 * @returns ValidationResult with error if invalid
 *
 * @example
 * ```typescript
 * validateFileType('doc.pdf', 'application/pdf'); // { isValid: true }
 * validateFileType('image.jpg', 'image/jpeg'); // { isValid: false, error: '...' }
 * ```
 */
export function validateFileType(fileName: string, mimeType: string): ValidationResult {
  // Check extension first
  if (!isValidExtension(fileName)) {
    return {
      isValid: false,
      error: 'Unsupported file type. Please upload a .txt, .pdf, .epub, or .docx file.',
    };
  }

  // Check MIME type matches extension
  if (!isValidMimeType(fileName, mimeType)) {
    return {
      isValid: false,
      error: 'Unsupported file type. Please upload a .txt, .pdf, .epub, or .docx file.',
    };
  }

  return { isValid: true };
}

/**
 * Comprehensive file validation
 *
 * Validates both file type and size.
 *
 * @param file - The File object to validate
 * @returns ValidationResult with error or warning
 *
 * @example
 * ```typescript
 * const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
 * const result = validateFile(file);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateFile(file: File): ValidationResult {
  // Validate file type
  const typeResult = validateFileType(file.name, file.type);
  if (!typeResult.isValid) {
    return typeResult;
  }

  // Validate file size
  const sizeResult = validateFileSize(file.size);
  if (!sizeResult.isValid) {
    return sizeResult;
  }

  // Return warning if present
  if (sizeResult.warning) {
    return {
      isValid: true,
      warning: sizeResult.warning,
    };
  }

  return { isValid: true };
}

/**
 * Validate parsed text content
 *
 * Checks if extracted text is usable (not empty).
 *
 * @param text - The parsed text content
 * @returns ValidationResult with error if content is empty
 *
 * @example
 * ```typescript
 * validateParsedContent('Hello world'); // { isValid: true }
 * validateParsedContent('   \n\n   '); // { isValid: false, error: '...' }
 * ```
 */
export function validateParsedContent(text: string): ValidationResult {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      error: 'This file contains no text. Please upload a file with readable content.',
    };
  }

  return { isValid: true };
}

/**
 * Get error message for parsing failures
 *
 * Returns standardized error message for file parsing errors.
 *
 * @param fileName - Optional file name to include in message
 * @returns Standardized parsing error message
 *
 * @example
 * ```typescript
 * getParsingErrorMessage('document.pdf');
 * // "Unable to read this file. The file may be corrupted or password-protected..."
 * ```
 */
export function getParsingErrorMessage(fileName?: string): string {
  const baseMessage =
    'Unable to read this file. The file may be corrupted or password-protected. Please try a different file.';

  if (fileName) {
    return `Unable to read "${fileName}". The file may be corrupted or password-protected. Please try a different file.`;
  }

  return baseMessage;
}
