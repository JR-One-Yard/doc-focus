# Accessibility Fixes - Implementation Guide

This document contains ready-to-implement code fixes for all identified accessibility issues.

---

## HIGH PRIORITY FIXES

### Fix 1: TextInput textarea aria-label (5 minutes)

**File:** `/Users/jamesroberts/Documents/Prospa/Speed Reader/fastreader/src/components/TextInput.tsx`

**Current Code (lines 63-70):**
```jsx
<textarea
  className="text-input-textarea"
  value={text}
  onChange={handleTextChange}
  placeholder="Paste your text here..."
  disabled={disabled}
  data-testid="text-input-textarea"
  rows={10}
/>
```

**Fixed Code:**
```jsx
<textarea
  className="text-input-textarea"
  value={text}
  onChange={handleTextChange}
  placeholder="Paste your text here..."
  disabled={disabled}
  data-testid="text-input-textarea"
  rows={10}
  aria-label="Text input area for pasting content to speed read"
/>
```

**Why:** Screen reader users need explicit labeling for the textarea purpose.

---

### Fix 2: Close Document button aria-label (5 minutes)

**File:** `/Users/jamesroberts/Documents/Prospa/Speed Reader/fastreader/src/App.tsx`

**Current Code (line 378-380):**
```jsx
<button onClick={handleCloseDocument} className="control-button close-button">
  Close Document
</button>
```

**Fixed Code:**
```jsx
<button 
  onClick={handleCloseDocument} 
  className="control-button close-button"
  aria-label="Close document and return to upload screen"
>
  Close Document
</button>
```

**Why:** More descriptive label helps all users understand the button's function.

---

### Fix 3: TextInput button focus state (5 minutes)

**File:** `/Users/jamesroberts/Documents/Prospa/Speed Reader/fastreader/src/components/TextInput.css`

**Current Code (lines 95-106):**
```css
.text-input-button:hover:not(:disabled) {
  opacity: 0.9;
}

.text-input-button:active:not(:disabled) {
  opacity: 0.8;
}

.text-input-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

**Fixed Code (add after disabled rule):**
```css
.text-input-button:hover:not(:disabled) {
  opacity: 0.9;
}

.text-input-button:active:not(:disabled) {
  opacity: 0.8;
}

.text-input-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.text-input-button:focus {
  outline: 2px solid var(--text-ovp);
  outline-offset: 2px;
}
```

**Why:** Keyboard users need visible focus indicator like all other buttons.

---

## MEDIUM PRIORITY FIXES

### Fix 4: TextInput label association (15 minutes)

**File:** `/Users/jamesroberts/Documents/Prospa/Speed Reader/fastreader/src/components/TextInput.tsx`

**Current Code (lines 54-71):**
```jsx
<div className="text-input" data-testid="text-input">
  <div className="text-input-header">
    <h2>Paste Your Text</h2>
    <p className="text-input-subtitle">
      Paste any text to start speed reading with RSVP
    </p>
  </div>

  <textarea
    className="text-input-textarea"
    value={text}
    onChange={handleTextChange}
    placeholder="Paste your text here..."
    disabled={disabled}
    data-testid="text-input-textarea"
    rows={10}
    aria-label="Text input area for pasting content to speed read"
  />
```

**Fixed Code:**
```jsx
<div className="text-input" data-testid="text-input">
  <div className="text-input-header">
    <h2 id="text-input-heading">Paste Your Text</h2>
    <p className="text-input-subtitle">
      Paste any text to start speed reading with RSVP
    </p>
  </div>

  <label htmlFor="text-input-textarea" className="sr-only">
    Text to speed read
  </label>
  <textarea
    id="text-input-textarea"
    className="text-input-textarea"
    value={text}
    onChange={handleTextChange}
    placeholder="Paste your text here..."
    disabled={disabled}
    data-testid="text-input-textarea"
    rows={10}
    aria-label="Text input area for pasting content to speed read"
    aria-describedby="text-input-heading"
  />
```

**Changes:**
1. Added `id="text-input-heading"` to h2
2. Added `<label>` with `htmlFor="text-input-textarea"`
3. Added `id="text-input-textarea"` to textarea
4. Added `aria-describedby="text-input-heading"` to textarea

**Why:** Better semantic HTML with proper label association.

**Note:** Make sure `.sr-only` class exists in CSS (it should, copied from LoadingSpinner.css)

---

### Fix 5: RSVPDisplay progress region (5 minutes)

**File:** `/Users/jamesroberts/Documents/Prospa/Speed Reader/fastreader/src/components/RSVPDisplay.tsx`

**Current Code (lines 41-44):**
```jsx
{/* Progress indicator - bottom of display */}
<div className="rsvp-progress" data-testid="rsvp-progress" aria-live="polite">
  Word {currentIndex + 1} of {totalWords}
