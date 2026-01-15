# OVP (Optimal Viewing Position) Highlighting

## Job to Be Done

As a user reading with RSVP, I need the optimal letter in each word to be highlighted so that my eye can fixate on the most efficient position for fastest word recognition.

## Context

OVP (Optimal Viewing Position) is a scientifically-researched phenomenon where fixating on a specific position within a word leads to fastest recognition. For English text, this position is approximately 30-35% into the word from the start (slightly left of center).

## Desired Outcomes

Users can:
- Fixate their eyes on a single position on screen
- See a highlighted letter that indicates the optimal viewing position
- Recognize words faster due to fixation on OVP
- Read more comfortably without searching for where to look

## Acceptance Criteria

### OVP Calculation
- ✓ Calculate OVP position for each word based on word length
- ✓ Use scientifically-validated calculation method:
  - Words ≤3 letters: position 1 (0-indexed) or 2nd character
  - Words 4-6 letters: position 2 (0-indexed) or 3rd character
  - Words 7-9 letters: Math.floor(length × 0.35)
  - Words ≥10 letters: Math.floor(length × 0.30)
- ✓ Handle edge cases (empty strings, single character)

### Visual Highlighting
- ✓ Highlight exactly one letter per word at the calculated OVP position
- ✓ Use distinctive color for highlighting (red recommended, matching FastReader)
- ✓ Highlight should be clearly visible against background
- ✓ Non-highlighted letters should be readable but less prominent

### Display Integration
- ✓ OVP highlighted letter remains at fixed screen position across all words
- ✓ Word is positioned so that OVP letter appears at screen center
- ✓ Non-highlighted portions of word are visible before and after highlighted letter
- ✓ Entire word is visible and readable while OVP letter is highlighted

### Consistency
- ✓ OVP calculation is deterministic (same word always gets same position)
- ✓ Highlighting works correctly for words of all lengths (1-30+ characters)
- ✓ Highlighting updates synchronously with word display (no lag)

## Scientific Basis

**Research Foundation:**
- OVP is approximately 30-35% into word from start for English
- Position varies by word length (shorter words: more centered)
- Based on:
  - Visual acuity distribution
  - Information distribution in words
  - Perceptual span of vision

**Cross-Language Variations (Future):**
- English/Latin alphabets: Left of center
- Hebrew/Arabic (RTL): Right of center
- Chinese (characters): True center

## Success Criteria

### Functional Requirements
- [ ] Every displayed word has exactly one highlighted letter
- [ ] OVP position is calculated correctly for words of all lengths
- [ ] Highlighted letter remains at screen center across word changes
- [ ] Word positioning adjusts so OVP letter is always centered

### Visual Quality
- [ ] Highlighting is clearly visible and distinctive
- [ ] Full word remains readable (not just highlighted letter)
- [ ] Color contrast meets accessibility standards (WCAG AA minimum)
- [ ] Highlighting doesn't cause eye strain during extended use

### Test Coverage
- [ ] Unit tests for OVP calculation function
- [ ] Test all word length ranges (1-3, 4-6, 7-9, 10+ characters)
- [ ] Test edge cases (empty string, single char, very long words)
- [ ] Visual regression tests for highlighting appearance

## Technical Considerations

**Implementation Pattern:**
- Split word into three parts: before OVP, OVP letter, after OVP
- Render as: `<span>before</span><span class="ovp">highlighted</span><span>after</span>`
- Use CSS to style OVP span with distinctive color

**Performance:**
- OVP calculation should be O(1) time complexity
- Pre-calculate OVP positions for all words if possible
- Minimize DOM manipulation overhead

**Accessibility:**
- Ensure sufficient color contrast (4.5:1 minimum)
- Support users with color blindness (don't rely solely on color)
- Consider alternative highlighting methods (bold, underline) as future enhancement

## Example OVP Calculations

| Word | Length | OVP Position (0-indexed) | Highlighted Letter | Calculation |
|------|--------|--------------------------|-------------------|-------------|
| "I" | 1 | 0 | I | ≤3: position 1 (but capped at 0) |
| "the" | 3 | 1 | h | ≤3: position 1 |
| "read" | 4 | 2 | a | 4-6: position 2 |
| "faster" | 6 | 2 | s | 4-6: position 2 |
| "reading" | 7 | 2 | a | 7-9: floor(7 × 0.35) = 2 |
| "comprehension" | 13 | 3 | p | ≥10: floor(13 × 0.30) = 3 |

## Out of Scope (Future Enhancements)

- Dynamic OVP adjustment based on user feedback
- A/B testing different OVP positions
- Customizable OVP percentage (let users adjust 30-40%)
- Multi-letter highlighting for very long words
- OVP position adjustment for RTL languages

## References

- PROJECT-STATUS.md lines 59-86: OVP research and calculation method
- speed-reading-apps-research.md: FastReader OVP implementation
- Scientific papers on optimal viewing position in reading
