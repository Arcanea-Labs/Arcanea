import { getImporter } from '../src/data/importers/index.js';
import fs from 'fs';
import path from 'path';

// Configuration
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'exports');
const USE_SAMPLE_DATA = process.env.USE_SAMPLE_DATA !== 'false'; // Default to true

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Run the import test
 */
async function runTest() {
  console.log('Starting import test...');
  console.log(`Using ${USE_SAMPLE_DATA ? 'sample data' : 'API data'}`);
  
  try {
    // Create importer instance
    const importer = getImporter({ useSampleData: USE_SAMPLE_DATA });
    
    // Import data
    console.log('Importing data...');
    const startTime = Date.now();
    const data = await importer.import();
    const duration = Date.now() - startTime;
    
    // Log results
    console.log(`\nImport completed in ${duration}ms`);
    console.log(`- Nodes: ${data.nodes?.length || 0}`);
    console.log(`- Links: ${data.links?.length || 0}`);
    
    // Log sample nodes
    if (data.nodes && data.nodes.length > 0) {
      console.log('\nSample nodes:');
      data.nodes.slice(0, 5).forEach((node, i) => {
        console.log(`  ${i + 1}. ${node.name} (${node.type}) - ${node.description?.substring(0, 60)}...`);
      });
    }
    
    // Save full data to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(OUTPUT_DIR, `mythology-data-${timestamp}.json`);
    
    fs.writeFileSync(
      outputFile,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
    
    console.log(`\nData saved to: ${outputFile}`);
    
    // Generate summary
    const summary = {
      timestamp: new Date().toISOString(),
      durationMs: duration,
      nodeCount: data.nodes?.length || 0,
      linkCount: data.links?.length || 0,
      source: data.meta?.source || 'unknown',
      pantheons: [...new Set(data.nodes?.map(n => n.pantheon).filter(Boolean))],
      types: [...new Set(data.nodes?.map(n => n.type).filter(Boolean))]
    };
    
    // Save summary
    const summaryFile = path.join(OUTPUT_DIR, 'import-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`Summary saved to: ${summaryFile}`);
    
    return { success: true, summary };
  } catch (error) {
    console.error('Import test failed:', error);
    return { 
      success: false, 
      error: error.message,
      stack: error.stack 
    };
  }
}

// Run the test
runTest()
  .then(({ success, summary, error }) => {
    if (success) {
      console.log('\n✅ Import test completed successfully!');
      console.log('Summary:', JSON.stringify(summary, null, 2));
    } else {
      console.error('\n❌ Import test failed:', error);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ Unhandled error in import test:', error);
    process.exit(1);
  });
