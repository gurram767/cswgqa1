import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

const logger = new Logger('DataReader');

/**
 * Centralized test-data loader. Resolves files relative to src/data
 * and parses JSON with helpful errors. Extend with CSV/Excel readers as needed.
 */
export class DataReader {
  private static readonly dataRoot = path.resolve(__dirname, '..', 'data');

  static readJSON<T>(relativePath: string): T {
    const absolute = path.resolve(DataReader.dataRoot, relativePath);
    if (!fs.existsSync(absolute)) {
      throw new Error(`[DataReader] Data file not found: ${absolute}`);
    }
    try {
      const raw = fs.readFileSync(absolute, 'utf-8');
      return JSON.parse(raw) as T;
    } catch (error) {
      logger.error(`Failed to parse JSON: ${absolute}`);
      throw error;
    }
  }
}
