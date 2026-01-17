# FastReader - Focused Reading, One Word at a Time

## Overview

**FastReader** is a focused, distraction-free reading application that helps you lock in and commit to reading word by word. In a world full of distractions, endless scrolling, and eye strain from jumping across pages, FastReader lets you upload any document and read it with complete focus—one word at a time.

### What It Does

FastReader eliminates distractions by presenting words **one at a time** at a **fixed position** on screen. No more jumping around the page. No more getting distracted by other text. No more eye strain from scanning back and forth. Just you and the current word, allowing you to **lock in** and give your full attention to what you're reading.

The app uses **RSVP (Rapid Serial Visual Presentation)** technology with **OVP (Optimal Viewing Position)** highlighting—a red letter that marks where your eye should naturally focus within each word. This fixed focal point reduces eye movement and strain, helping you maintain concentration throughout your reading session.

**Key capabilities:**
- Read TXT, PDF, EPUB, and DOCX files with complete focus
- Adjust reading pace from 50-350 WPM to match your natural rhythm
- Resume exactly where you left off across browser sessions
- Fully keyboard-controlled for hands-free reading
- Dark theme optimized for extended reading sessions with minimal eye strain

### Who It's For

FastReader is designed for anyone who wants to commit to focused, distraction-free reading:

- **Deep Readers**: Eliminate distractions and lock in on the text
- **Students**: Focus completely on course materials without wandering eyes
- **Professionals**: Process documents with full attention, one word at a time
- **Knowledge Seekers**: Commit to reading without the temptation to skim or jump around
- **Anyone Experiencing Reading Fatigue**: Reduce eye strain from constant page scanning

**Perfect for:**
- Reading when you want to commit and focus completely
- Reducing eye strain from traditional page-based reading
- Eliminating the distraction of seeing entire paragraphs at once
- Training yourself to stay present with each word
- Sessions where you want to lock in without interruption

### Development Approach

FastReader was built using a unique **autonomous AI-driven development workflow** called **Ralph Wiggum**, which emphasizes:

- **Scientific rigor**: Features grounded in cognitive psychology research
- **User-focused design**: Clean, distraction-free interface with minimal UI
- **Comprehensive testing**: 594+ tests ensuring reliability and correctness
- **Iterative refinement**: Continuous improvement through user testing and feedback

The entire codebase was developed using Claude Code with systematic planning, implementation, and validation phases documented in `IMPLEMENTATION_PLAN.md`. This approach enabled rapid development while maintaining high code quality and comprehensive test coverage.

---

FastReader is a focused, distraction-free reading application that uses RSVP (Rapid Serial Visual Presentation) combined with OVP (Optimal Viewing Position) highlighting to help you lock in and commit to reading one word at a time.

## Features

### Core Reading Experience
- **RSVP Display**: Words appear one at a time at a fixed position—no page jumping, just focus
- **OVP Highlighting**: Red highlighting marks the optimal focal point within each word, reducing eye strain
- **Adjustable Pace**: Set your reading pace from 50 to 350 WPM to match your natural rhythm
- **Multiple File Formats**: Upload and read TXT, PDF, EPUB, and DOCX files
- **Progress Tracking**: Visual progress bar and word counter show your position

### Controls & Navigation
- **Playback Controls**: Play, pause, previous word, next word
- **Pace Adjustment**: Slider and numeric input with 25 WPM increments
- **Progress Bar**: Click anywhere to jump to that position in the document
- **Keyboard Shortcuts**: Complete keyboard control for hands-free, distraction-free reading

### Position Persistence
- **Auto-Save**: Reading position automatically saves every 5 seconds during playback
- **Session Persistence**: Positions persist across browser sessions
- **Multi-Document Support**: Tracks up to 50 documents with automatic cleanup after 30 days
- **Smart Resume**: Reopening a document automatically resumes from your last position

## Keyboard Shortcuts

Control FastReader without touching your mouse—keep your hands in position and stay focused:

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

2. **Adjust Your Pace**
   - Use the slider or numeric input to set your reading pace (50-350 WPM)
   - Start with 200-250 WPM and adjust to match your natural reading rhythm
   - Find the pace where you can focus on each word without distraction

3. **Lock In**
   - Press Play (or Space bar) to begin your focused reading session
   - Words will appear one at a time with the optimal viewing position highlighted in red
   - Your eyes stay fixed on the center—no jumping, no wandering, just focus
   - Use Left/Right arrows to navigate, Up/Down to adjust pace

4. **Take Breaks**
   - Press Pause (or Space bar) to stop
   - Your position is automatically saved
   - Click progress bar to jump to any section

5. **Resume Later**
   - Close the document or browser tab
   - Reopen the same file later to resume from where you left off

## The Technology

### RSVP (Rapid Serial Visual Presentation)
FastReader uses RSVP technology to eliminate the need for your eyes to jump around the page. Words appear one at a time at a fixed position, letting you focus entirely on the current word without the distraction of surrounding text or the strain of constant eye movement.

### OVP (Optimal Viewing Position)
Research shows that readers recognize words most efficiently when focusing on a position approximately 30-35% into the word. FastReader highlights this position in red, providing a consistent focal point that reduces eye strain and helps maintain concentration throughout your reading session.

### Benefits of Fixed-Position Reading
- **Reduced Eye Strain**: No constant scanning or refocusing
- **Increased Focus**: Only one word visible at a time eliminates distractions
- **Consistent Pace**: Set your rhythm and maintain it without effort
- **Better Concentration**: Your brain can focus on comprehension rather than navigation

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

This project is built for educational purposes to demonstrate modern web development with React, TypeScript, and focused user experiences.

## Credits

Based on scientific research in RSVP technology and cognitive psychology. OVP calculation methodology derived from research on optimal word recognition positions and focused reading techniques.

---

**Version**: 1.0.0 (Phase 5 - Production Ready)
**Last Updated**: January 2026
