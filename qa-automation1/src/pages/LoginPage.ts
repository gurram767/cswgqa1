import { Page } from '@playwright/test';
import { BasePage } from '../core/BasePage';
import { Routes } from '../../config/endpoints';
import { LoginLocators } from './locators/login.locators';
import { UserCredentials } from '../types';

/**
 * Login Page Object.
 *
 * A "Page Object" groups everything about one screen: how to open it, the
 * elements on it, and the actions you can do (type username, click login...).
 * Tests use these methods instead of touching selectors directly, so tests
 * stay short and readable.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Open the login page. */
  async open(): Promise<void> {
    await this.goto(Routes.login);
    await this.waitUntilLoaded();
  }

  async enterUsername(username: string): Promise<void> {
    const field = await this.heal.resolve(LoginLocators.usernameInput);
    await this.fill(field, username);
  }

  async enterPassword(password: string): Promise<void> {
    const field = await this.heal.resolve(LoginLocators.passwordInput);
    await this.fill(field, password);
  }

  async clickLogin(): Promise<void> {
    const button = await this.heal.resolve(LoginLocators.loginButton);
    await this.click(button);
  }

  /** The whole login flow in one call. Credentials are never logged. */
  async login(user: UserCredentials): Promise<void> {
    this.log.step(`Logging in as "${user.role}"`);
    await this.enterUsername(user.username);
    await this.enterPassword(user.password);
    await this.clickLogin();
  }

  /** Returns the error text shown after a failed login (empty if none). */
  async getErrorMessage(): Promise<string> {
    const error = await this.heal.resolve(LoginLocators.errorMessage);
    if (await this.isVisible(error)) {
      return this.getText(error);
    }
    return '';
  }

  /** True when the login button is on screen (page loaded correctly). */
  async isLoaded(): Promise<boolean> {
    const button = await this.heal.resolve(LoginLocators.loginButton);
    return this.isVisible(button);
  }
}
