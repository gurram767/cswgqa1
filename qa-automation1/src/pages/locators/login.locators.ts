import { LocatorStrategy } from '../../types';

/**
 * Centralized selectors for the Login page.
 *
 * All selectors for a page live in ONE file. If the UI changes, you fix the
 * selector here once — not in every test. Each element lists a main selector
 * plus backups (used by the self-healing locator if the main one breaks).
 */
export const LoginLocators: Record<string, LocatorStrategy> = {
  usernameInput: {
    name: 'Username input',
    selectors: ['input[placeholder="Enter User Name"]', '#username', 'input[name="username"]'],
  },
  passwordInput: {
    name: 'Password input',
    selectors: ['input[placeholder="Enter Password"]', '#password', 'input[type="password"]'],
  },
  loginButton: {
    name: 'Login button',
    selectors: ['button:has-text("Login")', 'button[type="submit"]', '#loginBtn'],
  },
  rememberMe: {
    name: 'Remember me checkbox',
    selectors: ['input[type="checkbox"]', 'label:has-text("Remember me") input'],
  },
  forgotPassword: {
    name: 'Forgot password link',
    selectors: ['text=Forgot Password?', 'a:has-text("Forgot Password")'],
  },
  errorMessage: {
    name: 'Error message',
    selectors: ['.error-message', '.alert-danger', '[role="alert"]'],
  },
};
