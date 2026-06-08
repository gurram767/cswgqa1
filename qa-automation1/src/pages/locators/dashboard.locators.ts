import { LocatorStrategy } from '../../types';

/** Centralized selectors for the Dashboard page (shown after a successful login). */
export const DashboardLocators: Record<string, LocatorStrategy> = {
  header: {
    name: 'Dashboard header',
    selectors: ['header', '.dashboard-header', '[data-testid="dashboard-header"]'],
  },
  userMenu: {
    name: 'User menu',
    selectors: ['.user-menu', '[data-testid="user-menu"]', 'button:has-text("Account")'],
  },
  logoutButton: {
    name: 'Logout button',
    selectors: ['text=Logout', 'button:has-text("Logout")', 'a:has-text("Sign out")'],
  },
};
