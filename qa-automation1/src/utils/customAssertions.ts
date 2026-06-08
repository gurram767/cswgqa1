import { expect as baseExpect, Locator } from '@playwright/test';

/**
 * Custom matchers that extend Playwright's `expect`.
 * Import { expect } from this module instead of '@playwright/test'
 * to get both built-in and custom assertions.
 */
export const expect = baseExpect.extend({
  /** Asserts an element is visible AND enabled (ready for interaction). */
  async toBeReady(locator: Locator) {
    const assertionName = 'toBeReady';
    let pass = true;
    let detail = '';
    try {
      await baseExpect(locator).toBeVisible();
      await baseExpect(locator).toBeEnabled();
    } catch (e) {
      pass = false;
      detail = e instanceof Error ? e.message : String(e);
    }
    return {
      name: assertionName,
      pass,
      message: () => (pass ? 'Element is ready' : `Element is not ready:\n${detail}`),
    };
  },
});
