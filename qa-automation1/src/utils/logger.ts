import { env } from '../../config/environment';

/**
 * A tiny, dependency-free logger.
 *
 * Why not just use console.log everywhere?
 *  - It prints a timestamp + level + context, so logs are easy to read.
 *  - It respects LOG_LEVEL (error < warn < info < debug), so you can make
 *    runs quieter or more verbose without changing code.
 *
 * How to use:
 *   const log = new Logger('LoginPage');
 *   log.info('Logging in', { user: 'admin' });
 */

// Each level has a number. We only print messages at or below the configured level.
const LEVELS: Record<string, number> = { error: 0, warn: 1, info: 2, debug: 3 };

export class Logger {
  constructor(private readonly context: string) {}

  /** Hide a secret value in logs, e.g. mask('Password1') -> 'P***'. */
  static mask(value?: string): string {
    if (!value) return '***';
    return `${value.slice(0, 1)}***`;
  }

  private write(level: keyof typeof LEVELS, message: string, meta?: Record<string, unknown>): void {
    const allowed = LEVELS[env.logLevel] ?? LEVELS.info;
    if (LEVELS[level] > allowed) return; // skip messages above the configured level

    const time = new Date().toISOString();
    const extra = meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const line = `${time} [${level.toUpperCase()}] [${this.context}] ${message}${extra}`;

    // eslint-disable-next-line no-console
    console.log(line);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.write('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.write('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.write('error', message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.write('debug', message, meta);
  }

  /** Log a human-friendly test step. */
  step(message: string): void {
    this.write('info', `> ${message}`);
  }
}
