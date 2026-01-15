# User Interface

## Job to Be Done

As a user, I need a clean, minimal, and distraction-free interface so that I can focus on reading without visual clutter interfering with my concentration.

## Context

Based on FastReader app analysis and speed reading UX best practices, the UI should prioritize:
- Minimal distraction during reading
- Dark theme to reduce eye strain
- Clear visual hierarchy
- Essential controls easily accessible but not intrusive

## Desired Outcomes

Users can:
- Focus entirely on reading text without distractions
- Easily access controls when needed
- Read comfortably in low-light conditions
- Navigate the app intuitively without instructions

## Acceptance Criteria

### Visual Design

**Color Scheme (Dark Theme):**
- ✓ Dark background (charcoal/black: #1a1a1a or similar)
- ✓ Light text for high contrast (white/off-white: #f5f5f5)
- ✓ Red accent color for OVP highlighting (#ff0000 or similar)
- ✓ Subtle gray for secondary UI elements (#444444)
- ✓ Overall aesthetic matches FastReader's minimal dark style

**Typography:**
- ✓ RSVP text: Large, readable font (32-48px)
- ✓ Sans-serif font for clarity (Inter, Roboto, or system font)
- ✓ High contrast ratio (WCAG AA: 4.5:1 minimum)
- ✓ UI text: Smaller but still readable (14-16px)

**Layout:**
- ✓ RSVP display area: Center of screen, maximum focus
- ✓ Controls: Bottom of screen or hidden until hover/focus
- ✓ File upload: Centered, prominent when no file loaded
- ✓ Minimal chrome: No unnecessary borders or decorations

### Home Screen (No File Loaded)

**Upload Area:**
- ✓ Centered on screen
- ✓ Clear call-to-action: "Drag & drop a file or click to upload"
- ✓ Supported file types listed: TXT, PDF, EPUB, DOCX
- ✓ Drag-over state clearly visible
- ✓ File size limit mentioned (50 MB max)

**Branding (Optional for MVP):**
- App name/logo (minimal, top-left)
- Tagline: "Speed reading with RSVP + OVP highlighting"

### Reading Screen (File Loaded)

**RSVP Display:**
- ✓ Word displayed at absolute center of screen
- ✓ OVP letter highlighted in red
- ✓ Large font size (32-48px, user-configurable future)
- ✓ Smooth transitions between words
- ✓ No distracting animations or effects

**Controls Panel:**
- ✓ Positioned at bottom of screen
- ✓ Semi-transparent background (doesn't obscure content)
- ✓ Contains:
  - Play/Pause button (prominent)
  - Speed slider (50-350 WPM)
  - Speed input field (numeric)
  - Progress bar (current position)
  - Word counter ("Word X of Y")
  - File name display
- ✓ Auto-hide option (hide after inactivity, show on mouse move)

**Progress Indicator:**
- ✓ Progress bar: Thin line at top or bottom of screen
- ✓ Shows percentage complete
- ✓ Clickable to jump to position
- ✓ Updates in real-time during playback

**Warning Messages:**
- ✓ Speed warning (>300 WPM): Modal or banner
- ✓ Dismissible but persists until acknowledged
- ✓ Clear, non-alarmist messaging
- ✓ Links to scientific explanation (optional)

### Responsive Design

**Desktop (Primary Target):**
- ✓ Optimized for 1920×1080 and common resolutions
- ✓ Works on 1366×768 and larger
- ✓ Scales content appropriately for screen size

**Tablet & Mobile (Secondary):**
- ✓ Functional on tablets (iPad, Android tablets)
- ✓ Functional on mobile phones (landscape mode preferred)
- ✓ Touch-friendly controls (larger tap targets)
- ✓ Responsive layout adapts to screen size

### Loading States

**File Parsing:**
- ✓ Loading spinner with progress message
- ✓ "Parsing [filename]..." message
- ✓ Progress indicator for large files
- ✓ Cancel option for slow parsing

**Error States:**
- ✓ Clear error messages (see file-management.md)
- ✓ Suggested actions ("Try another file")
- ✓ Option to return to upload screen

### Accessibility

**Keyboard Navigation:**
- ✓ All controls accessible via keyboard
- ✓ Visible focus states
- ✓ Logical tab order
- ✓ Keyboard shortcuts documented (tooltip or help screen)

**Screen Readers:**
- ✓ Semantic HTML (buttons, inputs, etc.)
- ✓ ARIA labels for interactive elements
- ✓ Status announcements (playback state, position, errors)

**Color Contrast:**
- ✓ Meets WCAG AA standards (4.5:1 minimum)
- ✓ Red OVP highlight distinguishable from background
- ✓ UI controls clearly visible

## Success Criteria

### Visual Quality
- [ ] UI matches FastReader's minimal aesthetic
- [ ] Dark theme reduces eye strain during extended use
- [ ] Red OVP highlighting is clearly visible
- [ ] No visual distractions during reading

### Usability
- [ ] New users can upload file and start reading without instructions
- [ ] All controls are discoverable and intuitive
- [ ] Keyboard shortcuts work as expected
- [ ] Error messages are helpful and actionable

### Accessibility
- [ ] Passes WCAG AA compliance (color contrast, keyboard nav)
- [ ] Screen reader can navigate and use all features
- [ ] Touch targets are large enough on mobile (44×44px minimum)

### Performance
- [ ] UI renders smoothly at 60 FPS
- [ ] No janky animations or transitions
- [ ] Controls respond immediately to input
- [ ] Page loads in <1 second (excluding file parsing)

### Test Coverage
- [ ] Visual regression tests for key screens
- [ ] Accessibility tests (axe-core or similar)
- [ ] Responsive design tests (desktop, tablet, mobile)
- [ ] Keyboard navigation tests
- [ ] Color contrast validation

## Design Specifications

### Color Palette

```css
:root {
  /* Background */
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --bg-overlay: rgba(26, 26, 26, 0.95);

  /* Text */
  --text-primary: #f5f5f5;
  --text-secondary: #b0b0b0;
  --text-ovp: #ff0000; /* Red for OVP highlighting */

  /* UI Elements */
  --ui-border: #444444;
  --ui-hover: #555555;
  --ui-focus: #666666;

  /* Status */
  --status-success: #4caf50;
  --status-warning: #ff9800;
  --status-error: #f44336;
}
```

### Typography Scale

```css
:root {
  /* RSVP Display */
  --font-rsvp: 48px;

  /* UI Text */
  --font-lg: 18px;
  --font-md: 16px;
  --font-sm: 14px;
  --font-xs: 12px;

  /* Font Family */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif;
}
```

### Spacing & Layout

```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  --border-radius: 8px;
  --control-height: 48px;
}
```

## Component Hierarchy

```
App
├── UploadScreen (when no file loaded)
│   ├── DropZone
│   ├── FileInfo
│   └── ErrorMessage (if error)
│
└── ReadingScreen (when file loaded)
    ├── RSVPDisplay
    │   ├── WordDisplay
    │   │   ├── BeforeOVP
    │   │   ├── OVPLetter (red)
    │   │   └── AfterOVP
    │   └── ProgressBar
    │
    ├── ControlPanel
    │   ├── PlayPauseButton
    │   ├── SpeedControl
    │   │   ├── SpeedSlider
    │   │   └── SpeedInput
    │   ├── PositionControl
    │   │   ├── PrevButton
    │   │   ├── NextButton
    │   │   └── PositionSlider
    │   ├── FileInfo
    │   └── CloseButton
    │
    └── SpeedWarning (modal/banner when speed >300)
```

## Out of Scope (Future Enhancements)

- Light theme option
- Custom color schemes / themes
- Adjustable font size control
- Font family selection
- Control panel customization (hide/show specific controls)
- Full-screen mode
- Focus mode (hide all UI except RSVP text)
- Reading statistics dashboard
- Onboarding tutorial
- Help/documentation screen
- Settings panel
- Animated transitions between screens
- Multi-language UI support
- Custom keyboard shortcut configuration

## References

- PROJECT-STATUS.md: FastReader UI analysis (dark theme, minimal design, red OVP)
- speed-reading-apps-research.md: UI/UX best practices
- FastReader app screenshots: Visual design reference
- Material Design / Apple HIG: Accessibility guidelines
