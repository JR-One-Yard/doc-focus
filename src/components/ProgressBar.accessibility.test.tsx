/**
 * Accessibility Tests for ProgressBar Component
 *
 * Tests progress bar accessibility including ARIA progressbar role,
 * keyboard navigation, and clickable functionality.
 */

import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';
import { expectNoA11yViolations, axeRulePresets } from '../test-utils/accessibility';

describe('ProgressBar Accessibility', () => {
  const mockOnJumpToPosition = vi.fn();

  it('should have no accessibility violations', async () => {
    const result = render(
      <ProgressBar
        currentIndex={50}
        totalWords={100}
        onJumpToPosition={mockOnJumpToPosition}
      />
    );

    await expectNoA11yViolations(result);
  });

  it('should have proper ARIA progressbar attributes', async () => {
    const result = render(
      <ProgressBar
        currentIndex={25}
        totalWords={200}
        onJumpToPosition={mockOnJumpToPosition}
      />
    );

    // Test ARIA rules
    await expectNoA11yViolations(result, axeRulePresets.aria);
  });

  it('should be keyboard accessible', async () => {
    const result = render(
      <ProgressBar
        currentIndex={10}
        totalWords={50}
        onJumpToPosition={mockOnJumpToPosition}
      />
    );

    // Test keyboard rules
    await expectNoA11yViolations(result, axeRulePresets.keyboard);
  });

  it('should have no violations when disabled', async () => {
    const result = render(
      <ProgressBar
        currentIndex={0}
        totalWords={100}
        onJumpToPosition={mockOnJumpToPosition}
        disabled={true}
      />
    );

    await expectNoA11yViolations(result);
  });

  it('should meet color contrast requirements', async () => {
    const result = render(
      <ProgressBar
        currentIndex={75}
        totalWords={100}
        onJumpToPosition={mockOnJumpToPosition}
      />
    );

    await expectNoA11yViolations(result, axeRulePresets.colorContrast);
  });

  it('should be accessible at different progress levels', async () => {
    // Test at 0%
    let result = render(
      <ProgressBar
        currentIndex={0}
        totalWords={100}
        onJumpToPosition={mockOnJumpToPosition}
      />
    );
    await expectNoA11yViolations(result);
    result.unmount();

    // Test at 100%
    result = render(
      <ProgressBar
        currentIndex={99}
        totalWords={100}
        onJumpToPosition={mockOnJumpToPosition}
      />
    );
    await expectNoA11yViolations(result);
  });
});
