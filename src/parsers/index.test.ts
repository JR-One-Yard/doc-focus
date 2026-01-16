/**
 * Tests for Unified Parser Interface
 *
 * Tests file routing, text processing, and error handling.
 */

import { describe, it, expect } from 'vitest';
import {
  parseFile,
  getSupportedExtensions,
  isSupportedFile,
} from './index';

describe('parseFile', () => {
  describe('TXT file parsing', () => {
    it('should parse a simple TXT file', async () => {
      const content = 'Hello world! This is a test.';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await parseFile(file);

      expect(result.fileName).toBe('test.txt');
      expect(result.words).toEqual(['Hello', 'world!', 'This', 'is', 'a', 'test.']);
      expect(result.totalWords).toBe(6);
      expect(result.fileSize).toBe(content.length);
    });

    it('should handle multi-line TXT files', async () => {
      const content = 'Line one.\nLine two.\nLine three.';
      const file = new File([content], 'multiline.txt', { type: 'text/plain' });
      const result = await parseFile(file);

      expect(result.words).toContain('Line');
      expect(result.words).toContain('one.');
      expect(result.words).toContain('two.');
      expect(result.words).toContain('three.');
    });

    it('should preserve punctuation in words', async () => {
      const content = "Don't worry, it's okay!";
      const file = new File([content], 'punctuation.txt', { type: 'text/plain' });
      const result = await parseFile(file);

      expect(result.words).toContain("Don't");
      expect(result.words).toContain("worry,");
      expect(result.words).toContain("it's");
      expect(result.words).toContain("okay!");
    });
  });

  describe('error handling', () => {
    it('should reject unsupported file types', async () => {
      const file = new File(['content'], 'test.html', { type: 'text/html' });
      await expect(parseFile(file)).rejects.toThrow('Unsupported file type');
    });

    it('should reject empty TXT files', async () => {
      const file = new File([''], 'empty.txt', { type: 'text/plain' });
      await expect(parseFile(file)).rejects.toThrow();
    });

    it('should reject TXT files with only whitespace', async () => {
      const file = new File(['   \n\n   '], 'whitespace.txt', { type: 'text/plain' });
      await expect(parseFile(file)).rejects.toThrow();
    });

    it('should reject files without extension', async () => {
      const file = new File(['content'], 'noextension', { type: 'text/plain' });
      await expect(parseFile(file)).rejects.toThrow('Unsupported file type');
    });

    it('should reject files with wrong extension for MIME type', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'text/plain' });
      await expect(parseFile(file)).rejects.toThrow();
    });
  });

  describe('document metadata', () => {
    it('should include file name in result', async () => {
      const file = new File(['test content'], 'my-document.txt', { type: 'text/plain' });
      const result = await parseFile(file);
      expect(result.fileName).toBe('my-document.txt');
    });

    it('should include file size in result', async () => {
      const content = 'test content';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await parseFile(file);
      expect(result.fileSize).toBe(content.length);
    });

    it('should include total word count', async () => {
      const file = new File(['one two three four five'], 'test.txt', { type: 'text/plain' });
      const result = await parseFile(file);
      expect(result.totalWords).toBe(5);
    });
  });

  describe('text processing', () => {
    it('should clean excessive whitespace', async () => {
      const file = new File(['word1    word2     word3'], 'test.txt', { type: 'text/plain' });
      const result = await parseFile(file);
      expect(result.words).toEqual(['word1', 'word2', 'word3']);
    });

    it('should handle various line endings', async () => {
      const content = 'line1\r\nline2\rline3\nline4';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await parseFile(file);
      expect(result.words).toContain('line1');
      expect(result.words).toContain('line2');
      expect(result.words).toContain('line3');
      expect(result.words).toContain('line4');
    });

    it('should handle Unicode characters', async () => {
      const file = new File(['café résumé naïve'], 'unicode.txt', { type: 'text/plain' });
      const result = await parseFile(file);
      expect(result.words).toContain('café');
      expect(result.words).toContain('résumé');
      expect(result.words).toContain('naïve');
    });
  });

  describe('real-world scenarios', () => {
    it('should parse a typical document paragraph', async () => {
      const content = `
        The quick brown fox jumps over the lazy dog. This pangram
        contains every letter of the alphabet at least once.
      `;
      const file = new File([content], 'pangram.txt', { type: 'text/plain' });
      const result = await parseFile(file);

      expect(result.totalWords).toBeGreaterThan(10);
      expect(result.words).toContain('quick');
      expect(result.words).toContain('brown');
      expect(result.words).toContain('fox');
    });

    it('should handle large word count', async () => {
      const words = Array(1000).fill('word').join(' ');
      const file = new File([words], 'large.txt', { type: 'text/plain' });
      const result = await parseFile(file);

      expect(result.totalWords).toBe(1000);
      expect(result.words.length).toBe(1000);
    });
  });
});

describe('getSupportedExtensions', () => {
  it('should return all supported extensions', () => {
    const extensions = getSupportedExtensions();
    expect(extensions).toContain('.txt');
    expect(extensions).toContain('.pdf');
    expect(extensions).toContain('.epub');
    expect(extensions).toContain('.docx');
  });

  it('should return extensions with dots', () => {
    const extensions = getSupportedExtensions();
    extensions.forEach(ext => {
      expect(ext).toMatch(/^\./);
    });
  });

  it('should return exactly 4 extensions for MVP', () => {
    const extensions = getSupportedExtensions();
    expect(extensions).toHaveLength(4);
  });
});

describe('isSupportedFile', () => {
  it('should return true for TXT files', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    expect(isSupportedFile(file)).toBe(true);
  });

  it('should return true for PDF files', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    expect(isSupportedFile(file)).toBe(true);
  });

  it('should return true for EPUB files', () => {
    const file = new File(['content'], 'test.epub', { type: 'application/epub+zip' });
    expect(isSupportedFile(file)).toBe(true);
  });

  it('should return true for DOCX files', () => {
    const file = new File(['content'], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    expect(isSupportedFile(file)).toBe(true);
  });

  it('should return false for HTML files', () => {
    const file = new File(['content'], 'test.html', { type: 'text/html' });
    expect(isSupportedFile(file)).toBe(false);
  });

  it('should return false for JSON files', () => {
    const file = new File(['{}'], 'test.json', { type: 'application/json' });
    expect(isSupportedFile(file)).toBe(false);
  });

  it('should return false for image files', () => {
    const file = new File(['content'], 'test.png', { type: 'image/png' });
    expect(isSupportedFile(file)).toBe(false);
  });

  it('should return false for DOC files (old Word format)', () => {
    const file = new File(['content'], 'test.doc', { type: 'application/msword' });
    expect(isSupportedFile(file)).toBe(false);
  });
});
