/**
 * Setup file for axe-core accessibility testing
 *
 * This file extends Vitest's expect with jest-axe matchers
 */

import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Declare the custom matcher types for TypeScript
declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
