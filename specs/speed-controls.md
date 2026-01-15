# Speed Controls

## Job to Be Done

As a user, I need to control the reading speed and playback so that I can read at my comfortable pace and manage the reading session effectively.

## Desired Outcomes

Users can:
- Adjust reading speed from 50 to 350 words per minute
- Start and stop reading playback at will
- Navigate forward and backward through text
- Use keyboard shortcuts for efficient control
- See current speed setting clearly

## Acceptance Criteria

### Speed Adjustment
- ✓ Support speed range: 50 WPM to 350 WPM
- ✓ Provide slider control for speed adjustment
- ✓ Provide numeric input for precise speed entry
- ✓ Display current WPM setting clearly
- ✓ Update speed immediately when changed (even during playback)
- ✓ Persist speed setting across sessions (LocalStorage)

### Speed Limits & Warnings
- ✓ Hard limit at 350 WPM maximum (cannot exceed)
- ✓ Display warning when speed exceeds 300 WPM
- ✓ Warning explains comprehension trade-offs at high speeds
- ✓ Warning references scientific research (see PROJECT-STATUS.md)

### Playback Controls
- ✓ Play button: Start RSVP playback
- ✓ Pause button: Stop playback (maintain position)
- ✓ Resume from paused position
- ✓ Visual indicator of play/pause state

### Navigation Controls
- ✓ Previous word: Go back one word
- ✓ Next word: Advance one word
- ✓ Navigation works during both playback and pause
- ✓ Navigation updates position immediately

### Keyboard Shortcuts
- ✓ SPACE: Toggle play/pause
- ✓ LEFT ARROW: Previous word
- ✓ RIGHT ARROW: Next word
- ✓ UP ARROW: Increase speed (by 25-50 WPM)
- ✓ DOWN ARROW: Decrease speed (by 25-50 WPM)
- ✓ ESC: Stop reading / close document (if applicable)
- ✓ Keyboard shortcuts work when reading view is focused

### Visual Feedback
- ✓ Clear play/pause button state (icon changes)
- ✓ Speed value displayed prominently
- ✓ Controls are easily accessible but not distracting
- ✓ Hover states for interactive elements

## Speed Presets (Optional for MVP)

Preset buttons for common speeds:
- Slow: 200 WPM
- Medium: 275 WPM
- Fast: 350 WPM

## Success Criteria

### Functional Requirements
- [ ] User can adjust speed via slider or input field
- [ ] Speed changes take effect immediately (even during playback)
- [ ] Play/pause works reliably with SPACE key and button
- [ ] Arrow keys navigate words correctly
- [ ] Speed setting persists across browser sessions

### Warning System
- [ ] Warning appears when speed > 300 WPM
- [ ] Warning is dismissible but reappears on next session
- [ ] Warning includes scientific explanation (comprehension trade-offs)
- [ ] Hard limit at 350 WPM prevents exceeding maximum

### User Experience
- [ ] Controls are intuitive and discoverable
- [ ] Keyboard shortcuts feel natural and responsive
- [ ] Speed adjustment is smooth (no stuttering during playback)
- [ ] Control UI doesn't obstruct reading view

### Test Coverage
- [ ] Unit tests for speed validation (min/max limits)
- [ ] Unit tests for WPM to milliseconds conversion
- [ ] Integration tests for keyboard shortcut handlers
- [ ] Tests for speed persistence in LocalStorage
- [ ] Tests for warning display logic

## Scientific Constraints

**Maximum Speed: 350 WPM**
- Research shows comprehension degrades significantly above 350 WPM
- Studies cited in PROJECT-STATUS.md (lines 169-198)
- Key finding: "Higher speeds (>350 WPM) produce significantly lower comprehension"

**Recommended Ranges:**
- 200-250 WPM: Safe for most content with good comprehension
- 250-300 WPM: Slight comprehension trade-offs, good for familiar material
- 300-350 WPM: Significant trade-offs, best for skimming or re-reading

**Warning Messages:**
```
Speed Warning (>300 WPM):
"At speeds above 300 WPM, comprehension may decrease significantly. This speed is best for:
- Skimming emails and routine documents
- Re-reading familiar material
- Initial review before deep reading

Not recommended for:
- Learning new material
- Technical documentation
- Content requiring retention"
```

## Technical Considerations

**Speed Calculation:**
```typescript
// WPM to milliseconds per word
const msPerWord = (60000 / wpm)

// Examples:
// 200 WPM = 300ms per word
// 300 WPM = 200ms per word
// 350 WPM = 171ms per word
```

**State Management:**
- Current speed (WPM)
- Playback state (playing/paused)
- Current word position
- Warning dismissed state

**Persistence:**
- Store in LocalStorage: `{ speed: number, warningDismissed: boolean }`
- Load on app initialization
- Update on every speed change

## Accessibility

- Keyboard shortcuts must work without mouse
- Focus states clearly visible on controls
- Screen reader announcements for play/pause state
- Speed value announced when changed

## Out of Scope (Future Enhancements)

- Variable speed during playback (slow down for complex words)
- Speed learning mode (gradually increase over time)
- Per-document speed settings
- Speed adjustment based on comprehension quiz results
- Automatic pause on punctuation (periods, commas)
- Speed profiles (save multiple speed presets)

## References

- PROJECT-STATUS.md lines 169-198: Scientific research on speed limits
- speed-reading-apps-research.md: Speed control patterns from competitors
- FastReader app: Observed keyboard shortcuts and controls
