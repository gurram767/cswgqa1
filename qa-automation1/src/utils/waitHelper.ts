import { Page, Locator, expect } from '@playwright/test';
import { env } from '../../config/environment';

/**
 * Explicit, intention-revealing wait helpers.
 * Prefer Playwright's auto-waiting; use these only for conditions the
 * built-in actionability checks do not cover.
 */
export class WaitHelper {
  constructor(private readonly page: Page) {}

  async forVisible(locator: Locator, timeout = env.actionTimeout): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  async forHidden(locator: Locator, timeout = env.actionTimeout): Promise<void> {
    await expect(locator).toBeHidden({ timeout });
  }

  async forEnabled(locator: Locator, timeout = env.actionTimeout): Promise<void> {
    await expect(locator).toBeEnabled({ timeout });
  }

  async forNetworkIdle(timeout = env.navigationTimeout): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async forUrl(urlPart: string | RegExp, timeout = env.navigationTimeout): Promise<void> {
    await this.page.waitForURL(
      typeof urlPart === 'string' ? new RegExp(escapeRegExp(urlPart)) : urlPart,
      { timeout },
    );
  }

  /** Poll a predicate until it returns true or the timeout elapses. */
  async forCondition(
    predicate: () => Promise<boolean> | boolean,
    { timeout = env.actionTimeout, intervalMs = 250, message = 'condition' } = {},
  ): Promise<void> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await predicate()) return;
      await this.page.waitForTimeout(intervalMs);
    }
    throw new Error(`Timed out after ${timeout}ms waiting for ${message}`);
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
