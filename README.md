# FastReader - Speed Reading Application

FastReader is a modern speed reading application that uses RSVP (Rapid Serial Visual Presentation) combined with OVP (Optimal Viewing Position) highlighting to help users read faster while maintaining comprehension.

## Features

### Core Reading Experience
- **RSVP Display**: Words appear one at a time at a fixed position, eliminating eye movement
- **OVP Highlighting**: Red highlighting of the optimal viewing position (30-35% into each word) for faster recognition
- **Variable Speed Control**: Adjust reading speed from 50 to 350 WPM
- **Multiple File Formats**: Upload and read TXT, PDF, EPUB, and DOCX files
- **Progress Tracking**: Visual progress bar and word counter show your position

### Controls & Navigation
- **Playback Controls**: Play, pause, previous word, next word
- **Speed Adjustment**: Slider and numeric input with 25 WPM increments
- **Progress Bar**: Click anywhere to jump to that position in the document
- **Keyboard Shortcuts**: Complete keyboard control for hands-free reading
- **Speed Warnings**: Automatic warnings when selecting speeds >300 WPM (comprehension trade-off)

### Position Persistence
- **Auto-Save**: Reading position automatically saves every 5 seconds during playback
- **Session Persistence**: Positions persist across browser sessions
- **Multi-Document Support**: Tracks up to 50 documents with automatic cleanup after 30 days
- **Smart Resume**: Reopening a document automatically resumes from your last position

## Keyboard Shortcuts

FastReader is fully keyboard-accessible for hands-free reading:

| Key | Action |
|-----|--------|
| **Space** | Toggle play/pause |
| **Left Arrow** | Previous word |
| **Right Arrow** | Next word |
| **Up Arrow** | Increase speed by 25 WPM |
| **Down Arrow** | Decrease speed by 25 WPM |
| **Home** | Jump to beginning of document |
| **End** | Jump to end of document |
| **Escape** | Close document and return to upload screen |

### Progress Bar Navigation
When the progress bar is focused (click or tab to it):
- **Left/Right Arrows**: Navigate word by word
- **Home/End**: Jump to beginning/end
- **Click**: Jump to any position

## Accessibility

FastReader is built with accessibility as a core priority and meets **WCAG 2.1 AA** compliance standards.

### Screen Reader Support
- **Semantic HTML**: Proper use of `<button>`, `<input>`, `<nav>`, and landmark elements
- **ARIA Labels**: All controls have descriptive labels for screen readers
- **Live Regions**: RSVP word changes are announced to screen readers (`aria-live="polite"`)
- **Modal Dialogs**: Speed warning modal has proper `aria-modal`, `aria-labelledby`, and `aria-describedby`
- **Focus Management**: Focus trap in modals prevents navigation outside dialog

### Keyboard Navigation
- **Full Keyboard Access**: All features accessible via keyboard
- **Logical Tab Order**: Controls follow a natural reading flow
- **Visible Focus Indicators**: Clear 2px outline on all focused elements
- **Focus Trap**: Modals trap focus until dismissed
- **No Keyboard Traps**: Users can always exit any component

