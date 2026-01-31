import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { getImporter } from './data/importers/index.js';
import fs from 'fs';
import winston from 'winston';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Server instance will be set when server starts
let server = null;

// File paths
const DATA_CACHE_PATH = path.join(process.cwd(), 'data', 'cache', 'graph-data.json');
const LOGS_DIR = path.join(process.cwd(), 'logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Configure logger
const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
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
      filename: path.join(LOGS_DIR, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    new winston.transports.File({ 
      filename: path.join(LOGS_DIR, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    })
  ]
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to restart the process here
});

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // In production, you might want to restart the process here
  process.exit(1);
});

// Ensure cache directory exists
const ensureCacheDirectory = () => {
  const cacheDir = path.dirname(DATA_CACHE_PATH);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
};

// Load or initialize graph data
let graphData = null;
const loadGraphData = async () => {
  try {
    // Try to load from cache first
    if (fs.existsSync(DATA_CACHE_PATH)) {
      const cacheStats = fs.statSync(DATA_CACHE_PATH);
      const cacheAge = Date.now() - cacheStats.mtimeMs;
      const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (cacheAge < maxCacheAge) {
        const cachedData = fs.readFileSync(DATA_CACHE_PATH, 'utf-8');
        graphData = JSON.parse(cachedData);
        console.log(`Loaded graph data from cache (${graphData.nodes?.length || 0} nodes, ${graphData.links?.length || 0} links)`);
        return;
      }
    }
    
    // If no cache or cache is stale, import fresh data
    console.log('Importing fresh graph data...');
    const importer = getImporter({
      useSampleData: process.env.USE_SAMPLE_DATA === 'true'
    });
    
    graphData = await importer.import();
    
    // Save to cache
    ensureCacheDirectory();
    fs.writeFileSync(DATA_CACHE_PATH, JSON.stringify(graphData, null, 2));
    console.log(`Imported and cached graph data (${graphData.nodes?.length || 0} nodes, ${graphData.links?.length || 0} links)`);
  } catch (error) {
    console.error('Failed to load graph data:', error);
    // Fall back to sample data if available
    if (!graphData) {
      console.log('Falling back to sample data...');
      const sampleImporter = getImporter({ useSampleData: true });
      graphData = await sampleImporter.import();
    }
  }
};

// Security middleware
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

// Enable CORS with configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression middleware (for responses)
app.use(compression());

