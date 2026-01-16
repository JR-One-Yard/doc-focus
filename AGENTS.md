# Operational Guide: FastReader Speed Reading App

## Project Overview

FastReader is a speed reading web application built with React + TypeScript + Vite. It uses RSVP (Rapid Serial Visual Presentation) combined with OVP (Optimal Viewing Position) highlighting to help users read faster while maintaining comprehension.

**Technology Stack:**
- React 18 + TypeScript (strict mode)
- Vite (build tool)
- Vitest + React Testing Library (testing)
- PWA capabilities

## Build & Run

**Install dependencies:**
```bash
npm install
```

**Development server:**
```bash
npm run dev
# Opens at http://localhost:5173
```

**Build for production:**
```bash
npm run build
# Output in dist/
```

**Preview production build:**
```bash
npm run preview
```

## Validation

Run these after implementing to get immediate feedback:

**Tests:**
```bash
npm test
# Or watch mode:
npm run test:watch
```

**TypeScript check:**
```bash
npm run typecheck
# Or: npx tsc --noEmit
```

**Lint:**
```bash
npm run lint
```

**All checks (tests + typecheck + lint):**
```bash
npm run validate
```

## Operational Notes

### File Parsing Libraries

- **PDF:** Use pdf.js (Mozilla's library)
- **EPUB:** Use epub.js
- **DOCX:** Use mammoth or docx-preview
- **TXT:** Native file reading, UTF-8 encoding

### OVP Calculation

Optimal Viewing Position is ~30-35% into word from start. See `src/lib/ovp-calculator.ts` for implementation based on PROJECT-STATUS.md research.

### Speed Limits

**CRITICAL:** Maximum speed is 350 WPM. Scientific research shows comprehension degrades significantly above this. Always warn users when selecting >350 WPM.

### Codebase Patterns

- **Shared utilities:** `src/lib/` (discoverable by Ralph)
- **Components:** `src/components/`
- **Hooks:** `src/hooks/`
- **Types:** `src/types/`
- **Parsers:** `src/parsers/` (file format parsers: TXT, PDF, EPUB, DOCX)
- **Utils:** `src/utils/` (validators, formatters)
- **Tests:** Co-located with files as `*.test.ts` or `*.test.tsx`

### TypeScript Configuration

**IMPORTANT:** Project uses strict TypeScript with `verbatimModuleSyntax` enabled.

**Common TypeScript Issues:**

1. **Type-only imports:** Must use `import type { }` syntax
   ```typescript
   // ✅ Correct
   import type { AppState, ParsedDocument } from './types';

   // ❌ Wrong (causes build error)
   import { AppState, ParsedDocument } from './types';
   ```

2. **React imports:** Remove unused React imports in TSX files
   ```typescript
   // ✅ Correct (React 18+)
   // No React import needed for JSX

   // ❌ Wrong (unless using React directly)
   import React from 'react';
   ```

3. **State types:** Avoid literal types for useState
   ```typescript
   // ✅ Correct
   const [wpm, setWpm] = useState<number>(250);

   // ❌ Wrong (creates literal type '250')
   const [wpm, setWpm] = useState(250);
   ```

4. **Test globals:** Use proper type declarations for test environment
   ```typescript
   // ✅ Correct
   /// <reference types="vitest/globals" />
   ```

**Before committing:** ALWAYS run `npm run build` to catch TypeScript errors

### Storage

- LocalStorage for user preferences and reading positions
- IndexedDB for document storage (if needed)

---

**Keep this file brief and operational.** Status updates belong in IMPLEMENTATION_PLAN.md.
