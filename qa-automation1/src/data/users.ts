import { UserCredentials, UserRole } from '../types';

/**
 * Role-based credential registry.
 *
 * Secrets are NEVER hard-coded. Values are pulled from environment variables
 * (provided via gitignored .env.local locally, or via CI/CD secrets).
 */
const registry: Record<UserRole, UserCredentials> = {
  admin: {
    username: process.env.ADMIN_USERNAME ?? '',
    password: process.env.ADMIN_PASSWORD ?? '',
    role: 'admin',
    description: 'Primary administrator account',
  },
  store: {
    username: process.env.STORE_USERNAME ?? '',
    password: process.env.STORE_PASSWORD ?? '',
    role: 'store',
    description: 'External store user',
  },
  guest: {
    username: process.env.GUEST_USERNAME ?? 'invalid_user',
    password: process.env.GUEST_PASSWORD ?? 'invalid_password',
    role: 'guest',
    description: 'Unauthenticated / negative-test user',
  },
};

export function getUser(role: UserRole): UserCredentials {
  const user = registry[role];
  if (role !== 'guest' && (!user.username || !user.password)) {
    throw new Error(
      `Missing credentials for role "${role}". Set ${role.toUpperCase()}_USERNAME / ` +
        `${role.toUpperCase()}_PASSWORD via .env.local or CI secrets.`,
    );
  }
  return user;
}

export const Users = {
  admin: () => getUser('admin'),
  store: () => getUser('store'),
  guest: () => getUser('guest'),
};
