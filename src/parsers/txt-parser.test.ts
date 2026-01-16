/**
 * Tests for TXT File Parser
 *
 * Tests file reading, encoding handling, error cases, and validation.
 */

import { describe, it, expect } from 'vitest';
import { parseTxtFile, isTxtFile } from './txt-parser';

describe('parseTxtFile', () => {
  describe('successful parsing', () => {
    it('should parse a simple TXT file', async () => {
      const file = new File(['Hello world'], 'test.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe('Hello world');
    });

    it('should parse multi-line text', async () => {
      const content = 'Line 1\nLine 2\nLine 3';
      const file = new File([content], 'multiline.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
    });

    it('should parse text with various line endings (LF)', async () => {
      const content = 'Line 1\nLine 2\nLine 3';
      const file = new File([content], 'unix.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
    });

    it('should parse text with CRLF line endings', async () => {
      const content = 'Line 1\r\nLine 2\r\nLine 3';
      const file = new File([content], 'windows.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
    });

    it('should parse text with CR line endings', async () => {
      const content = 'Line 1\rLine 2\rLine 3';
      const file = new File([content], 'mac.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
    });

    it('should parse text with special characters', async () => {
      const content = 'Hello! @#$%^&*() "quotes" \'apostrophes\'';
      const file = new File([content], 'special.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
    });

    it('should parse text with Unicode characters', async () => {
      const content = 'Hello 世界 🌍 café résumé';
      const file = new File([content], 'unicode.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
    });

    it('should parse text with leading and trailing whitespace', async () => {
      const content = '  \n  Hello world  \n  ';
      const file = new File([content], 'whitespace.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
    });

    it('should parse large text files', async () => {
      const largeContent = 'word '.repeat(10000);
      const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(largeContent);
      expect(result.length).toBeGreaterThanOrEqual(50000);
    });

    it('should parse text with mixed content', async () => {
      const content = `
        Title: My Document

        This is a paragraph with multiple sentences. It contains punctuation!
        And it has line breaks.

        - List item 1
        - List item 2

        Numbers: 1, 2, 3, 4, 5
      `;
      const file = new File([content], 'document.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
    });
  });

  describe('error handling', () => {
    it('should reject empty files', async () => {
      const file = new File([''], 'empty.txt', { type: 'text/plain' });
      await expect(parseTxtFile(file)).rejects.toThrow('File contains no text content');
    });

    it('should reject files with only whitespace', async () => {
      const file = new File(['   \n\n   \t\t   '], 'whitespace.txt', { type: 'text/plain' });
      await expect(parseTxtFile(file)).rejects.toThrow('File contains no text content');
    });

    it('should reject files with only tabs and spaces', async () => {
      const file = new File(['\t\t   \t   '], 'tabs.txt', { type: 'text/plain' });
      await expect(parseTxtFile(file)).rejects.toThrow('File contains no text content');
    });
  });

  describe('encoding handling', () => {
    it('should handle UTF-8 encoded text', async () => {
      // UTF-8 is the default encoding
      const content = 'UTF-8: café, naïve, résumé';
      const file = new File([content], 'utf8.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
    });

    it('should handle emoji and special Unicode', async () => {
      const content = 'Emojis: 😀 🎉 🚀 ❤️';
      const file = new File([content], 'emoji.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
    });

    it('should handle various language characters', async () => {
      const content = 'Languages: 日本語 中文 한글 العربية עברית';
      const file = new File([content], 'languages.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
    });
  });

  describe('real-world scenarios', () => {
    it('should parse a typical document', async () => {
      const content = `
The Quick Brown Fox

The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.

Chapter 1: Introduction

Speed reading is a technique that helps people read faster while maintaining comprehension. It uses various methods including RSVP (Rapid Serial Visual Presentation) and OVP (Optimal Viewing Position) highlighting.

Research shows that average reading speeds range from 200-250 words per minute. With training, some readers can achieve 300-350 WPM while maintaining good comprehension.
      `.trim();

      const file = new File([content], 'article.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toBe(content);
      expect(result).toContain('Quick Brown Fox');
      expect(result).toContain('Chapter 1');
      expect(result).toContain('300-350 WPM');
    });

    it('should preserve formatting in structured text', async () => {
      const content = `
TODO LIST:
1. Read email
2. Finish report
3. Call meeting

NOTES:
- Project deadline: Friday
- Contact: john@example.com
- Budget: $5,000
      `.trim();

      const file = new File([content], 'notes.txt', { type: 'text/plain' });
      const result = await parseTxtFile(file);
      expect(result).toContain('TODO LIST:');
      expect(result).toContain('john@example.com');
      expect(result).toContain('$5,000');
    });
  });
});

describe('isTxtFile', () => {
  describe('valid TXT files', () => {
    it('should return true for .txt files with text/plain MIME type', () => {
      const file = new File(['content'], 'document.txt', { type: 'text/plain' });
      expect(isTxtFile(file)).toBe(true);
    });

    it('should return true for .txt files with empty MIME type', () => {
      const file = new File(['content'], 'document.txt', { type: '' });
      expect(isTxtFile(file)).toBe(true);
    });

    it('should return true for .txt files with text/txt MIME type', () => {
      const file = new File(['content'], 'document.txt', { type: 'text/txt' });
      expect(isTxtFile(file)).toBe(true);
    });

    it('should handle uppercase extension .TXT', () => {
      const file = new File(['content'], 'DOCUMENT.TXT', { type: 'text/plain' });
      expect(isTxtFile(file)).toBe(true);
    });

    it('should handle mixed case extension .Txt', () => {
      const file = new File(['content'], 'Document.Txt', { type: 'text/plain' });
      expect(isTxtFile(file)).toBe(true);
    });
  });

  describe('invalid files', () => {
    it('should return false for .pdf files', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      expect(isTxtFile(file)).toBe(false);
    });

    it('should return false for .docx files', () => {
      const file = new File(['content'], 'document.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      expect(isTxtFile(file)).toBe(false);
    });

    it('should return false for .epub files', () => {
      const file = new File(['content'], 'book.epub', { type: 'application/epub+zip' });
      expect(isTxtFile(file)).toBe(false);
    });

    it('should return false for .html files', () => {
      const file = new File(['content'], 'page.html', { type: 'text/html' });
      expect(isTxtFile(file)).toBe(false);
    });

    it('should return false for .txt file with wrong MIME type', () => {
      const file = new File(['content'], 'document.txt', { type: 'application/json' });
      expect(isTxtFile(file)).toBe(false);
    });

    it('should return false for non-.txt file with text/plain MIME type', () => {
      const file = new File(['content'], 'document.doc', { type: 'text/plain' });
      expect(isTxtFile(file)).toBe(false);
    });

    it('should return false for files without extension', () => {
      const file = new File(['content'], 'document', { type: 'text/plain' });
      expect(isTxtFile(file)).toBe(false);
    });
  });
});
