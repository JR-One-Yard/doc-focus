# Content Parser

## Job to Be Done

As a user, I need to upload documents in various formats (TXT, PDF, EPUB, DOCX) and have the text extracted accurately so that I can read any content with RSVP.

## Desired Outcomes

Users can:
- Upload files in multiple common formats
- Have text extracted automatically and accurately
- Start reading immediately after upload
- See error messages if parsing fails

## Acceptance Criteria

### Supported Formats

**TXT (Plain Text):**
- ✓ Parse UTF-8 encoded text files
- ✓ Handle various line endings (LF, CRLF, CR)
- ✓ Preserve paragraph breaks (double newlines)
- ✓ Handle files of any size (1 KB to 10+ MB)

**PDF:**
- ✓ Extract text from PDF documents
- ✓ Preserve reading order (top to bottom, left to right)
- ✓ Handle multi-page PDFs
- ✓ Support both text-based and OCR'd PDFs (text-based required; OCR optional)
- ✓ Handle PDF files up to 50 MB

**EPUB:**
- ✓ Extract text from EPUB eBook files
- ✓ Preserve chapter structure
- ✓ Handle EPUB 2 and EPUB 3 formats
- ✓ Extract text from all chapters in order
- ✓ Strip HTML tags but preserve text content

**DOCX:**
- ✓ Extract text from Microsoft Word documents
- ✓ Preserve paragraph structure
- ✓ Handle basic formatting (ignore styles, extract text only)
- ✓ Support .docx format (modern Word format)

### Text Processing

**Cleaning & Normalization:**
- ✓ Remove excessive whitespace (multiple spaces → single space)
- ✓ Normalize line breaks (convert all to single newline)
- ✓ Preserve paragraph breaks (double newline)
- ✓ Strip formatting codes/markup while preserving text

**Word Extraction:**
- ✓ Split text into words (split on whitespace)
- ✓ Preserve punctuation with words ("hello," stays as "hello,")
- ✓ Handle contractions correctly ("don't" is one word)
- ✓ Handle hyphenated words appropriately

**Metadata Extraction (Optional for MVP):**
- Document title
- Page/chapter count
- Total word count
- Author (if available)

### Error Handling

**File Validation:**
- ✓ Validate file type before parsing (check extension and MIME type)
- ✓ Reject unsupported file types with clear error message
- ✓ Handle corrupted files gracefully (don't crash)
- ✓ Display meaningful error messages to user

**Parsing Failures:**
- ✓ Catch parsing errors and display user-friendly messages
- ✓ Log technical errors for debugging
- ✓ Allow user to retry with different file

**Empty Content:**
- ✓ Detect when parsed text is empty
- ✓ Warn user if no text could be extracted
- ✓ Suggest checking file format or trying different file

### Performance

- ✓ Parse files in background (don't block UI)
- ✓ Show loading indicator during parsing
- ✓ Cancel parsing if user closes document
- ✓ Handle large files (10,000+ words) efficiently

## Success Criteria

### Functional Requirements
- [ ] User can upload TXT files and see text displayed
- [ ] User can upload PDF files and see extracted text
- [ ] User can upload EPUB files and see extracted text
- [ ] User can upload DOCX files and see extracted text
- [ ] Parsing errors show helpful messages

### Quality Requirements
- [ ] Text extraction accuracy >95% (no missing paragraphs/sections)
- [ ] Parsing completes in <3 seconds for typical documents (<1 MB)
- [ ] Large files (5-10 MB) parse in <10 seconds
- [ ] No crashes on corrupted or invalid files

### Test Coverage
- [ ] Unit tests for each file format parser
- [ ] Unit tests for text cleaning/normalization
- [ ] Unit tests for word extraction
- [ ] Integration tests with sample files (TXT, PDF, EPUB, DOCX)
- [ ] Edge case tests (empty files, corrupted files, very large files)

## Technical Considerations

### Parsing Libraries

**TXT:**
- Native File API (`FileReader`)
- TextDecoder for UTF-8 handling

**PDF:**
- `pdf.js` (Mozilla's library - industry standard)
- Alternative: `pdfjs-dist`

**EPUB:**
- `epub.js` (recommended)
- Alternative: `epubjs`

**DOCX:**
- `mammoth.js` (converts to HTML, then extract text)
- Alternative: `docx-preview` or `docx`

### File Processing Flow

```
1. User selects file
2. Validate file type and size
3. Read file as ArrayBuffer or Blob
4. Pass to appropriate parser based on file extension
5. Extract raw text
6. Clean and normalize text
7. Split into words
8. Return word array + metadata
```

### Security Considerations

- Validate file types (don't trust user-provided extensions)
- Set maximum file size limits (prevent memory exhaustion)
- Parse files client-side when possible (privacy)
- Sanitize extracted text (prevent XSS if rendering HTML)

### Storage

- Do NOT store entire file content in memory after parsing
- Store only:
  - Word array (for current document)
  - Reading position (word index)
  - Document metadata (title, word count)
- Clear from memory when document is closed

## Browser Compatibility

- All parsing should work in modern browsers (Chrome, Firefox, Safari, Edge)
- Use Web Workers for parsing if available (offload from main thread)
- Fallback for older browsers (graceful degradation)

## Out of Scope (Future Enhancements)

- OCR for scanned PDFs (image-based PDFs)
- RTF format support
- HTML file upload
- Markdown file support
- Import from URLs
- Cloud storage integration (Google Drive, Dropbox)
- Advanced formatting preservation (bold, italics)
- Table/list structure preservation
- Multi-language text detection
- Character encoding auto-detection (beyond UTF-8)

## References

- AGENTS.md: Library recommendations for each format
- PROJECT-STATUS.md: File format requirements
- FastReader app: Supports PDF, EPUB, DOCX, TXT
- Spreeder: Supports 52+ file formats (we're starting with 4 essential ones)
