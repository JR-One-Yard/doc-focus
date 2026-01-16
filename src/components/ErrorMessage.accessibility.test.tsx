/**
 * Accessibility Tests for ErrorMessage Component
 *
 * Tests error alert accessibility including role="alert",
 * ARIA live regions, and screen reader announcements.
 */

import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';
import { expectNoA11yViolations, axeRulePresets } from '../test-utils/accessibility';

describe('ErrorMessage Accessibility', () => {
  const mockOnRetry = vi.fn();

  it('should have no accessibility violations', async () => {
    const result = render(
      <ErrorMessage
        message="Test error message"
        onRetry={mockOnRetry}
      />
    );

    await expectNoA11yViolations(result);
  });

  it('should have proper alert role for screen readers', async () => {
    const result = render(
      <ErrorMessage
        message="File upload failed"
        onRetry={mockOnRetry}
      />
    );

    // Test ARIA rules including role="alert"
    await expectNoA11yViolations(result, axeRulePresets.aria);
  });

  it('should have accessible retry button', async () => {
    const result = render(
      <ErrorMessage
        message="Network error occurred"
        onRetry={mockOnRetry}
      />
    );

    // Test form/button rules
    await expectNoA11yViolations(result, axeRulePresets.forms);
  });

  it('should meet color contrast for error styling', async () => {
    const result = render(
      <ErrorMessage
        message="Invalid file format"
        onRetry={mockOnRetry}
      />
    );

    // Test color contrast (red error color on background)
    await expectNoA11yViolations(result, axeRulePresets.colorContrast);
  });

  it('should be accessible with long error messages', async () => {
    const longMessage =
      'This is a very long error message that contains detailed information ' +
      'about what went wrong and how the user might be able to fix it. ' +
      'It should still be accessible and readable by screen readers.';

    const result = render(
      <ErrorMessage message={longMessage} onRetry={mockOnRetry} />
    );

    await expectNoA11yViolations(result);
  });
});
