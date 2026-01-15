# FastReader Implementation Plan

**Generated:** 2026-01-16
**Status:** Planning Complete - Ready for Building Loop
**MVP Goal:** RSVP + OVP speed reader (50-350 WPM) with TXT/PDF/EPUB/DOCX support

---

## Current State

**Implemented:**
- ✅ Project infrastructure (React + TypeScript + Vite)
- ✅ Testing setup (Vitest + React Testing Library - 76 tests passing)
- ✅ Core utilities in `src/lib/`:
  - `ovp-calculator.ts` - OVP position calculation (tested)
  - `speed-timer.ts` - WPM/milliseconds conversion (tested)
  - `text-parser.ts` - Text cleaning and word extraction (tested)
- ✅ PWA configuration
- ✅ Git repository initialized

**Missing (Priority Order):**
All major application components need to be built from scratch.

---

## Implementation Tasks (Prioritized)

### Phase 1: Foundation & Core Types (Tasks 1-3)

- **Task 1:** Create TypeScript types and interfaces
  - Create `src/types/index.ts`
  - Define: `Document`, `ReadingPosition`, `FileMetadata`, `AppState`
  - Define props types for all planned components
  - Export all types for use across app
  - **Tests:** Type compilation validation
  - **Priority:** CRITICAL - needed by all components

- **Task 2:** Create document state management
  - Create `src/hooks/useDocumentState.ts`
  - Manage: current document, words array, metadata
  - Handle: document load, clear, update
  - Use React Context or Zustand for global state
  - **Tests:** State transitions, document lifecycle
  - **Depends on:** Task 1 (types)
  - **Priority:** HIGH - foundation for all features

- **Task 3:** Create reading position state management
  - Create `src/hooks/useReadingPosition.ts`
  - Manage: current word index, playback state, speed (WPM)
  - Handle: play/pause, navigate (prev/next/jump), speed change
  - **Tests:** Position updates, navigation, speed changes
  - **Depends on:** Task 1 (types)
  - **Priority:** HIGH - core RSVP functionality

### Phase 2: File Parsing (Tasks 4-8)

- **Task 4:** Implement TXT file parser
  - Create `src/lib/parsers/txt-parser.ts`
  - Use FileReader API to read UTF-8 text
  - Use existing `text-parser.ts` functions for cleaning/word extraction
  - Return: word array + metadata (word count, filename)
  - **Tests:** Various encodings, line endings, empty files
  - **Depends on:** Task 1 (types)
  - **Priority:** HIGH - simplest parser, needed for testing

- **Task 5:** Implement PDF file parser
  - Create `src/lib/parsers/pdf-parser.ts`
  - Use `pdfjs-dist` library (already installed)
  - Extract text from all pages in order
  - Clean and normalize extracted text
  - **Tests:** Multi-page PDFs, text extraction accuracy
  - **Depends on:** Task 4 pattern
  - **Priority:** HIGH - most common format

- **Task 6:** Implement EPUB file parser
  - Create `src/lib/parsers/epub-parser.ts`
  - Use `epubjs` library (already installed)
  - Extract text from all chapters
  - Strip HTML tags, preserve text content
  - **Tests:** EPUB 2/3 formats, chapter ordering
  - **Depends on:** Task 4 pattern
  - **Priority:** MEDIUM - important but less common

- **Task 7:** Implement DOCX file parser
  - Create `src/lib/parsers/docx-parser.ts`
  - Use `mammoth` library (already installed)
  - Convert to HTML then extract text
  - Preserve paragraph structure
  - **Tests:** Various Word documents, formatting edge cases
  - **Depends on:** Task 4 pattern
  - **Priority:** MEDIUM - common but after PDF

- **Task 8:** Create unified file parser orchestrator
  - Create `src/lib/parsers/index.ts`
  - Validate file type and size (max 50MB)
  - Route to appropriate parser based on extension
  - Handle errors gracefully with user-friendly messages
  - **Tests:** File type routing, validation, error handling
  - **Depends on:** Tasks 4-7 (all parsers)
  - **Priority:** HIGH - integration layer

### Phase 3: RSVP Display Component (Tasks 9-11)

- **Task 9:** Create WordDisplay component with OVP highlighting
  - Create `src/components/WordDisplay.tsx`
  - Display current word at screen center
  - Use `splitWordForOVP()` from `src/lib/ovp-calculator.ts`
  - Apply red highlight to OVP letter
  - Large font (32-48px), dark background, light text
  - **Tests:** OVP highlighting position, rendering, styling
  - **Depends on:** Task 1 (types), Task 3 (position state)
  - **Priority:** CRITICAL - core visual component

- **Task 10:** Create RSVP playback engine
  - Create `src/hooks/useRSVPPlayback.ts`
  - Implement timing loop using `setInterval` or `requestAnimationFrame`
  - Use `wpmToMilliseconds()` from `src/lib/speed-timer.ts`
  - Handle: start, stop, pause, resume playback
  - Maintain accurate timing (±10ms variance)
  - **Tests:** Timing accuracy, playback control, speed changes
  - **Depends on:** Task 3 (position state)
  - **Priority:** CRITICAL - core functionality

