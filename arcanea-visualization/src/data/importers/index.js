import { MythologyAPIImporter } from './MythologyAPI.js';
import { SampleDataImporter } from './SampleDataImporter.js';

/**
 * Main importer that handles both API and fallback data
 */
export class MythologyImporter {
  constructor(options = {}) {
    this.useSampleData = options.useSampleData || false;
    this.importers = [];
    
    if (this.useSampleData) {
      this.importers.push(new SampleDataImporter());
    } else {
      this.importers.push(new MythologyAPIImporter());
      // Fallback to sample data if API fails
      this.importers.push(new SampleDataImporter());
    }
  }

  /**
   * Import data using available importers
   * @returns {Promise<object>} Imported data
   */
  async import() {
    let lastError = null;
    
    for (const importer of this.importers) {
      try {
        console.log(`Trying importer: ${importer.sourceName}`);
        const data = await importer.import();
        
        // Validate the data
        if (data && Array.isArray(data.nodes) && data.nodes.length > 0) {
          console.log(`Successfully imported ${data.nodes.length} nodes using ${importer.sourceName}`);
          return data;
        }
        
        console.warn(`Importer ${importer.sourceName} returned no data`);
      } catch (error) {
        console.error(`Error with importer ${importer.sourceName}:`, error.message);
        lastError = error;
      }
    }
    
    throw lastError || new Error('All importers failed to load data');
  }

  /**
   * Import data with retry logic
   * @param {number} maxRetries - Maximum number of retry attempts
   * @returns {Promise<object>} Imported data
   */
  async importWithRetry(maxRetries = 3) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Import attempt ${attempt} of ${maxRetries}`);
        return await this.import();
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.message);
        lastError = error;
        
        // Exponential backoff
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 30000); // Cap at 30s
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new Error('All import attempts failed');
  }
}

/**
 * Get the default importer instance
 * @param {object} options - Importer options
 * @returns {MythologyImporter} Importer instance
 */
export function getImporter(options = {}) {
  return new MythologyImporter(options);
}

/**
 * Get data using the default importer
 * @param {object} options - Importer options
 * @returns {Promise<object>} Imported data
 */
export async function getData(options = {}) {
  const importer = getImporter(options);
  return importer.importWithRetry();
}

export default {
  MythologyImporter,
  getImporter,
  getData
};
