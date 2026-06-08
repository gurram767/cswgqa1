/**
 * Shared types used across the framework.
 * Keeping them in one place means everyone uses the same shape for data.
 */

/** The kinds of users our tests can log in as. */
export type UserRole = 'admin' | 'store' | 'guest';

/** A single login account. */
export interface UserCredentials {
  username: string;
  password: string;
  role: UserRole;
  description?: string;
}

/**
 * A "self-healing" locator: a friendly name plus a list of selectors to try
 * in order. The first selector that finds the element on the page wins.
 * If the first one breaks after a UI change, the next one is used as a backup.
 */
export interface LocatorStrategy {
  name: string;
  /** CSS or XPath selectors, tried top to bottom. Prefix XPath with "xpath=". */
  selectors: string[];
}
