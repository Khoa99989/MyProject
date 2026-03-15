import * as fs from 'fs';
import * as path from 'path';

/**
 * DataReader — generic JSON test-data loader.
 * Reads JSON files from the `data/` directory and returns typed data.
 */
export class DataReader {
  private static readonly DATA_DIR = path.resolve(__dirname, '..', 'data');

  /**
   * Read and parse a JSON data file.
   * @param fileName - Name of the file in the data/ directory (e.g. 'login.json')
   * @returns Parsed JSON data of type T
   */
  static readData<T>(fileName: string): T {
    const filePath = path.join(DataReader.DATA_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  }

  /**
   * Read data and filter by a predicate.
   * @param fileName - Name of the file in the data/ directory
   * @param predicate - Filter function
   * @returns Filtered array of type T
   */
  static readAndFilter<T>(fileName: string, predicate: (item: T) => boolean): T[] {
    const data = DataReader.readData<T[]>(fileName);
    return data.filter(predicate);
  }

  /**
   * Get a single item from data by a key-value lookup.
   * @param fileName - Name of the file in the data/ directory
   * @param key - Property name to search
   * @param value - Value to match
   * @returns The first matching item, or undefined
   */
  static findOne<T extends Record<string, unknown>>(
    fileName: string,
    key: keyof T,
    value: unknown
  ): T | undefined {
    const data = DataReader.readData<T[]>(fileName);
    return data.find((item) => item[key] === value);
  }
}
