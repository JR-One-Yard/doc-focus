/**
 * Tests for File Validation Utilities
 *
 * Tests file type, size, and content validation.
 */

import { describe, it, expect } from 'vitest';
import {
  isValidExtension,
  getFileExtension,
  isValidMimeType,
  validateFileSize,
  validateFileType,
  validateFile,
  validateParsedContent,
  getParsingErrorMessage,
  MAX_FILE_SIZE,
  LARGE_FILE_THRESHOLD,
} from './file-validator';

describe('isValidExtension', () => {
  describe('valid extensions', () => {
    it('should accept .txt files', () => {
      expect(isValidExtension('document.txt')).toBe(true);
    });

    it('should accept .pdf files', () => {
      expect(isValidExtension('document.pdf')).toBe(true);
    });

    it('should accept .epub files', () => {
      expect(isValidExtension('book.epub')).toBe(true);
    });

    it('should accept .docx files', () => {
      expect(isValidExtension('document.docx')).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(isValidExtension('DOCUMENT.TXT')).toBe(true);
      expect(isValidExtension('Document.Pdf')).toBe(true);
      expect(isValidExtension('Book.EPUB')).toBe(true);
      expect(isValidExtension('File.DOCX')).toBe(true);
    });

    it('should accept filenames with multiple dots', () => {
      expect(isValidExtension('my.document.v2.pdf')).toBe(true);
      expect(isValidExtension('file.backup.txt')).toBe(true);
    });
  });

  describe('invalid extensions', () => {
    it('should reject .doc files', () => {
      expect(isValidExtension('document.doc')).toBe(false);
    });

    it('should reject .html files', () => {
      expect(isValidExtension('page.html')).toBe(false);
    });

    it('should reject .jpg files', () => {
      expect(isValidExtension('image.jpg')).toBe(false);
    });

    it('should reject .zip files', () => {
      expect(isValidExtension('archive.zip')).toBe(false);
    });

    it('should reject files without extension', () => {
      expect(isValidExtension('README')).toBe(false);
    });

    it('should reject files with wrong extension substring', () => {
      expect(isValidExtension('document.txt.bak')).toBe(false);
    });
  });
});

describe('getFileExtension', () => {
  it('should extract .txt extension', () => {
    expect(getFileExtension('document.txt')).toBe('.txt');
  });

  it('should extract .pdf extension', () => {
    expect(getFileExtension('file.pdf')).toBe('.pdf');
  });

  it('should extract .epub extension', () => {
    expect(getFileExtension('book.epub')).toBe('.epub');
  });

  it('should extract .docx extension', () => {
    expect(getFileExtension('document.docx')).toBe('.docx');
  });

  it('should handle multiple dots', () => {
    expect(getFileExtension('my.file.v2.pdf')).toBe('.pdf');
  });

  it('should be case-insensitive', () => {
    expect(getFileExtension('FILE.TXT')).toBe('.txt');
  });

  it('should return empty string for files without extension', () => {
    expect(getFileExtension('README')).toBe('');
  });
});

