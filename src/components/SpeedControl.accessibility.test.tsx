/**
 * Accessibility Tests for SpeedControl Component
 *
 * Tests speed control accessibility including range slider,
 * numeric input, labels, and keyboard navigation.
 */

import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SpeedControl } from './SpeedControl';
import { expectNoA11yViolations, axeRulePresets } from '../test-utils/accessibility';

describe('SpeedControl Accessibility', () => {
  const mockOnSpeedChange = vi.fn();

  it('should have no accessibility violations', async () => {
    const result = render(
      <SpeedControl speed={200} onSpeedChange={mockOnSpeedChange} />
    );

    await expectNoA11yViolations(result);
  });

  it('should have proper labels for all inputs', async () => {
    const result = render(
      <SpeedControl speed={250} onSpeedChange={mockOnSpeedChange} />
    );

    // Test form/label rules
    await expectNoA11yViolations(result, axeRulePresets.forms);
  });

  it('should have proper ARIA attributes for range slider', async () => {
    const result = render(
      <SpeedControl speed={300} onSpeedChange={mockOnSpeedChange} />
    );

    // Test ARIA rules
    await expectNoA11yViolations(result, axeRulePresets.aria);
  });

  it('should be keyboard accessible', async () => {
    const result = render(
      <SpeedControl speed={150} onSpeedChange={mockOnSpeedChange} />
    );

    // Test keyboard rules
    await expectNoA11yViolations(result, axeRulePresets.keyboard);
  });

  it('should meet color contrast requirements', async () => {
    const result = render(
      <SpeedControl speed={275} onSpeedChange={mockOnSpeedChange} />
    );

    await expectNoA11yViolations(result, axeRulePresets.colorContrast);
  });

  it('should be accessible at different speed values', async () => {
    // Test at minimum speed
    let result = render(
      <SpeedControl speed={50} onSpeedChange={mockOnSpeedChange} />
    );
    await expectNoA11yViolations(result);
    result.unmount();

    // Test at maximum speed
    result = render(
      <SpeedControl speed={350} onSpeedChange={mockOnSpeedChange} />
    );
    await expectNoA11yViolations(result);
  });
});