### Visual Accessibility
- **High Contrast**: All text meets WCAG AA contrast ratios (4.5:1 minimum)
  - Primary text (#f5f5f5 on #1a1a1a): 15:1 ratio (AAA)
  - Secondary text (#b0b0b0 on #1a1a1a): 7.7:1 ratio (AA)
  - OVP red (#ff0000 on #1a1a1a): 5.25:1 ratio (AA)
- **Touch Targets**: All interactive elements meet 44×44px minimum size
- **Reduced Motion**: Respects `prefers-reduced-motion` system setting
- **High Contrast Mode**: Supports Windows high contrast mode

### Responsive Design
- **Mobile-Friendly**: Optimized for phones, tablets, and desktop
- **Touch Support**: Large touch targets and drag-and-drop file upload
- **Adaptive Layout**: Controls positioned to avoid overlap with reading area
- **Font Scaling**: Supports browser font size preferences

### Accessibility Testing
- **Automated Testing**: 48 automated accessibility tests using axe-core
- **WCAG Validation**: All WCAG 2.1 AA violations resolved
- **Test Coverage**: Components tested for ARIA attributes, keyboard navigation, color contrast, and form accessibility

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Upload a Document**
   - Drag and drop a file (TXT, PDF, EPUB, DOCX) onto the upload area
   - Or click to browse and select a file
   - Maximum file size: 50 MB

2. **Adjust Speed**
   - Use the slider or numeric input to set your reading speed
   - Start with 200-250 WPM if you're new to speed reading
   - Adjust up or down based on comfort and comprehension

3. **Start Reading**
   - Press Play (or Space bar) to begin
   - Words will appear one at a time with the optimal viewing position highlighted in red
   - Use Left/Right arrows to navigate, Up/Down to adjust speed

4. **Take Breaks**
   - Press Pause (or Space bar) to stop
   - Your position is automatically saved
   - Click progress bar to jump to any section

5. **Resume Later**
   - Close the document or browser tab
   - Reopen the same file later to resume from where you left off

## Scientific Background

### Speed Reading Limits
**IMPORTANT**: FastReader enforces a maximum speed of **350 WPM** based on scientific research showing that comprehension degrades significantly above this speed. The app displays warnings when speeds exceed 300 WPM.

### RSVP Technology
Rapid Serial Visual Presentation eliminates eye movements (saccades) by presenting words at a fixed position. This removes the ~10% of reading time spent on eye movement but also eliminates beneficial processes like re-reading and parafoveal preview.

### OVP (Optimal Viewing Position)
Research shows that readers recognize words faster when fixating on a position approximately 30-35% into the word from the beginning. FastReader highlights this position in red to guide optimal eye fixation.

### Best Use Cases
- Skimming emails and routine documents
- Initial review before deep reading
- Re-reading familiar material
- High-volume, low-complexity content

### Not Recommended For
- Academic study materials requiring retention
- Complex technical documentation
- Materials requiring deep comprehension

## Development

### Technology Stack
- **React 18** with TypeScript (strict mode)
- **Vite** for build tooling and development server
- **Vitest** + React Testing Library for testing
- **PDF.js** for PDF parsing
- **EPUB.js** for EPUB parsing
- **Mammoth** for DOCX parsing
- **React Dropzone** for file upload UI

### Project Structure
```
src/
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Shared utilities (OVP, speed, text parsing)
├── parsers/         # File format parsers (TXT, PDF, EPUB, DOCX)
├── utils/           # Validators, formatters, storage
├── types.ts         # TypeScript type definitions
└── App.tsx          # Main application component
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Validation (Tests + TypeCheck + Lint)

```bash
npm run validate
```

### Test Coverage
- **594 tests** across 28 test files (all passing)
- Comprehensive unit tests for all utilities and components
- 48 automated accessibility tests using axe-core
- Integration tests for file parsing and playback

## Browser Support

FastReader supports all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Note**: Internet Explorer is not supported.

## Performance

- **Bundle Size**: 274.70 kB (gzip: 84.45 kB)
- **Build Time**: ~3-5 seconds
- **Test Suite**: 594 tests run in ~4 seconds

## Contributing

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Functional React components with hooks
- Co-located tests with `*.test.ts` or `*.test.tsx` naming

### TypeScript Guidelines
- Use `import type { }` for type-only imports
- Avoid literal types in useState (specify generic type)
- All code must pass `npm run typecheck`

### Before Committing
```bash
npm run validate  # Runs tests, typecheck, and lint
npm run build     # Verify production build
```

## License

This project is built for educational purposes to demonstrate modern web development with React, TypeScript, and accessibility best practices.

## Credits

Based on scientific research in speed reading and RSVP technology. OVP calculation methodology derived from cognitive psychology research on optimal word recognition positions.

---

**Version**: 1.0.0 (Phase 5 - Production Ready)
**Last Updated**: January 2026