describe('isValidMimeType', () => {
  describe('valid MIME types', () => {
    it('should accept text/plain for .txt files', () => {
      expect(isValidMimeType('document.txt', 'text/plain')).toBe(true);
    });

    it('should accept application/pdf for .pdf files', () => {
      expect(isValidMimeType('document.pdf', 'application/pdf')).toBe(true);
    });

    it('should accept application/epub+zip for .epub files', () => {
      expect(isValidMimeType('book.epub', 'application/epub+zip')).toBe(true);
    });

    it('should accept DOCX MIME type for .docx files', () => {
      expect(
        isValidMimeType(
          'document.docx',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      ).toBe(true);
    });

    it('should accept empty MIME type for valid extensions', () => {
      expect(isValidMimeType('document.txt', '')).toBe(true);
      expect(isValidMimeType('document.pdf', '')).toBe(true);
    });
  });

  describe('invalid MIME types', () => {
    it('should reject wrong MIME type for .txt files', () => {
      expect(isValidMimeType('document.txt', 'application/pdf')).toBe(false);
    });

    it('should reject wrong MIME type for .pdf files', () => {
      expect(isValidMimeType('document.pdf', 'text/plain')).toBe(false);
    });

    it('should reject unsupported MIME types', () => {
      expect(isValidMimeType('image.jpg', 'image/jpeg')).toBe(false);
    });

    it('should reject files without valid extension', () => {
      expect(isValidMimeType('document.doc', 'application/msword')).toBe(false);
    });
  });
});

describe('validateFileSize', () => {
  describe('valid file sizes', () => {
    it('should accept small files', () => {
      const result = validateFileSize(1024); // 1 KB
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.warning).toBeUndefined();
    });

    it('should accept medium files', () => {
      const result = validateFileSize(5 * 1024 * 1024); // 5 MB
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.warning).toBeUndefined();
    });

    it('should accept files just under the limit', () => {
      const result = validateFileSize(MAX_FILE_SIZE - 1);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept files exactly at the limit', () => {
      const result = validateFileSize(MAX_FILE_SIZE);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('large file warnings', () => {
    it('should warn for files over 10 MB', () => {
      const result = validateFileSize(15 * 1024 * 1024); // 15 MB
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.warning).toBeDefined();
      expect(result.warning).toContain('15.00 MB');
      expect(result.warning).toContain('may take longer');
    });

    it('should warn for files just over threshold', () => {
      const result = validateFileSize(LARGE_FILE_THRESHOLD + 1);
      expect(result.isValid).toBe(true);
      expect(result.warning).toBeDefined();
    });

    it('should not warn for files exactly at threshold', () => {
      const result = validateFileSize(LARGE_FILE_THRESHOLD);
      expect(result.isValid).toBe(true);
      expect(result.warning).toBeUndefined();
    });
  });

  describe('file size errors', () => {
    it('should reject files over 50 MB', () => {
      const result = validateFileSize(60 * 1024 * 1024); // 60 MB
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('60.00 MB');
      expect(result.error).toContain('Maximum file size is 50 MB');
    });

    it('should reject files just over the limit', () => {
      const result = validateFileSize(MAX_FILE_SIZE + 1);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should include file size in error message', () => {
      const result = validateFileSize(75 * 1024 * 1024); // 75 MB
      expect(result.error).toContain('75.00 MB');
    });
  });
});

describe('validateFileType', () => {
  describe('valid file types', () => {
    it('should accept valid TXT file', () => {
      const result = validateFileType('document.txt', 'text/plain');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid PDF file', () => {
      const result = validateFileType('document.pdf', 'application/pdf');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid EPUB file', () => {
      const result = validateFileType('book.epub', 'application/epub+zip');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid DOCX file', () => {
      const result = validateFileType(
        'document.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept files with empty MIME type', () => {
      const result = validateFileType('document.txt', '');
      expect(result.isValid).toBe(true);
    });
  });

  describe('invalid file types', () => {
    it('should reject unsupported extension', () => {
      const result = validateFileType('image.jpg', 'image/jpeg');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unsupported file type');
      expect(result.error).toContain('.txt, .pdf, .epub, or .docx');
    });

    it('should reject mismatched MIME type', () => {
      const result = validateFileType('document.txt', 'application/pdf');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unsupported file type');
    });

    it('should reject files without extension', () => {
      const result = validateFileType('README', 'text/plain');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

describe('validateFile', () => {
  describe('valid files', () => {
    it('should accept valid TXT file', () => {
      const file = new File(['content'], 'document.txt', { type: 'text/plain' });
      const result = validateFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid PDF file', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      const result = validateFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid EPUB file', () => {
      const file = new File(['content'], 'book.epub', {
        type: 'application/epub+zip',
      });
      const result = validateFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid DOCX file', () => {
      const file = new File(['content'], 'document.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const result = validateFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('file type errors', () => {
    it('should reject invalid file type', () => {
      const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unsupported file type');
    });
  });

  describe('file size errors', () => {
    it('should reject oversized file', () => {
      const largeContent = 'x'.repeat(60 * 1024 * 1024); // 60 MB
      const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File too large');
    });
  });

  describe('large file warnings', () => {
    it('should warn for large but valid file', () => {
      const largeContent = 'x'.repeat(15 * 1024 * 1024); // 15 MB
      const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
      const result = validateFile(file);
      expect(result.isValid).toBe(true);
      expect(result.warning).toBeDefined();
      expect(result.warning).toContain('may take longer');
    });
  });
});

describe('validateParsedContent', () => {
  describe('valid content', () => {
    it('should accept non-empty text', () => {
      const result = validateParsedContent('Hello world');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept text with newlines', () => {
      const result = validateParsedContent('Line 1\nLine 2\nLine 3');
      expect(result.isValid).toBe(true);
    });

    it('should accept text with leading/trailing whitespace', () => {
      const result = validateParsedContent('  Hello world  ');
      expect(result.isValid).toBe(true);
    });

    it('should accept large text content', () => {
      const result = validateParsedContent('word '.repeat(10000));
      expect(result.isValid).toBe(true);
    });
  });

  describe('invalid content', () => {
    it('should reject empty string', () => {
      const result = validateParsedContent('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('contains no text');
    });

    it('should reject whitespace-only content', () => {
      const result = validateParsedContent('   \n\n   \t\t   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('contains no text');
    });

    it('should reject tabs and spaces only', () => {
      const result = validateParsedContent('\t\t   \t   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('readable content');
    });
  });
});

describe('getParsingErrorMessage', () => {
  it('should return error message without filename', () => {
    const message = getParsingErrorMessage();
    expect(message).toContain('Unable to read this file');
    expect(message).toContain('corrupted or password-protected');
    expect(message).toContain('try a different file');
  });

  it('should include filename in error message', () => {
    const message = getParsingErrorMessage('document.pdf');
    expect(message).toContain('Unable to read "document.pdf"');
    expect(message).toContain('corrupted or password-protected');
  });

  it('should handle various filenames', () => {
    expect(getParsingErrorMessage('book.epub')).toContain('book.epub');
    expect(getParsingErrorMessage('my file.docx')).toContain('my file.docx');
  });
});
