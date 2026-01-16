/**
 * Accessibility Tests for RSVPDisplay Component
 *
 * Tests WCAG compliance for the RSVP word display with live regions
 * for screen reader announcements.
 */

import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { RSVPDisplay } from './RSVPDisplay';
import { expectNoA11yViolations, axeRulePresets } from '../test-utils/accessibility';

describe('RSVPDisplay Accessibility', () => {
  const mockWords = ['The', 'quick', 'brown', 'fox', 'jumps'];

  it('should have no accessibility violations', async () => {
    const result = render(
      <RSVPDisplay
        word={mockWords[0]}
        currentIndex={0}
        totalWords={mockWords.length}
      />
    );

    await expectNoA11yViolations(result);
  });

  it('should have proper ARIA live region for screen readers', async () => {
    const result = render(
      <RSVPDisplay
        word={mockWords[2]}
        currentIndex={2}
        totalWords={mockWords.length}
      />
    );

    // Verify no violations including ARIA rules
    await expectNoA11yViolations(result, axeRulePresets.aria);
  });

  it('should meet color contrast requirements for OVP highlighting', async () => {
    const result = render(
      <RSVPDisplay
        word={mockWords[1]}
        currentIndex={1}
        totalWords={mockWords.length}
      />
    );

    // Test color contrast specifically (OVP red on dark background)
    await expectNoA11yViolations(result, axeRulePresets.colorContrast);
  });

  it('should be accessible at different word positions', async () => {
    // Test at beginning
    let result = render(
      <RSVPDisplay
        word={mockWords[0]}
        currentIndex={0}
        totalWords={mockWords.length}
      />
    );
    await expectNoA11yViolations(result);
    result.unmount();

    // Test at end
    result = render(
      <RSVPDisplay
        word={mockWords[mockWords.length - 1]}
        currentIndex={mockWords.length - 1}
        totalWords={mockWords.length}
      />
    );
    await expectNoA11yViolations(result);
  });
});
