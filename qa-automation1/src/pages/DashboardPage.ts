import { Page } from '@playwright/test';
import { BasePage } from '../core/BasePage';
import { Routes } from '../../config/endpoints';
import { DashboardLocators } from './locators/dashboard.locators';

/** Dashboard Page Object — the landing page after a successful login. */
export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * True when the authenticated landing page is shown (a sign login worked).
   * After login the app redirects to the home page (#/home); some flows may use
   * #/dashboard, so we accept either.
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.wait.forUrl(/#\/(home|dashboard)/);
      return true;
    } catch {
      return false;
    }
  }

  async logout(): Promise<void> {
    this.log.step('Logging out');
    const button = await this.heal.resolve(DashboardLocators.logoutButton);
    await this.click(button);
  }

  /** Open the dashboard directly (used when already logged in). */
  async open(): Promise<void> {
    await this.goto(Routes.dashboard);
    await this.waitUntilLoaded();
  }
}
