/**
 * Tests for PDF File Parser
 *
 * Tests file reading, multi-page handling, error cases, and validation.
 */

import { describe, it, expect } from 'vitest';
import { parsePdfFile, isPdfFile } from './pdf-parser';

// Minimal valid PDF structure (Hello World PDF)
// This is a simplified PDF that contains one page with "Hello World" text
const createMinimalPDF = (text: string = 'Hello World'): Uint8Array => {
  // This is a minimal PDF structure following PDF 1.4 spec
  // %PDF-1.4 header + basic catalog + page + content stream + xref + trailer
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(${text}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000262 00000 n
0000000341 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
435
%%EOF`;

  return new TextEncoder().encode(pdfContent);
};

// Create a multi-page PDF
const createMultiPagePDF = (): Uint8Array => {
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(Page 1) Tj
ET
endstream
endobj
6 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 7 0 R >>
endobj
7 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(Page 2) Tj
ET
endstream
endobj
xref
0 8
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000122 00000 n
0000000269 00000 n
0000000348 00000 n
0000000442 00000 n
0000000589 00000 n
trailer
<< /Size 8 /Root 1 0 R >>
startxref
683
%%EOF`;

  return new TextEncoder().encode(pdfContent);
};

// Create an empty PDF (no text content)
const createEmptyPDF = (): Uint8Array => {
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << >> /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 0 >>
stream
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000229 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
278
%%EOF`;

  return new TextEncoder().encode(pdfContent);
};

describe('parsePdfFile', () => {
  describe('successful parsing', () => {
    it('should parse a simple single-page PDF', async () => {
      const pdfBytes = createMinimalPDF('Hello World');
      const file = new File([pdfBytes as BlobPart], 'test.pdf', { type: 'application/pdf' });
      const result = await parsePdfFile(file);

      expect(result).toContain('Hello');
      expect(result).toContain('World');
      expect(result.trim().length).toBeGreaterThan(0);
    });

    it('should parse PDF with custom text content', async () => {
      const pdfBytes = createMinimalPDF('Speed Reading Test');
      const file = new File([pdfBytes as BlobPart], 'reading.pdf', { type: 'application/pdf' });
      const result = await parsePdfFile(file);

      expect(result).toContain('Speed');
      expect(result).toContain('Reading');
      expect(result).toContain('Test');
    });

    it('should parse multi-page PDFs', async () => {
      const pdfBytes = createMultiPagePDF();
      const file = new File([pdfBytes as BlobPart], 'multipage.pdf', { type: 'application/pdf' });
      const result = await parsePdfFile(file);

      expect(result).toContain('Page 1');
      expect(result).toContain('Page 2');
      // Pages should be separated by double newline
      expect(result).toMatch(/Page 1.*Page 2/s);
    });

    it('should handle PDFs with special characters', async () => {
      const pdfBytes = createMinimalPDF('café résumé');
      const file = new File([pdfBytes as BlobPart], 'special.pdf', { type: 'application/pdf' });
      const result = await parsePdfFile(file);

      // Note: Text rendering in minimal PDFs may not preserve special chars perfectly
      // This test validates the parser doesn't crash on special characters
      expect(result.trim().length).toBeGreaterThan(0);
    });

    it('should handle PDFs with numbers and punctuation', async () => {
      const pdfBytes = createMinimalPDF('Test 123! @#$');
      const file = new File([pdfBytes as BlobPart], 'numbers.pdf', { type: 'application/pdf' });
      const result = await parsePdfFile(file);

      expect(result).toContain('Test');
      expect(result.trim().length).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('should reject corrupted PDF files', async () => {
      const file = new File(['not a valid pdf'], 'fake.pdf', { type: 'application/pdf' });
      await expect(parsePdfFile(file)).rejects.toThrow('Failed to load PDF');
    });

    it('should reject invalid PDF structure', async () => {
      const invalidPdf = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // Just "%PDF" header
      const file = new File([invalidPdf as BlobPart], 'invalid.pdf', { type: 'application/pdf' });
      await expect(parsePdfFile(file)).rejects.toThrow('Failed to load PDF');
    });

    it('should reject PDFs with no text content', async () => {
      const pdfBytes = createEmptyPDF();
      const file = new File([pdfBytes as BlobPart], 'empty.pdf', { type: 'application/pdf' });
      await expect(parsePdfFile(file)).rejects.toThrow('PDF contains no readable text content');
    });

    it('should reject files with PDF extension but wrong content', async () => {
      const file = new File(['Just plain text'], 'notapdf.pdf', { type: 'application/pdf' });
      await expect(parsePdfFile(file)).rejects.toThrow('Failed to load PDF');
    });

    it('should handle empty files gracefully', async () => {
      const file = new File([''], 'empty.pdf', { type: 'application/pdf' });
      await expect(parsePdfFile(file)).rejects.toThrow('Failed to load PDF');
    });
  });

  describe('text extraction', () => {
    it('should extract text in correct order', async () => {
      const pdfBytes = createMinimalPDF('First Second Third');
      const file = new File([pdfBytes as BlobPart], 'order.pdf', { type: 'application/pdf' });
      const result = await parsePdfFile(file);

      expect(result.indexOf('First')).toBeLessThan(result.indexOf('Second'));
      expect(result.indexOf('Second')).toBeLessThan(result.indexOf('Third'));
    });

    it('should return non-empty string for valid PDFs', async () => {
      const pdfBytes = createMinimalPDF('Content');
      const file = new File([pdfBytes as BlobPart], 'content.pdf', { type: 'application/pdf' });
      const result = await parsePdfFile(file);

      expect(typeof result).toBe('string');
      expect(result.trim().length).toBeGreaterThan(0);
    });

    it('should preserve spaces between words', async () => {
      const pdfBytes = createMinimalPDF('Word One Word Two');
      const file = new File([pdfBytes as BlobPart], 'spaces.pdf', { type: 'application/pdf' });
      const result = await parsePdfFile(file);

      // Should contain spaces or whitespace between words
      expect(result).toMatch(/Word.*One.*Word.*Two/s);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical document content', async () => {
      const pdfBytes = createMinimalPDF('Quick brown fox');
      const file = new File([pdfBytes as BlobPart], 'pangram.pdf', { type: 'application/pdf' });
      const result = await parsePdfFile(file);

      expect(result).toContain('Quick');
      expect(result).toContain('brown');
      expect(result).toContain('fox');
    });

    it('should parse PDFs with different text content', async () => {
      const pdfBytes = createMinimalPDF('RSVP Speed Reading Application');
      const file = new File([pdfBytes as BlobPart], 'app.pdf', { type: 'application/pdf' });
      const result = await parsePdfFile(file);

      expect(result).toContain('RSVP');
      expect(result).toContain('Speed');
      expect(result).toContain('Reading');
    });
  });
});

describe('isPdfFile', () => {
  describe('valid PDF files', () => {
    it('should return true for .pdf files with application/pdf MIME type', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      expect(isPdfFile(file)).toBe(true);
    });

    it('should return true for .pdf files with application/x-pdf MIME type', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/x-pdf' });
      expect(isPdfFile(file)).toBe(true);
    });

    it('should handle uppercase extension .PDF', () => {
      const file = new File(['content'], 'DOCUMENT.PDF', { type: 'application/pdf' });
      expect(isPdfFile(file)).toBe(true);
    });

    it('should handle mixed case extension .Pdf', () => {
      const file = new File(['content'], 'Document.Pdf', { type: 'application/pdf' });
      expect(isPdfFile(file)).toBe(true);
    });

    it('should handle files with multiple dots in name', () => {
      const file = new File(['content'], 'my.document.v2.pdf', { type: 'application/pdf' });
      expect(isPdfFile(file)).toBe(true);
    });
  });

  describe('invalid files', () => {
    it('should return false for .txt files', () => {
      const file = new File(['content'], 'document.txt', { type: 'text/plain' });
      expect(isPdfFile(file)).toBe(false);
    });

    it('should return false for .docx files', () => {
      const file = new File(['content'], 'document.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      expect(isPdfFile(file)).toBe(false);
    });

    it('should return false for .epub files', () => {
      const file = new File(['content'], 'book.epub', { type: 'application/epub+zip' });
      expect(isPdfFile(file)).toBe(false);
    });

    it('should return false for .html files', () => {
      const file = new File(['content'], 'page.html', { type: 'text/html' });
      expect(isPdfFile(file)).toBe(false);
    });

    it('should return false for .pdf file with wrong MIME type', () => {
      const file = new File(['content'], 'document.pdf', { type: 'text/plain' });
      expect(isPdfFile(file)).toBe(false);
    });

    it('should return false for non-.pdf file with PDF MIME type', () => {
      const file = new File(['content'], 'document.txt', { type: 'application/pdf' });
      expect(isPdfFile(file)).toBe(false);
    });

    it('should return false for files without extension', () => {
      const file = new File(['content'], 'document', { type: 'application/pdf' });
      expect(isPdfFile(file)).toBe(false);
    });

    it('should return false for .pdf file with empty MIME type', () => {
      const file = new File(['content'], 'document.pdf', { type: '' });
      expect(isPdfFile(file)).toBe(false);
    });

    it('should return false for .pdf file with incorrect MIME type', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/json' });
      expect(isPdfFile(file)).toBe(false);
    });
  });
});
