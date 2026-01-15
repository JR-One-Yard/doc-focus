# Progress Tracking

## Job to Be Done

As a user, I need to see my reading progress and resume where I left off so that I can track my position in documents and continue reading across sessions.

## Desired Outcomes

Users can:
- See current reading position within the document
- Know how much of the document they've completed
- Resume reading from where they left off (even after closing browser)
- Jump to specific positions in the document
- Track reading time and speed

## Acceptance Criteria

### Position Tracking

**Current Position Display:**
- ✓ Show current word number (e.g., "Word 234 of 1,528")
- ✓ Show percentage complete (e.g., "15%")
- ✓ Update position in real-time during playback
- ✓ Position remains accurate after pause/resume

**Visual Progress:**
- ✓ Display progress bar showing % complete
- ✓ Progress bar fills from left to right
- ✓ Progress bar updates smoothly during playback
- ✓ Clicking on progress bar jumps to that position

### Position Memory (Persistence)

**Session Persistence:**
- ✓ Save reading position when user pauses or closes document
- ✓ Save reading position when user closes browser tab
- ✓ Save reading position when user navigates away
- ✓ Restore position when user reopens same document
- ✓ Store position per document (identify by file name/hash)

**Storage:**
- ✓ Use LocalStorage for position persistence
- ✓ Store: `{ documentId, currentWordIndex, totalWords, timestamp }`
- ✓ Clear old document data after 30 days (cleanup)
- ✓ Handle LocalStorage quota exceeded gracefully

### Navigation

**Position Slider:**
- ✓ Provide slider control to jump to any position in document
- ✓ Slider represents full document (0% to 100%)
- ✓ Dragging slider updates position immediately
- ✓ Visual preview of target word when hovering (optional for MVP)

**Jump Controls:**
- ✓ Jump to beginning (word 0)
- ✓ Jump to end (last word)
- ✓ Jump forward by percentage (e.g., +10%)
- ✓ Jump backward by percentage (e.g., -10%)

### Reading Statistics (Optional for MVP)

**Session Stats:**
- Total words read
- Time spent reading
- Average reading speed (WPM)
- Session start/end time

**Document Stats:**
- Total words in document
- Estimated time to complete (at current WPM)
- Time remaining

## Success Criteria

### Functional Requirements
- [ ] User can see current word position and percentage complete
- [ ] Progress bar accurately reflects position in document
- [ ] Reading position persists across browser sessions
- [ ] User can resume reading from saved position
- [ ] User can jump to different positions via slider or buttons

### Data Persistence
- [ ] Position saves automatically every 5 seconds during reading
- [ ] Position saves immediately on pause or close
- [ ] Saved positions load correctly when document reopens
- [ ] Multiple documents can have independent saved positions
- [ ] Old document data is cleaned up automatically

### User Experience
- [ ] Progress updates are smooth (no flickering)
- [ ] Position controls are responsive and immediate
- [ ] Progress bar is clearly visible but not distracting
- [ ] Navigation is intuitive and predictable

### Test Coverage
- [ ] Unit tests for position calculation (word index ↔ percentage)
- [ ] Unit tests for LocalStorage save/load
- [ ] Unit tests for document identification (hashing)
- [ ] Integration tests for position persistence across sessions
- [ ] Edge case tests (empty document, single word, very long document)

## Technical Considerations

### Document Identification

**How to identify documents uniquely:**

Option 1: File name + file size (simple but can collide)
```typescript
const documentId = `${fileName}-${fileSize}`
```

Option 2: File content hash (more robust)
```typescript
// Hash first 1KB + last 1KB of content
const documentId = await hashContent(content)
```

**Recommendation:** Use Option 1 for MVP (simpler), Option 2 for production

### LocalStorage Schema

```typescript
interface ReadingPosition {
  documentId: string
  fileName: string
  currentWordIndex: number
  totalWords: number
  timestamp: number // Unix timestamp
  speed: number // WPM at time of save
}

// Storage key: 'fastreader_positions'
// Value: JSON array of ReadingPosition objects
```

### Position Calculation

```typescript
// Word index to percentage
const percentage = (currentIndex / totalWords) * 100

// Percentage to word index
const wordIndex = Math.floor((percentage / 100) * totalWords)

// Time remaining estimate
const wordsRemaining = totalWords - currentIndex
const minutesRemaining = wordsRemaining / currentSpeed
```

### Auto-Save Timing

- Save position every 5 seconds during active reading
- Save immediately on:
  - Pause button click
  - Document close
  - Browser tab close (beforeunload event)
  - Navigation away from reader

### Cleanup Strategy

- Run cleanup on app initialization
- Remove positions older than 30 days
- Keep max 50 most recent documents
- Allow user to manually clear history (future enhancement)

## Performance

- Position updates should not impact reading performance
- LocalStorage operations should be non-blocking
- Progress bar updates should be throttled (every 100ms max)
- Auto-save should be debounced (don't save every word)

## Accessibility

- Progress percentage announced to screen readers
- Keyboard navigation for position controls (Tab, Arrow keys)
- Focus visible on progress bar and slider
- Position changes announced clearly

## Out of Scope (Future Enhancements)

- Cloud sync across devices
- Reading history dashboard
- Reading statistics graphs
- Bookmarks at specific positions
- Notes/annotations at positions
- Reading goals and achievements
- Speed reading analytics over time
- Export reading statistics
- Social sharing of reading progress
- Reading streaks and habits tracking

## References

- PROJECT-STATUS.md: Position memory across devices (future)
- FastReader app: Basic progress tracking with word counter
- Spreeder: Cloud sync with position memory (advanced feature)
