# File Management

## Job to Be Done

As a user, I need to upload, select, and manage document files so that I can easily access content for speed reading.

## Desired Outcomes

Users can:
- Upload files quickly via drag-and-drop or file picker
- See which file is currently loaded
- Switch between recently uploaded files
- Remove files from the app
- Understand file upload status and errors

## Acceptance Criteria

### File Upload

**Upload Methods:**
- ✓ Drag-and-drop file onto upload area
- ✓ Click to open file picker dialog
- ✓ Support single file upload at a time (MVP)
- ✓ Visual feedback during drag (highlight drop zone)

**Supported File Types:**
- ✓ .txt (plain text)
- ✓ .pdf (PDF documents)
- ✓ .epub (eBooks)
- ✓ .docx (Word documents)
- ✓ Reject other file types with clear error message

**File Validation:**
- ✓ Validate file extension before processing
- ✓ Check file size (max 50 MB)
- ✓ Validate MIME type matches extension
- ✓ Display error if validation fails

**Upload Flow:**
- ✓ User selects/drops file
- ✓ Show loading indicator during parsing
- ✓ Display progress for large files
- ✓ Automatically start reading mode when parsing complete
- ✓ Show error message if parsing fails

### File Selection

**Current File Display:**
- ✓ Show currently loaded file name
- ✓ Show file size (optional)
- ✓ Show file type/format
- ✓ Indicate when no file is loaded

**File Switching (Optional for MVP):**
- Recently uploaded files list
- Quick switch between recent files
- Restore reading position when switching back

### File Storage

**Client-Side Storage:**
- ✓ Store parsed content in memory during session
- ✓ Do NOT persist full file content across sessions (privacy)
- ✓ Store only reading position and metadata (see progress-tracking.md)
- ✓ Clear file data when document is closed

**Session Behavior:**
- Current file remains loaded during browser session
- File is cleared when user:
  - Uploads new file (replaces current)
  - Explicitly closes document
  - Closes browser tab (data not persisted)

### File Information Display

**Metadata:**
- ✓ File name
- ✓ Total word count
- ✓ Estimated reading time at current speed
- ✓ File size (KB/MB)
- ✓ File type (TXT, PDF, EPUB, DOCX)

**Document Info Panel (Optional):**
- Title (if extracted from document)
- Author (if available)
- Page/chapter count (if available)

## Success Criteria

### Functional Requirements
- [ ] User can drag-and-drop file to upload
- [ ] User can click to open file picker
- [ ] Only supported file types are accepted
- [ ] Files over 50 MB are rejected with clear error
- [ ] Uploaded file is parsed and ready to read
- [ ] Current file name is displayed clearly

### User Experience
- [ ] Upload process is intuitive and discoverable
- [ ] Drag-and-drop area is clearly marked
- [ ] Loading state is visible during parsing
- [ ] Errors are displayed with helpful guidance
- [ ] File information is easily accessible

### Error Handling
- [ ] Unsupported file types show clear error message
- [ ] Oversized files show file size limit error
- [ ] Corrupted files fail gracefully with error message
- [ ] Parsing errors provide actionable guidance
- [ ] All errors include "try again" option

### Test Coverage
- [ ] Unit tests for file validation (type, size)
- [ ] Unit tests for MIME type checking
- [ ] Integration tests for file upload flow
- [ ] Tests for error scenarios (wrong type, too large, corrupted)
- [ ] Tests for drag-and-drop vs file picker

## Technical Considerations

### File Upload Implementation

**HTML5 File API:**
```typescript
<input type="file" accept=".txt,.pdf,.epub,.docx" />
// Or drag-and-drop with:
onDrop={handleFileDrop}
onDragOver={handleDragOver}
```

**React Dropzone (Recommended):**
```typescript
import { useDropzone } from 'react-dropzone'

const { getRootProps, getInputProps } = useDropzone({
  accept: {
    'text/plain': ['.txt'],
    'application/pdf': ['.pdf'],
    'application/epub+zip': ['.epub'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  },
  maxSize: 50 * 1024 * 1024, // 50 MB
  multiple: false,
  onDrop: handleFileUpload
})
```

### File Size Limits

- **Maximum:** 50 MB per file
- **Recommended:** 10 MB or less for best performance
- **Warning:** Show warning for files >10 MB (may take longer to parse)

### MIME Type Validation

```typescript
const validMimeTypes = {
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.epub': 'application/epub+zip',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}
```

### Error Messages

**File Type Error:**
```
"Unsupported file type. Please upload a .txt, .pdf, .epub, or .docx file."
```

**File Size Error:**
```
"File too large. Maximum file size is 50 MB. Your file: [X] MB"
```

**Parsing Error:**
```
"Unable to read this file. The file may be corrupted or password-protected. Please try a different file."
```

**Empty File Error:**
```
"This file contains no text. Please upload a file with readable content."
```

## Privacy & Security

**Client-Side Processing:**
- All file processing happens in browser (no upload to server)
- Files never leave user's device
- Parsed content stored only in browser memory
- No data transmitted over network

**Data Retention:**
- File content cleared when document closed
- Only reading position persisted (see progress-tracking.md)
- No personal data stored or tracked
- No analytics on file content

## Accessibility

- Upload area has clear focus states
- Keyboard accessible (Tab to focus, Enter to open file picker)
- Screen reader announces upload status
- Error messages are announced to screen readers
- File information available to assistive technologies

## Out of Scope (Future Enhancements)

- Multiple file upload (batch processing)
- File library / document management
- Cloud storage integration (Google Drive, Dropbox)
- Import from URL
- Clipboard paste support
- Recent files history (persisted)
- File preview before uploading
- Document search across multiple files
- Folder upload support
- Auto-save uploaded files to IndexedDB
- Export/share processed text
- Password-protected file support
- File compression/decompression

## References

- content-parser.md: Supported file formats and parsing requirements
- PROJECT-STATUS.md: File format support requirements
- FastReader app: Drag-and-drop file upload pattern
- AGENTS.md: Recommended libraries (react-dropzone)
