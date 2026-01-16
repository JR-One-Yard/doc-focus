/**
 * Accessibility Testing Utilities
 *
 * Helper functions for running axe-core accessibility tests in Vitest
 */

import { type RenderResult } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

// Extend Vitest's expect with jest-axe matchers
expect.extend(toHaveNoViolations);

/**
 * Run axe accessibility tests on a rendered component
 *
 * @param container - The container element from @testing-library/react render
 * @param options - Optional axe configuration options
 * @returns Promise - The results of the accessibility scan
 *
 * @example
 * const { container } = render(<MyComponent />);
 * const results = await runAxe(container);
 * expect(results).toHaveNoViolations();
 */
export async function runAxe(
  container: HTMLElement,
  options?: {
    rules?: Record<string, { enabled: boolean }>;
    runOnly?: { type: 'tag' | 'rule'; values: string[] } | string[];
  }
): Promise<any> {
  // Handle runOnly parameter - can be either an array or an object
  let runOnlyConfig;
  if (options?.runOnly) {
    if (Array.isArray(options.runOnly)) {
      runOnlyConfig = { type: 'tag' as const, values: options.runOnly };
    } else {
      runOnlyConfig = options.runOnly;
    }
  }

  const results = await axe(container, {
    rules: options?.rules,
    runOnly: runOnlyConfig,
  });

  return results;
}

/**
 * Run axe tests and expect no violations
 *
 * @param renderResult - The result from @testing-library/react render
 * @param options - Optional axe configuration options
 *
 * @example
 * const result = render(<MyComponent />);
 * await expectNoA11yViolations(result);
 */
export async function expectNoA11yViolations(
  renderResult: RenderResult,
  options?: {
    rules?: Record<string, { enabled: boolean }>;
    runOnly?: { type: 'tag' | 'rule'; values: string[] } | string[];
  }
): Promise<void> {
  const results = await runAxe(renderResult.container, options);
  expect(results).toHaveNoViolations();
}

/**
 * Common axe rule configurations for different scenarios
 */
export const axeRulePresets = {
  /** WCAG 2.0 Level A & AA rules */
  wcagAA: {
    runOnly: {
      type: 'tag' as const,
      values: ['wcag2a', 'wcag2aa'],
    },
  },

  /** WCAG 2.1 Level A & AA rules */
  wcag21AA: {
    runOnly: {
      type: 'tag' as const,
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
  },

  /** Best practices rules */
  bestPractices: {
    runOnly: {
      type: 'tag' as const,
      values: ['best-practice'],
    },
  },

  /** Color contrast specific rules */
  colorContrast: {
    runOnly: {
      type: 'rule' as const,
      values: ['color-contrast'],
    },
  },

  /** Keyboard navigation rules */
  keyboard: {
    runOnly: {
      type: 'tag' as const,
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
  },

  /** ARIA rules */
  aria: {
    runOnly: {
      type: 'tag' as const,
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
  },

  /** Form rules */
  forms: {
    runOnly: {
      type: 'tag' as const,
      values: ['wcag2a', 'wcag2aa'],
    },
  },

  /** All rules */
  all: undefined,
};

/**
 * Disable specific rules that may not apply to certain components
 *
 * @example
 * // Disable color-contrast checking for a specific test
 * await expectNoA11yViolations(result, {
 *   rules: disableRules(['color-contrast'])
 * });
 */
export function disableRules(ruleIds: string[]): Record<string, { enabled: boolean }> {
  return Object.fromEntries(ruleIds.map(id => [id, { enabled: false }]));
}
