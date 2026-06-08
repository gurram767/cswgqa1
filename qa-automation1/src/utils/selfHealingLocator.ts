import { Page, Locator } from '@playwright/test';
import { LocatorStrategy } from '../types';
import { Logger } from './logger';

const log = new Logger('SelfHealing');

/**
 * Self-healing locator (kept intentionally simple).
 *
 * Idea: instead of one selector that can break, we give the element a list of
 * selectors. We try them in order and return the FIRST one that exists on the
 * page. If a backup is used, we log a warning so you know the main selector
 * needs fixing.
 *
 * Example strategy:
 *   { name: 'Login button', selectors: ['#login', 'button:has-text("Login")'] }
 */
export class SelfHealingLocator {
  constructor(private readonly page: Page) {}

  /** Return a working Locator for the given strategy. */
  async resolve(strategy: LocatorStrategy, timeoutMs = 1500): Promise<Locator> {
    for (let i = 0; i < strategy.selectors.length; i++) {
      const selector = strategy.selectors[i];
      const locator = this.page.locator(selector);

      if (await this.exists(locator, timeoutMs)) {
        if (i > 0) {
          log.warn(
            `"${strategy.name}": main selector failed, used backup #${i} ("${selector}"). ` +
              'Please update the main selector.',
          );
        }
        return locator;
      }
    }

    // None matched. Return the first one so the test fails with a clear message.
    log.error(`"${strategy.name}": no selector matched. Tried: ${strategy.selectors.join(', ')}`);
    return this.page.locator(strategy.selectors[0]);
  }

  /** True if at least one element for this locator is attached to the page. */
  private async exists(locator: Locator, timeoutMs: number): Promise<boolean> {
    try {
      await locator.first().waitFor({ state: 'attached', timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }
}
