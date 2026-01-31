#!/usr/bin/env node

import { fileURLToPath } from 'url';
import path from 'path';
import { exec } from 'child_process';
import http from 'http';
import { promisify } from 'util';
import winston from 'winston';
import { createRequire } from 'module';

// Create require for ES modules
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.TEST_PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;
const TEST_TIMEOUT = 10000; // 10 seconds

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()]
});

// Promisify exec for async/await
const execPromise = promisify(exec);

// Test runner
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.serverProcess = null;
  }

  // Add a test to the queue
  test(name, fn) {
    this.tests.push({ name, fn });
  }

  // Assertion helper
  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  // Make HTTP request
  async fetch(url, options = {}) {
    const response = await new Promise((resolve, reject) => {
      const req = http.request(
        new URL(url, BASE_URL),
        { timeout: 5000, ...options },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              if (data) {
                data = JSON.parse(data);
              }
              resolve({
                status: res.statusCode,
                headers: res.headers,
                data
              });
            } catch (error) {
              reject(new Error(`Failed to parse response: ${error.message}`));
            }
          });
        }
      );

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });

      if (options.body) {
        req.write(JSON.stringify(options.body));
      }
      req.end();
    });

    return response;
  }

  // Start the server
  async startServer() {
    logger.info('Starting server...');
    
    return new Promise((resolve, reject) => {
      this.serverProcess = exec(
        `node --experimental-json-modules src/server.js`,
        {
          env: { ...process.env, PORT, NODE_ENV: 'test' },
          cwd: path.join(__dirname, '..')
        },
        (error, stdout, stderr) => {
          if (error) {
            logger.error('Server error:', error);
            reject(error);
          }
        }
      );

      // Wait for server to be ready
      const checkServer = async () => {
        try {
          await this.fetch('/api/health');
          resolve();
        } catch (error) {
          // Server not ready yet, try again
          setTimeout(checkServer, 500);
        }
      };

      // Wait a bit before starting to check
      setTimeout(checkServer, 1000);
    });
  }

  // Stop the server
  async stopServer() {
    if (!this.serverProcess) return;
    
    logger.info('Stopping server...');
    this.serverProcess.kill('SIGTERM');
    this.serverProcess = null;
    
    // Give it a moment to shut down
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Run all tests
  async run() {
    const startTime = Date.now();
    
    try {
      // Start the server
      await this.startServer();
      
      logger.info('Running tests...\n');
      
      // Run each test
      for (const test of this.tests) {
        try {
          logger.info(`▶ ${test.name}`);
          await test.fn.call(this);
          this.passed++;
          logger.info('✅ PASS\n');
        } catch (error) {
          this.failed++;
          logger.error(`❌ FAIL: ${error.message}\n`);
          if (process.env.DEBUG) {
            logger.error(error.stack);
          }
        }
      }
      
      // Print summary
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      logger.info('\nTest Summary:');
      logger.info(`✅ ${this.passed} passed`);
      if (this.failed > 0) {
        logger.error(`❌ ${this.failed} failed`);
      }
      logger.info(`⏱️  ${duration}s`);
      
      // Exit with appropriate code
      process.exit(this.failed > 0 ? 1 : 0);
      
    } catch (error) {
      logger.error('Test runner error:', error);
      process.exit(1);
    } finally {
      await this.stopServer();
    }
  }
}

// Create test runner
const runner = new TestRunner();

// Add tests
runner.test('Health check endpoint', async function() {
  const response = await this.fetch('/api/health');
  this.assert(response.status === 200, 'Expected status 200');
  this.assert(response.data.status === 'ok', 'Expected status OK');
  this.assert(response.data.data.loaded === true, 'Expected data to be loaded');
});

runner.test('Get graph data', async function() {
  const response = await this.fetch('/api/graph');
  this.assert(response.status === 200, 'Expected status 200');
  this.assert(Array.isArray(response.data.nodes), 'Expected nodes array');
  this.assert(Array.isArray(response.data.links), 'Expected links array');
  this.assert(response.data.nodes.length > 0, 'Expected at least one node');
});

runner.test('Search nodes', async function() {
  const response = await this.fetch('/api/search?q=zeus');
  this.assert(response.status === 200, 'Expected status 200');
  this.assert(Array.isArray(response.data.results), 'Expected results array');
  this.assert(response.data.results.length > 0, 'Expected at least one result');
});

runner.test('Get node details', async function() {
  // First get a node ID from the graph
  const graphResponse = await this.fetch('/api/graph');
  const nodeId = graphResponse.data.nodes[0].id;
  
  const response = await this.fetch(`/api/nodes/${nodeId}`);
  this.assert(response.status === 200, 'Expected status 200');
  this.assert(response.data.id === nodeId, 'Expected correct node ID');
  this.assert(Array.isArray(response.data.connections), 'Expected connections array');
});

runner.test('Get node connections', async function() {
  // First get a node ID from the graph
  const graphResponse = await this.fetch('/api/graph');
  const nodeWithConnections = graphResponse.data.nodes.find(node => {
    return graphResponse.data.links.some(link => 
      link.source === node.id || link.target === node.id
    );
  });
  
  if (!nodeWithConnections) {
    throw new Error('No node with connections found for testing');
  }
  
  const response = await this.fetch(`/api/nodes/${nodeWithConnections.id}/connections`);
  this.assert(response.status === 200, 'Expected status 200');
  this.assert(Array.isArray(response.data.nodes), 'Expected nodes array');
  this.assert(Array.isArray(response.data.links), 'Expected links array');
  this.assert(response.data.nodes.length > 0, 'Expected at least one connected node');
});

runner.test('Get pantheons', async function() {
  const response = await this.fetch('/api/pantheons');
  this.assert(response.status === 200, 'Expected status 200');
  this.assert(Array.isArray(response.data), 'Expected array of pantheons');
  this.assert(response.data.length > 0, 'Expected at least one pantheon');
});

runner.test('Get node types', async function() {
  const response = await this.fetch('/api/types');
  this.assert(response.status === 200, 'Expected status 200');
  this.assert(Array.isArray(response.data), 'Expected array of types');
  this.assert(response.data.length > 0, 'Expected at least one node type');
});

// Run the tests
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runner.run().catch(error => {
    logger.error('Test runner failed:', error);
    process.exit(1);
  });
}

// Export for testing
export { runner };
