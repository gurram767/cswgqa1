import { Page, Locator } from '@playwright/test';
import { env } from '../../config/environment';
import { Logger } from '../utils/logger';
import { WaitHelper } from '../utils/waitHelper';
import { SelfHealingLocator } from '../utils/selfHealingLocator';

/**
 * BasePage = the shared parent for every Page Object.
 *
 * Every page in the app (LoginPage, DashboardPage, ...) extends this class,
 * so they all get the same helpers (navigate, click, type, waits, logging)
 * for free. This avoids copy-pasting the same code into every page.
 */
export abstract class BasePage {
  protected readonly wait: WaitHelper;
  protected readonly heal: SelfHealingLocator;
  protected readonly log: Logger;

  constructor(protected readonly page: Page) {
    this.wait = new WaitHelper(page);
    this.heal = new SelfHealingLocator(page);
    this.log = new Logger(this.constructor.name);
  }

  /** Open a path on the app, e.g. await this.goto('/customerportal/#/login'). */
  async goto(path: string): Promise<void> {
    this.log.step(`Navigating to ${path}`);
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /** Click an element (Playwright auto-waits for it to be clickable). */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /** Clear a field and type text into it. */
  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  /** Read the visible text of an element. */
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? '';
  }

  /** True if the element is visible on screen. */
  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  /** The current page title. */
  async title(): Promise<string> {
    return this.page.title();
  }

  /** The current URL. */
  url(): string {
    return this.page.url();
  }

  /** Wait until the page has finished loading network activity. */
  async waitUntilLoaded(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: env.navigationTimeout });
  }
}
