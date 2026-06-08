import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getUser } from '../data/users';
import { UserRole } from '../types';
import { Logger } from './logger';

const log = new Logger('AuthHelper');

/**
 * Authentication helper.
 *
 * One simple function to log in as a given role through the UI. Tests that
 * just need "be logged in as admin" call loginAs(page, 'admin') and move on.
 */
export async function loginAs(page: Page, role: UserRole): Promise<void> {
  const user = getUser(role);
  log.step(`Setting up session for role "${role}"`);
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(user);
}
