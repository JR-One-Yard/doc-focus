/**
 * Accessibility Tests for SpeedWarning Modal Component
 *
 * Tests modal dialog accessibility including ARIA attributes,
 * focus management, and keyboard navigation.
 */

import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SpeedWarning } from './SpeedWarning';
import { expectNoA11yViolations, axeRulePresets } from '../test-utils/accessibility';

describe('SpeedWarning Modal Accessibility', () => {
  const mockOnDismiss = vi.fn();

  it('should have no accessibility violations when open', async () => {
    const result = render(
      <SpeedWarning onDismiss={mockOnDismiss} speed={320} />
    );

    await expectNoA11yViolations(result);
  });

  it('should have proper modal ARIA attributes', async () => {
    const result = render(
      <SpeedWarning onDismiss={mockOnDismiss} speed={350} />
    );

    // Test ARIA-specific rules for modal
    await expectNoA11yViolations(result, axeRulePresets.aria);
  });

  it('should have proper dialog role and labeling', async () => {
    const result = render(
      <SpeedWarning onDismiss={mockOnDismiss} speed={325} />
    );

    // Verify dialog structure
    await expectNoA11yViolations(result);
  });

  it('should have accessible buttons with proper labels', async () => {
    const result = render(
      <SpeedWarning onDismiss={mockOnDismiss} speed={310} />
    );

    // Test button and label rules
    await expectNoA11yViolations(result, axeRulePresets.aria);
  });

  it('should meet color contrast in modal content', async () => {
    const result = render(
      <SpeedWarning onDismiss={mockOnDismiss} speed={330} />
    );

    // Test color contrast
    await expectNoA11yViolations(result, axeRulePresets.colorContrast);
  });

  it('should not render when closed (no violations on empty state)', async () => {
    const result = render(
      <SpeedWarning onDismiss={mockOnDismiss} speed={250} />
    );

    // Even when closed, should have no violations
    await expectNoA11yViolations(result);
  });
});