// HTTP request logging
app.use(morgan(isProduction ? 'combined' : 'dev', {
  stream: {
    write: (message) => logger.http(message.trim())
  }
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static files with cache control
const oneDay = 86400000; // 24 hours in milliseconds
app.use(express.static('public', {
  maxAge: isProduction ? oneDay : 0,
  etag: true,
  lastModified: true
}));

// Initialize and start the server
const startServer = async () => {
  try {
    logger.info('Starting application initialization...');
    await loadGraphData();
    
    // Schedule periodic data refresh (every 24 hours)
    const refreshInterval = 24 * 60 * 60 * 1000; // 24 hours
    setInterval(loadGraphData, refreshInterval);
    logger.info(`Scheduled data refresh every ${refreshInterval}ms`);
    
    // Start the server
    return new Promise((resolve) => {
      const server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
        logger.info(`Graph data loaded with ${graphData?.nodes?.length || 0} nodes and ${graphData?.links?.length || 0} links`);
        logger.info(`Server is running on http://localhost:${PORT}`);
        
        if (graphData) {
          logger.info(`- Nodes: ${graphData.nodes?.length || 0}`);
          logger.info(`- Links: ${graphData.links?.length || 0}`);
          logger.info(`- Source: ${graphData.meta?.source || 'unknown'}`);
          logger.info(`- Last updated: ${graphData.meta?.lastUpdated || 'unknown'}`);
        }
        
        resolve(server);
      });
      
      // Handle server errors
      server.on('error', (error) => {
        logger.error('Server error:', error);
        process.exit(1);
      });
    });
  } catch (error) {
    logger.error('Fatal error during application startup:', error);
    await shutdown();
    process.exit(1);
  }
};

// Only start the server if this file is run directly (not when imported)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Export for testing
export { app, startServer, shutdown };

// API Endpoints

// Health check endpoint with detailed status
app.get('/api/health', (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 86400)}d ${Math.floor(uptime % 86400 / 3600)}h ${Math.floor(uptime % 3600 / 60)}m ${Math.floor(uptime % 60)}s`,
      memory: {
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        external: memoryUsage.external ? `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB` : 'N/A',
        arrayBuffers: memoryUsage.arrayBuffers ? `${(memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2)} MB` : 'N/A'
      },
      data: {
        loaded: !!graphData,
        nodeCount: graphData?.nodes?.length || 0,
        linkCount: graphData?.links?.length || 0,
        lastUpdated: graphData?.meta?.lastUpdated || null,
        source: graphData?.meta?.source || 'unknown',
        cachePath: DATA_CACHE_PATH,
        cacheExists: fs.existsSync(DATA_CACHE_PATH)
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cpus: require('os').cpus().length,
        env: NODE_ENV
      }
    };
    
    // Log health check
    logger.debug('Health check', { 
      status: healthData.status,
      uptime: healthData.uptime,
      memory: healthData.memory,
      data: healthData.data
    });
    
    res.json(healthData);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      error: 'Health check failed',
      details: isProduction ? undefined : error.message
    });
  }
});

// Get complete graph data
app.get('/api/graph', (req, res) => {
  try {
    if (!graphData) {
      return res.status(503).json({ error: 'Data not loaded yet' });
    }
    
    // Apply filters if provided
    const { pantheon, type, search } = req.query;
    let filteredData = { ...graphData };
    
    if (pantheon || type || search) {
      filteredData.nodes = (graphData.nodes || []).filter(node => {
        const matchesPantheon = !pantheon || node.pantheon === pantheon;
        const matchesType = !type || node.type === type;
        const matchesSearch = !search || 
          node.name.toLowerCase().includes(search.toLowerCase()) ||
          (node.description && node.description.toLowerCase().includes(search.toLowerCase()));
        
        return matchesPantheon && matchesType && matchesSearch;
      });
      
      // Filter links to only include connections between filtered nodes
      const nodeIds = new Set(filteredData.nodes.map(n => n.id));
      filteredData.links = (graphData.links || []).filter(
        link => nodeIds.has(link.source) && nodeIds.has(link.target)
      );
    }
    
    res.json(filteredData);
  } catch (error) {
    logger.error('Error fetching graph data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch graph data',
      details: isProduction ? undefined : error.message
    });
  }
});

// Get specific node by ID
app.get('/api/nodes/:id', (req, res) => {
  try {
    if (!graphData) {
      return res.status(503).json({ error: 'Data not loaded yet' });
    }
    
    const node = (graphData.nodes || []).find(n => n.id === req.params.id);
    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }
    
    // Find connected nodes
    const connections = (graphData.links || [])
      .filter(link => link.source === node.id || link.target === node.id)
      .map(link => ({
        id: link.source === node.id ? link.target : link.source,
        type: link.type,
        value: link.value
      }));
    
    res.json({
      ...node,
      connections
    });
  } catch (error) {
    logger.error('Error fetching node:', error);
    res.status(500).json({ 
      error: 'Failed to fetch node',
      details: isProduction ? undefined : error.message
    });
  }
});

// Get connected nodes
app.get('/api/nodes/:id/connections', (req, res) => {
  try {
    if (!graphData) {
      return res.status(503).json({ error: 'Data not loaded yet' });
    }
    
    const nodeId = req.params.id;
    const depth = Math.min(parseInt(req.query.depth) || 1, 5); // Limit depth to 5 for performance
    
    // Find all nodes connected within the specified depth
    const connectedNodeIds = new Set([nodeId]);
    const connections = [];
    
    // BFS to find connected nodes
    let currentDepth = 0;
    let currentLevel = [nodeId];
    
    while (currentLevel.length > 0 && currentDepth < depth) {
      const nextLevel = [];
      
      for (const sourceId of currentLevel) {
        (graphData.links || []).forEach(link => {
          if (link.source === sourceId && !connectedNodeIds.has(link.target)) {
            connectedNodeIds.add(link.target);
            nextLevel.push(link.target);
            connections.push({
              source: sourceId,
              target: link.target,
              type: link.type,
              value: link.value
            });
          } else if (link.target === sourceId && !connectedNodeIds.has(link.source)) {
            connectedNodeIds.add(link.source);
            nextLevel.push(link.source);
            connections.push({
              source: sourceId,
              target: link.source,
              type: link.type,
              value: link.value
            });
          }
        });
      }
      
      currentLevel = nextLevel;
      currentDepth++;
    }
    
    // Get full node objects
    const connectedNodes = (graphData.nodes || [])
      .filter(node => connectedNodeIds.has(node.id) && node.id !== nodeId);
    
    res.json({
      node: (graphData.nodes || []).find(n => n.id === nodeId),
      connections: connectedNodes.map(node => ({
        ...node,
        // Include connection type and value if available
        connection: connections.find(c => 
          (c.source === nodeId && c.target === node.id) || 
          (c.target === nodeId && c.source === node.id)
        )
      }))
    });
  } catch (error) {
    logger.error('Error fetching connections:', error);
    res.status(500).json({ 
      error: 'Failed to fetch connections',
      details: isProduction ? undefined : error.message
    });
  }
});

// Search nodes by name or description
app.get('/api/search', (req, res) => {
  try {
    if (!graphData) {
      return res.status(503).json({ error: 'Data not loaded yet' });
    }
    
    const query = req.query.q?.trim();
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = (graphData.nodes || [])
      .filter(node => 
        node.name.toLowerCase().includes(query.toLowerCase()) ||
        (node.description && node.description.toLowerCase().includes(query.toLowerCase()))
      )
      .map(node => ({
        ...node,
        // Include connections count
        connections: (graphData.links || []).filter(
          link => link.source === node.id || link.target === node.id
        ).length
      }));
    
    res.json({
      query,
      count: results.length,
      results
    });
  } catch (error) {
    logger.error('Error searching nodes:', error);
    res.status(500).json({ 
      error: 'Search failed',
      details: isProduction ? undefined : error.message
    });
  }
});

// Get available pantheons
app.get('/api/pantheons', (req, res) => {
  try {
    if (!graphData) {
      return res.status(503).json({ error: 'Data not loaded yet' });
    }
    
    const pantheons = new Map();
    
    // Extract pantheons from nodes
    (graphData.nodes || []).forEach(node => {
      if (node.pantheon) {
        if (!pantheons.has(node.pantheon)) {
          pantheons.set(node.pantheon, {
            id: node.pantheon,
            name: node.pantheon.charAt(0).toUpperCase() + node.pantheon.slice(1),
            count: 0,
            color: node.color || '#666666',
            symbol: node.symbol || '🏛️'
          });
        }
        pantheons.get(node.pantheon).count++;
      }
    });
    
    res.json(Array.from(pantheons.values()));
  } catch (error) {
    logger.error('Error fetching pantheons:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pantheons',
      details: isProduction ? undefined : error.message
    });
  }
});

// Get available node types
app.get('/api/types', (req, res) => {
  try {
    if (!graphData) {
      return res.status(503).json({ error: 'Data not loaded yet' });
    }
    
    const types = new Map();
    
    // Extract types from nodes
    (graphData.nodes || []).forEach(node => {
      if (node.type) {
        if (!types.has(node.type)) {
          types.set(node.type, {
            id: node.type,
            name: node.type.charAt(0).toUpperCase() + node.type.slice(1),
            count: 0,
            symbol: getDefaultSymbolForType(node.type)
          });
        }
        types.get(node.type).count++;
      }
    });
    
    res.json(Array.from(types.values()));
  } catch (error) {
    logger.error('Error fetching node types:', error);
    res.status(500).json({ 
      error: 'Failed to fetch node types',
      details: isProduction ? undefined : error.message
    });
  }
});

// Helper method to get default symbol for node type
function getDefaultSymbolForType(type) {
  const typeSymbols = {
    'deity': '👑',
    'creature': '🐉',
    'place': '🗺️',
    'artifact': '⚔️',
    'concept': '💭',
    'event': '🎭',
    'pantheon': '🏛️',
    'hero': '🛡️',
    'titan': '🌋',
    'spirit': '👻',
    'monster': '👹',
    'demigod': '🌟',
    'primordial': '🌌',
    'trickster': '🦊',
    'smith': '⚒️',
    'healer': '💉',
    'prophet': '🔮',
    'messenger': '📨',
    'guardian': '🛡️',
    'hunter': '🏹'
  };
  
  return typeSymbols[type.toLowerCase()] || '❓';
}

// Serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: isProduction ? undefined : err.message,
    stack: isProduction ? undefined : err.stack
  });
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `The requested resource '${req.originalUrl}' was not found.`
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // In production, you might want to gracefully shut down the server here
  // process.exit(1);
});

// Handle graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down server gracefully...');
  
  try {
    // Close any open connections or resources here
    
    // Close the server if it exists
    if (server) {
      await new Promise((resolve) => {
        server.close((error) => {
          if (error) {
            logger.error('Error closing server:', error);
          } else {
            logger.info('Server has been shut down');
          }
          resolve();
        });
        
        // Force close after 5 seconds
        setTimeout(() => {
          logger.warn('Forcing server to stop');
          process.exit(1);
        }, 5000);
      });
    } else {
      logger.info('No server instance to shut down');
    }
    
    // Close database connections, etc.
    
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  shutdown().catch(error => {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received');
  shutdown().catch(error => {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  });
});
