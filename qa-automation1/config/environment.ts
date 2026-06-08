import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

/**
 * Centralized, type-safe environment configuration.
 *
 * Resolution order (later overrides earlier):
 *   1. config/env/.env.<TEST_ENV>   (committed, non-secret defaults)
 *   2. config/env/.env.local        (gitignored, local secrets/overrides)
 *   3. process.env                  (CI/CD secrets, shell exports)
 *
 * Usage:  TEST_ENV=prod npx playwright test
 */
export type EnvName = 'qa' | 'prod';

const TEST_ENV = (process.env.TEST_ENV as EnvName) || 'qa';

function loadEnvFile(file: string): void {
  const fullPath = path.resolve(__dirname, 'env', file);
  if (fs.existsSync(fullPath)) {
    // `override: false` keeps already-set process.env (e.g. CI secrets) authoritative.
    dotenv.config({ path: fullPath, override: false });
  }
}

// Load local secrets first so they win over committed defaults, but still
// allow real process.env (CI) to win over everything.
loadEnvFile('.env.local');
loadEnvFile(`.env.${TEST_ENV}`);

function str(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

function num(key: string, fallback: number): number {
  const value = process.env[key];
  const parsed = value === undefined ? NaN : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function bool(key: string, fallback: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
}

const isCI = !!process.env.CI;

export interface AppEnvironment {
  name: EnvName;
  isCI: boolean;
  baseURL: string;
  headless: boolean;
  workers: number;
  retries: number;
  testTimeout: number;
  expectTimeout: number;
  actionTimeout: number;
  navigationTimeout: number;
  logLevel: string;
}

export const env: AppEnvironment = {
  name: TEST_ENV,
  isCI,
  baseURL: str('BASE_URL', 'https://qacsconnect.cswg.com'),
  headless: bool('HEADLESS', true),
  workers: num('WORKERS', isCI ? 2 : 4),
  retries: num('RETRIES', isCI ? 2 : 0),
  testTimeout: num('TEST_TIMEOUT', 60_000),
  expectTimeout: num('EXPECT_TIMEOUT', 10_000),
  actionTimeout: num('ACTION_TIMEOUT', 15_000),
  navigationTimeout: num('NAVIGATION_TIMEOUT', 30_000),
  logLevel: str('LOG_LEVEL', 'info'),
};