</div>
```

**Fixed Code:**
```jsx
{/* Progress indicator - bottom of display */}
<div 
  className="rsvp-progress" 
  data-testid="rsvp-progress" 
  aria-live="polite"
  role="status"
  aria-label="Reading progress"
>
  Word {currentIndex + 1} of {totalWords}
</div>
```

**Why:** Explicit role and label clarify purpose for screen reader users.

---

### Fix 6: FileUpload keyboard discoverability (10 minutes)

**File:** `/Users/jamesroberts/Documents/Prospa/Speed Reader/fastreader/src/components/FileUpload.tsx`

**Current Code (lines 126-143):**
```jsx
{isDragActive ? (
  <>
    <div className="file-upload__icon" aria-hidden="true">
      📥
    </div>
    <p className="file-upload__text file-upload__text--primary">
      Drop your file here
    </p>
  </>
) : (
  <>
    <div className="file-upload__icon" aria-hidden="true">
      📄
    </div>
    <p className="file-upload__text file-upload__text--primary">
      Drag & drop a file here
    </p>
    <p className="file-upload__text file-upload__text--secondary">
      or click to browse
    </p>
```

**Fixed Code:**
```jsx
{isDragActive ? (
  <>
    <div className="file-upload__icon" aria-hidden="true">
      📥
    </div>
    <p className="file-upload__text file-upload__text--primary">
      Drop your file here
    </p>
  </>
) : (
  <>
    <div className="file-upload__icon" aria-hidden="true">
      📄
    </div>
    <p className="file-upload__text file-upload__text--primary">
      Drag & drop a file here
    </p>
    <p className="file-upload__text file-upload__text--secondary">
      or click to browse
    </p>
    <p className="file-upload__text file-upload__text--keyboard sr-only">
      You can also press Enter to open file browser
    </p>
```

**CSS Addition (FileUpload.css at end):**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Why:** Keyboard users need to know they can activate the file browser with Enter key.

---

## LOW PRIORITY FIXES

### Fix 7: Add skip link (15 minutes)

**File:** `/Users/jamesroberts/Documents/Prospa/Speed Reader/fastreader/src/App.tsx`

**Current Code (line 251-252):**
```jsx
return (
  <div className="app">
    {/* Loading State - shown during file parsing */}
```

**Fixed Code:**
```jsx
return (
  <div className="app">
    {/* Skip link for keyboard navigation */}
    <a href="#main-content" className="sr-only sr-only-focusable">
      Skip to main content
    </a>
    
    {/* Loading State - shown during file parsing */}
```

**Update App.tsx line 261:**
```jsx
// BEFORE
<main>

// AFTER
<main id="main-content">
```

**CSS Addition (App.css at end):**
```css
/* Screen reader only, but visible on focus */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
  background-color: var(--ui-hover);
  color: var(--text-primary);
  padding: var(--spacing-sm);
  border: 2px solid var(--text-ovp);
  z-index: 1000;
}
```

**Why:** Allows keyboard power users to skip repetitive content on repeat visits.

---

### Fix 8: ProgressBar documentation (5 minutes)

**File:** `/Users/jamesroberts/Documents/Prospa/Speed Reader/fastreader/src/components/ProgressBar.tsx`

**Current Code (line 100-102):**
```jsx
title={`Click to jump to position (${Math.round(progressPercentage)}% complete)`}
```

**Fixed Code:**
```jsx
title={`Click to jump to position, or use arrow keys. ${Math.round(progressPercentage)}% complete`}
```

**Why:** Better tooltip explains keyboard navigation.

---

### Fix 9: Add main element ID for landmarks (5 minutes)

Already included in Fix 7 above (line 261 of App.tsx).

---

## TESTING CHECKLIST

After implementing fixes, verify:

- [ ] Run `npm test` - all tests pass
- [ ] Test with keyboard only (Tab, arrow keys, Enter, Escape)
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
  - [ ] TextInput textarea labeled correctly
  - [ ] Close button announces properly
  - [ ] Progress region updates announced
  - [ ] Skip link appears and works
- [ ] Test button focus indicators
  - [ ] TextInput button shows outline on focus
  - [ ] All buttons have consistent focus styling
- [ ] Test high contrast mode (Windows)
- [ ] Test reduced motion (disable animations in OS settings)
- [ ] Test mobile/touch (48px targets visible)

---

## Implementation Order

1. **Fix 1-3** (HIGH priority) - 15 minutes total
   - Immediate improvements for screen reader users
   - Simple text additions

2. **Fix 4-6** (MEDIUM priority) - 30 minutes total
   - More comprehensive improvements
   - Better semantic HTML

3. **Fix 7-9** (LOW priority) - 25 minutes total
   - Nice-to-have enhancements
   - Power user features

**Total Time: ~70 minutes for all fixes**

---

## Questions?

Refer to the comprehensive ACCESSIBILITY_REVIEW.md for detailed explanations of each issue and why it matters.
