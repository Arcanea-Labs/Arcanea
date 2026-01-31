#!/usr/bin/env node

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { getImporter } from '../src/data/importers/index.js';
import winston from 'winston';

// Configure file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_DIR = path.join(__dirname, '..', 'data', 'cache');
const EXPORT_DIR = path.join(__dirname, '..', 'data', 'exports');

// Ensure directories exist
[EXPORT_DIR, CACHE_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: path.join(EXPORT_DIR, 'import-logs.json'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    })
  ]
});

/**
 * Main import function
 */
async function runImport() {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  logger.info('Starting data import', { timestamp });
  
  try {
    // Get importer instance based on environment
    const useSampleData = process.env.USE_SAMPLE_DATA !== 'false'; // Default to true
    const importer = getImporter({ useSampleData });
    
    logger.info(`Using ${useSampleData ? 'sample data' : 'API data'} importer`);
    
    // Run the import
    const data = await importer.import();
    const duration = Date.now() - startTime;
    
    // Validate data
    if (!data || !data.nodes || !Array.isArray(data.nodes)) {
      throw new Error('Invalid data format: missing or invalid nodes array');
    }
    
    // Add metadata
    data.meta = {
      ...(data.meta || {}),
      lastUpdated: timestamp,
      importDurationMs: duration,
      source: useSampleData ? 'sample' : 'api',
      version: process.env.npm_package_version
    };
    
    // Save to cache
    const cacheFile = path.join(CACHE_DIR, 'graph-data.json');
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
    
    // Export with timestamp
    const exportFile = path.join(EXPORT_DIR, `mythology-export-${timestamp.replace(/[:.]/g, '-')}.json`);
    fs.writeFileSync(exportFile, JSON.stringify(data, null, 2));
    
    // Create/update latest export
    const latestExport = path.join(EXPORT_DIR, 'latest-export.json');
    fs.writeFileSync(latestExport, JSON.stringify(data, null, 2));
    
    // Log success
    const stats = {
      nodes: data.nodes.length,
      links: data.links?.length || 0,
      pantheons: [...new Set(data.nodes.map(n => n.pantheon).filter(Boolean))],
      types: [...new Set(data.nodes.map(n => n.type).filter(Boolean))],
      durationMs: duration
    };
    
    logger.info('Data import completed successfully', stats);
    
    // Save summary
    const summary = {
      timestamp,
      status: 'success',
      ...stats,
      cacheFile,
      exportFile
    };
    
    const summaryFile = path.join(EXPORT_DIR, 'import-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    
    return { success: true, summary };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorInfo = {
      error: error.message,
      stack: error.stack,
      durationMs: duration
    };
    
    logger.error('Data import failed', errorInfo);
    
    // Save error summary
    const summaryFile = path.join(EXPORT_DIR, 'import-summary.json');
    const errorSummary = {
      timestamp,
      status: 'error',
      error: error.message,
      durationMs: duration
    };
    
    fs.writeFileSync(summaryFile, JSON.stringify(errorSummary, null, 2));
    
    return { success: false, error: error.message };
  }
}

// Handle command line execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runImport()
    .then(({ success, summary, error }) => {
      if (success) {
        console.log('\n✅ Data import completed successfully!');
        console.log('Summary:', JSON.stringify(summary, null, 2));
        process.exit(0);
      } else {
        console.error('\n❌ Data import failed:', error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Unhandled error in data import:', error);
      process.exit(1);
    });
}

export default runImport;
