/**
 * Integration Test for FastReader - Full User Flow
 *
 * Tests the actual end-to-end flow that a user would experience.
 * This test was missing from the test suite, which is why 621 tests
 * could pass while the app was broken.
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Integration - Document Loading Flow', () => {
  it('should load a document via text input and show reading screen', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Step 1: Find the text input area
    const textarea = screen.getByRole('textbox', { name: /text input area/i });
    expect(textarea).toBeInTheDocument();

    // Step 2: Paste some text
    const testText = 'Hello world this is a speed reading test';
    await user.clear(textarea);
    await user.type(textarea, testText);

    // Step 3: Click "Start Reading" button
    const startButton = screen.getByRole('button', { name: /start reading/i });
    await user.click(startButton);

    // Step 4: Verify reading screen appears
    await waitFor(() => {
      const rsvpDisplay = screen.getByTestId('rsvp-display');
      expect(rsvpDisplay).toBeInTheDocument();
      expect(rsvpDisplay).toBeVisible(); // THIS IS THE KEY TEST
    });

    // Step 5: Verify word is displayed
    await waitFor(() => {
      const wordDisplay = screen.getByTestId('word-display');
      expect(wordDisplay).toBeInTheDocument();
      expect(wordDisplay).toBeVisible();
      expect(wordDisplay).toHaveTextContent(/\w+/); // Should have at least one word
    });

    // Step 6: Verify controls are present
    const playButton = screen.getByRole('button', { name: /play reading/i });
    expect(playButton).toBeInTheDocument();
    expect(playButton).toBeVisible();
  });

  it('should show the actual first word of the document', async () => {
    const user = userEvent.setup();
    render(<App />);

    const textarea = screen.getByRole('textbox', { name: /text input area/i });
    const testText = 'FastReader Speed Test Document';
    await user.clear(textarea);
    await user.type(textarea, testText);

    const startButton = screen.getByRole('button', { name: /start reading/i });
    await user.click(startButton);

    await waitFor(() => {
      const wordDisplay = screen.getByTestId('word-display');
      expect(wordDisplay).toHaveTextContent('FastReader');
    });
  });
});

describe('App Integration - Reading Screen Layout', () => {
  it('should have RSVP display visible and not hidden by controls', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Load a document
    const textarea = screen.getByRole('textbox', { name: /text input area/i });
    await user.clear(textarea);
    await user.type(textarea, 'Test document words here');

    const startButton = screen.getByRole('button', { name: /start reading/i });
    await user.click(startButton);

    // Check layout
    await waitFor(() => {
      const rsvpDisplay = screen.getByTestId('rsvp-display');
      const wordDisplay = screen.getByTestId('word-display');

      // Get computed styles
      const rsvpStyles = window.getComputedStyle(rsvpDisplay);
      const wordStyles = window.getComputedStyle(wordDisplay);

      // RSVP display should take up space (not 0 height)
      expect(rsvpDisplay).toBeVisible();
      expect(rsvpStyles.flex).toBe('1'); // Should use flex: 1

      // Word should be visible (not opacity: 0 or display: none)
      expect(wordDisplay).toBeVisible();
      expect(wordStyles.opacity).not.toBe('0');
    });
  });
});
