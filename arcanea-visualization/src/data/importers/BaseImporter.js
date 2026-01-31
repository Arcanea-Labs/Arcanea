import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CACHE_CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Base class for all data importers
 */
export class BaseImporter {
  constructor(sourceName) {
    this.sourceName = sourceName;
    this.cacheDir = path.resolve(process.cwd(), CACHE_CONFIG.DIRECTORY);
    this.ensureCacheDirectory();
  }

  /**
   * Ensure the cache directory exists
   */
  ensureCacheDirectory() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Get cache file path for a specific key
   * @param {string} key - Cache key
   * @returns {string} Cache file path
   */
  getCachePath(key) {
    const safeKey = key.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return path.join(this.cacheDir, `${this.sourceName}_${safeKey}.json`);
  }

  /**
   * Check if a cached file is still valid
   * @param {string} filePath - Path to the cache file
   * @returns {boolean} True if cache is valid, false otherwise
   */
  isCacheValid(filePath) {
    if (!CACHE_CONFIG.ENABLED) return false;
    
    try {
      const stats = fs.statSync(filePath);
      const age = Date.now() - stats.mtimeMs;
      return age < CACHE_CONFIG.TTL;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get data from cache if available and valid
   * @param {string} key - Cache key
   * @returns {Promise<object|null>} Cached data or null if not available
   */
  async getFromCache(key) {
    if (!CACHE_CONFIG.ENABLED) return null;
    
    const cachePath = this.getCachePath(key);
    
    try {
      if (this.isCacheValid(cachePath)) {
        const data = await fs.promises.readFile(cachePath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn(`Cache read error for ${key}:`, error.message);
    }
    
    return null;
  }

  /**
   * Save data to cache
   * @param {string} key - Cache key
   * @param {object} data - Data to cache
   * @returns {Promise<void>}
   */
  async saveToCache(key, data) {
    if (!CACHE_CONFIG.ENABLED) return;
    
    const cachePath = this.getCachePath(key);
    
    try {
      await fs.promises.writeFile(
        cachePath,
        JSON.stringify(data, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.warn(`Cache write error for ${key}:`, error.message);
    }
  }

  /**
   * Fetch data with caching support
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Function that returns a promise with the data
   * @returns {Promise<object>} Fetched or cached data
   */
  async fetchWithCache(key, fetchFn) {
    // Try to get from cache first
    const cached = await this.getFromCache(key);
    if (cached) {
      console.log(`[${this.sourceName}] Using cached data for ${key}`);
      return cached;
    }
    
    // If not in cache or cache is invalid, fetch fresh data
    console.log(`[${this.sourceName}] Fetching fresh data for ${key}`);
    const data = await fetchFn();
    
    // Save to cache for future use
    await this.saveToCache(key, data);
    
    return data;
  }

  /**
   * Transform raw data to the standard format
   * @param {object} data - Raw data from the source
   * @returns {object} Transformed data in standard format
   */
  transformData(data) {
    // To be implemented by child classes
    throw new Error('transformData method must be implemented by child classes');
  }

  /**
   * Import data from the source
   * @returns {Promise<object>} Imported and transformed data
   */
  async import() {
    // To be implemented by child classes
    throw new Error('import method must be implemented by child classes');
  }
}