- **Task 11:** Create RSVPReader component (main reader view)
  - Create `src/components/RSVPReader.tsx`
  - Integrate WordDisplay + playback engine
  - Show progress indicator
  - Handle keyboard shortcuts (SPACE, ARROWS, ESC)
  - **Tests:** Integration, keyboard events, playback flow
  - **Depends on:** Tasks 9, 10
  - **Priority:** HIGH - main reading interface

### Phase 4: File Upload & Management (Tasks 12-14)

- **Task 12:** Create FileUpload component
  - Create `src/components/FileUpload.tsx`
  - Use `react-dropzone` (already installed)
  - Accept: .txt, .pdf, .epub, .docx
  - Drag-and-drop + click to upload
  - Show loading state during parsing
  - Display errors with helpful messages
  - **Tests:** File validation, upload flow, error states
  - **Depends on:** Task 8 (parser orchestrator), Task 2 (document state)
  - **Priority:** HIGH - entry point for content

- **Task 13:** Create file metadata display
  - Create `src/components/FileInfo.tsx`
  - Display: filename, word count, file size, reading time estimate
  - Use `estimateReadingTime()` from `src/lib/speed-timer.ts`
  - Update dynamically when speed changes
  - **Tests:** Metadata display, time calculations
  - **Depends on:** Task 2 (document state), Task 3 (position state)
  - **Priority:** MEDIUM - nice-to-have info

- **Task 14:** Add loading and error states
  - Create `src/components/LoadingSpinner.tsx`
  - Create `src/components/ErrorMessage.tsx`
  - Handle: parsing, file validation, empty content errors
  - Provide actionable error messages
  - **Tests:** Error scenarios, loading states
  - **Depends on:** Task 12
  - **Priority:** MEDIUM - UX polish

### Phase 5: Speed Controls (Tasks 15-17)

- **Task 15:** Create SpeedControl component
  - Create `src/components/SpeedControl.tsx`
  - Slider: 50-350 WPM range
  - Numeric input: manual WPM entry
  - Validation: clamp to MIN_WPM/MAX_WPM
  - Persist speed to LocalStorage
  - **Tests:** Speed adjustment, validation, persistence
  - **Depends on:** Task 3 (position state)
  - **Priority:** HIGH - critical for user control

- **Task 16:** Create PlaybackControls component
  - Create `src/components/PlaybackControls.tsx`
  - Play/Pause button (prominent, toggle state)
  - Previous/Next word buttons
  - Keyboard shortcut handlers (SPACE, ARROWS)
  - **Tests:** Button clicks, keyboard events, state changes
  - **Depends on:** Task 3 (position state), Task 10 (playback)
  - **Priority:** HIGH - essential controls

- **Task 17:** Implement speed warning system
  - Create `src/components/SpeedWarning.tsx`
  - Trigger warning when WPM > 300
  - Display modal/banner explaining comprehension trade-offs
  - Reference scientific research (PROJECT-STATUS.md)
  - Allow dismissal but persist warning preference
  - **Tests:** Warning display logic, dismissal, persistence
  - **Depends on:** Task 15 (speed control)
  - **Priority:** MEDIUM - important for user education

### Phase 6: Progress Tracking (Tasks 18-20)

- **Task 18:** Create ProgressBar component
  - Create `src/components/ProgressBar.tsx`
  - Visual bar showing % complete
  - Clickable to jump to position
  - Show current word / total words
  - Update smoothly during playback (throttled to 100ms)
  - **Tests:** Progress calculation, click navigation, updates
  - **Depends on:** Task 3 (position state)
  - **Priority:** HIGH - important visual feedback

- **Task 19:** Implement LocalStorage position persistence
  - Create `src/lib/storage/position-storage.ts`
  - Save: documentId, currentWordIndex, totalWords, timestamp, speed
  - Auto-save every 5 seconds during reading
  - Save on pause, close, navigation
  - Load position when reopening same document
  - **Tests:** Save/load, auto-save timing, multiple documents
  - **Depends on:** Task 2 (document state), Task 3 (position state)
  - **Priority:** MEDIUM - nice-to-have persistence

- **Task 20:** Add position navigation controls
  - Create `src/components/PositionControls.tsx`
  - Position slider (0-100%)
  - Jump to start/end buttons
  - Jump forward/backward by percentage
  - **Tests:** Slider interaction, jump controls, position accuracy
  - **Depends on:** Task 3 (position state), Task 18 (progress bar)
  - **Priority:** MEDIUM - advanced navigation

### Phase 7: UI Layout & Styling (Tasks 21-24)

- **Task 21:** Create dark theme CSS variables
  - Update `src/index.css`
  - Define color palette (dark bg, light text, red OVP accent)
  - Typography scale (RSVP 32-48px, UI 14-16px)
  - Spacing system
  - Based on `specs/user-interface.md` design specs
  - **Tests:** Visual regression (if possible), contrast ratios
  - **Priority:** HIGH - foundational styling

