# RSVP Display Engine

## Job to Be Done

As a user reading content, I need words to be displayed sequentially at a fixed position on screen so that I can read faster without moving my eyes across the page.

## Context

RSVP (Rapid Serial Visual Presentation) is a scientifically-validated technique that presents text one word at a time at the same screen position, eliminating the need for eye movements (saccades) and enabling faster reading speeds.

## Desired Outcomes

Users can:
- See words displayed one at a time at a consistent screen position
- Read at speeds from 50 to 350 words per minute
- Experience smooth, consistent timing between words
- Maintain focus on a single point without eye movement

## Acceptance Criteria

### Word Display
- ✓ Display exactly one word at a time at a fixed position on screen
- ✓ Words appear centered on the screen (both horizontally and vertically)
- ✓ Text is large enough to be readable without strain (minimum 24px, recommended 32-48px)
- ✓ Display position remains absolutely fixed - no shifting or movement between words

### Timing & Speed
- ✓ Calculate correct display duration based on WPM setting
  - Formula: duration_ms = (60000 / WPM)
  - Example: 300 WPM = 200ms per word
- ✓ Maintain accurate, consistent timing between words
- ✓ Support speed range from 50 WPM to 350 WPM
- ✓ Timing accuracy within ±10ms of calculated duration

### Transitions
- ✓ Smooth transitions between words (no jarring flashes)
- ✓ No visible lag or stuttering during playback
- ✓ Handle punctuation appropriately (brief pause after periods/commas optional but not required for MVP)

### Content Handling
- ✓ Process text into individual words (split on whitespace)
- ✓ Preserve punctuation with words
- ✓ Handle empty/whitespace-only text gracefully
- ✓ Support text of any length (from single word to full books)

## Scientific Constraints

**Maximum Speed:** 350 WPM
- Research shows comprehension degrades significantly above 350 WPM
- Do NOT support speeds higher than 350 WPM
- Display warning to users when approaching this limit

**Comprehension Trade-offs:**
- Users should be informed that RSVP eliminates:
  - Regression (re-reading for understanding)
  - Parafoveal processing (reading ahead)
  - Reflection time

## Success Criteria

### Functional Requirements
- [ ] User can load text and see RSVP playback
- [ ] Words display at precisely calculated intervals based on WPM
- [ ] Display remains stable and centered during playback
- [ ] Performance is smooth even for long documents (10,000+ words)

### Quality Requirements
- [ ] Zero dropped frames during playback
- [ ] Accurate timing (within ±10ms variance)
- [ ] Text remains readable at all supported speeds (50-350 WPM)

### Test Coverage
- [ ] Unit tests for timing calculation
- [ ] Unit tests for text parsing into words
- [ ] Integration tests for display timing accuracy
- [ ] Tests for edge cases (empty text, single word, very long text)

## Technical Considerations

**Performance:**
- Use requestAnimationFrame or setInterval for timing control
- Pre-process text into word array before playback
- Avoid DOM manipulation overhead (minimize re-renders)

**Accessibility:**
- Text should be readable with sufficient contrast
- Support keyboard controls for playback
- Consider users with visual impairments (configurable font size)

## Out of Scope (Future Enhancements)

- Multi-word chunking (display 2-5 words at once)
- Variable speed based on word complexity
- Automatic pause on punctuation
- Speed adjustment during playback based on comprehension
- Eye tracking integration

## References

- PROJECT-STATUS.md: RSVP research and scientific basis
- speed-reading-apps-research.md: Technical implementation patterns
- FastReader app analysis: Single-word display pattern
