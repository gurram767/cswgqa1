import { Logger } from './logger';

const logger = new Logger('RetryHelper');

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  /** Multiplier applied to delay after each failed attempt (exponential backoff). */
  backoffFactor?: number;
  description?: string;
}

/**
 * Retry an async action until it succeeds or attempts are exhausted.
 * Use for inherently flaky, non-deterministic operations (network blips,
 * eventual-consistency reads) — NOT as a band-aid for real product bugs.
 */
export async function retry<T>(action: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { retries = 3, delayMs = 500, backoffFactor = 2, description = 'action' } = options;

  let lastError: unknown;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      logger.warn(`Attempt ${attempt}/${retries} for "${description}" failed`, {
        error: error instanceof Error ? error.message : String(error),
      });
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= backoffFactor;
      }
    }
  }

  throw new Error(
    `"${description}" failed after ${retries} attempts. Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}