- **Task 22:** Create UploadScreen (no file loaded)
  - Create `src/components/UploadScreen.tsx`
  - Centered upload area with clear CTA
  - List supported formats
  - Mention file size limit
  - Drag-over visual feedback
  - **Tests:** Render, interaction states
  - **Depends on:** Task 12 (FileUpload), Task 21 (theme)
  - **Priority:** HIGH - entry screen

- **Task 23:** Create ReadingScreen (file loaded)
  - Create `src/components/ReadingScreen.tsx`
  - Layout: RSVP display centered, controls at bottom
  - Semi-transparent control panel
  - Auto-hide controls option (future enhancement, skip for MVP)
  - **Tests:** Layout, responsive design
  - **Depends on:** Tasks 11 (RSVPReader), 16 (controls), 18 (progress)
  - **Priority:** HIGH - main app screen

- **Task 24:** Update App.tsx with routing logic
  - Update `src/App.tsx`
  - Route between UploadScreen and ReadingScreen
  - Based on document state (loaded vs not loaded)
  - Clean, minimal chrome
  - **Tests:** Screen transitions, state-based routing
  - **Depends on:** Tasks 22, 23
  - **Priority:** HIGH - app integration

### Phase 8: Testing & Polish (Tasks 25-28)

- **Task 25:** Add integration tests for full reading flow
  - Create `src/App.test.tsx`
  - Test: upload file → parse → display RSVP → playback → controls
  - Test: keyboard shortcuts end-to-end
  - Test: position persistence across "sessions"
  - **Tests:** E2E user flows
  - **Depends on:** All prior tasks
  - **Priority:** MEDIUM - quality assurance

- **Task 26:** Add accessibility improvements
  - ARIA labels for all interactive elements
  - Keyboard navigation polish
  - Screen reader announcements for state changes
  - Focus management
  - **Tests:** Accessibility audit (axe-core)
  - **Depends on:** All components
  - **Priority:** MEDIUM - important for inclusivity

- **Task 27:** Performance optimization
  - Debounce/throttle expensive operations
  - Optimize re-renders (React.memo, useMemo)
  - Test with large files (10,000+ words)
  - Ensure smooth 60 FPS playback
  - **Tests:** Performance benchmarks
  - **Depends on:** All prior tasks
  - **Priority:** LOW - optimization after functionality

- **Task 28:** Create sample text files for testing
  - Create `public/samples/` directory
  - Add sample TXT, PDF, EPUB, DOCX files
  - Various sizes (small, medium, large)
  - Use for manual testing and demos
  - **Tests:** N/A (test data)
  - **Priority:** LOW - nice-to-have

---

## Implementation Notes

### MVP Scope
- **Include:** RSVP display, OVP highlighting, speed control (50-350 WPM), TXT/PDF/EPUB/DOCX parsing, progress tracking, position memory, dark UI
- **Exclude:** Training drills, comprehension quizzes, cloud sync, browser extension, multi-word chunking, reading analytics

### Testing Strategy
- Unit tests for all `src/lib/` functions (already done for utilities)
- Component tests for all `src/components/` files
- Integration tests for key user flows
- E2E test for complete reading session
- Target: >80% code coverage

### Performance Targets
- File parsing: <3s for typical documents (<1MB), <10s for large files (5-10MB)
- RSVP timing accuracy: ±10ms variance
- Smooth playback: 60 FPS, no dropped frames
- UI responsiveness: <100ms for all interactions

### Scientific Constraints
- **Maximum speed: 350 WPM** (hard limit - research shows significant comprehension degradation above this)
- Display warning at >300 WPM
- Never support speeds above 350 WPM
- Reference PROJECT-STATUS.md lines 169-198 for research citations

### File Format Priority
1. TXT - simplest, for initial testing
2. PDF - most common document format
3. EPUB - eBook format
4. DOCX - Word documents

### Dependencies Already Installed
- `pdfjs-dist` - PDF parsing
- `epubjs` - EPUB parsing
- `mammoth` - DOCX parsing
- `react-dropzone` - File upload
- `vite-plugin-pwa` - PWA capabilities

---

## Next Steps for Building Loop

1. **Run building loop:**
   ```bash
   cd fastreader
   ./loop.sh 20  # Run max 20 iterations
   ```

2. **Ralph will:**
   - Pick Task 1 (Create TypeScript types)
   - Search codebase to confirm not implemented
   - Implement types in `src/types/index.ts`
   - Write tests
   - Run tests + typecheck + lint (backpressure)
   - Update this plan marking Task 1 complete
   - Commit changes
   - Repeat for Task 2, then 3, etc.

3. **Monitor progress:**
   - Each task = 1 commit
   - Check updated IMPLEMENTATION_PLAN.md after each iteration
   - Observe test coverage increasing

4. **Completion criteria:**
   - All 28 tasks marked complete
   - All tests passing (target >80% coverage)
   - App runs in browser: upload file → read with RSVP + OVP
   - Speed control, progress tracking, position persistence working
   - Dark UI matching FastReader aesthetic

---

**Plan Status:** READY FOR BUILDING
**Estimated Tasks:** 28
**Current Progress:** 0/28 (0%)
**Last Updated:** 2026-01-16
