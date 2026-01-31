/**
 * Enhanced Arcanea Runtime v2.0
 * 
 * Orchestrates the complete .arc ecosystem with AI integration
 * Handles file watching, compilation, and execution
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');
const { Parser, Scanner } = require('./enhanced-parser');
const { EnhancedInterpreter } = require('./enhanced-interpreter');

class ArcaneaRuntime extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      watchFiles: true,
      autoCompile: true,
      enableAI: true,
      logLevel: 'info',
      ...options
    };
    
    this.parser = new Parser();
    this.interpreter = new EnhancedInterpreter();
    this.watchedFiles = new Map();
    this.compiledModules = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Initialize interpreter with AI systems
      await this.interpreter.initialize();
      
      // Setup file watching if enabled
      if (this.options.watchFiles) {
        await this.setupFileWatcher();
      }
      
      this.isInitialized = true;
      this.log('🚀 Arcanea Runtime initialized successfully');
      this.emit('initialized');
      
    } catch (error) {
      this.log('❌ Failed to initialize Arcanea Runtime:', 'error');
      this.log(error.message, 'error');
      this.emit('error', error);
    }
  }

  async loadFile(filePath) {
    try {
      this.log(`📖 Loading .arc file: ${filePath}`);
      
      // Read file content
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Parse AST
      const tokens = new Scanner(content).scanTokens();
      const ast = this.parser.parse(tokens);
      
      // Check for parse errors
      if (ast.errors && ast.errors.length > 0) {
        this.log(`⚠️ Parse errors in ${filePath}:`, 'warn');
        ast.errors.forEach(error => {
          this.log(`  Line ${error.line}: ${error.message}`, 'warn');
        });
        this.emit('parseErrors', { file: filePath, errors: ast.errors });
      }
      
      // Execute/interpret the AST
      const result = await this.interpreter.interpret(ast);
      
      // Cache compiled module
      this.compiledModules.set(filePath, {
        ast,
        result,
        lastModified: Date.now()
      });
      
      this.log(`✅ Successfully loaded ${filePath}`, 'success');
      this.log(`  Spells: ${result.spellsRegistered}, Characters: ${result.charactersCreated}, Worlds: ${result.worldsBuilt}`);
      
      this.emit('fileLoaded', { filePath, result });
      
      return result;
      
    } catch (error) {
      this.log(`❌ Failed to load ${filePath}:`, 'error');
      this.log(error.message, 'error');
      this.emit('error', error);
      throw error;
    }
  }

  async loadDirectory(dirPath, recursive = true) {
    try {
      this.log(`📁 Loading .arc files from: ${dirPath}`);
      
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      let loadedCount = 0;
      
      for (const file of files) {
        const fullPath = path.join(dirPath, file.name);
        
        if (file.isDirectory() && recursive) {
          await this.loadDirectory(fullPath, recursive);
        } else if (file.isFile() && file.name.endsWith('.arc')) {
          try {
            await this.loadFile(fullPath);
            loadedCount++;
          } catch (error) {
            this.log(`⚠️ Skipped invalid file ${fullPath}: ${error.message}`, 'warn');
          }
        }
      }
      
      this.log(`📚 Loaded ${loadedCount} .arc files from ${dirPath}`, 'success');
      this.emit('directoryLoaded', { dirPath, loadedCount });
      
      return loadedCount;
      
    } catch (error) {
      this.log(`❌ Failed to load directory ${dirPath}:`, 'error');
      this.log(error.message, 'error');
      throw error;
    }
  }

  async castSpell(spellName, args = {}) {
    try {
      this.log(`🎯 Casting spell: ${spellName}`);
      
      const spell = this.interpreter.getSpell(spellName);
      if (!spell) {
        throw new Error(`Spell not found: ${spellName}`);
      }
      
      const result = await spell.call(args);
      
      this.log(`✅ Spell ${spellName} executed successfully`, 'success');
      this.emit('spellCast', { spellName, args, result });
      
      return result;
      
    } catch (error) {
      this.log(`❌ Spell ${spellName} failed:`, 'error');
      this.log(error.message, 'error');
      this.emit('spellError', { spellName, args, error });
      throw error;
    }
  }

  async createCharacter(characterData) {
    try {
      this.log(`🧙 Creating character: ${characterData.name}`);
      
      // Create character declaration
      const characterDeclaration = {
        type: 'CharacterDeclaration',
        name: characterData.name,
        archetype: characterData.archetype || 'unknown',
        elementalAlignment: characterData.elementalAlignment || [],
        data: characterData.data || {},
        backstory: characterData.backstory || '',
        relationships: characterData.relationships || [],
        arcSpells: characterData.arcSpells || [],
        line: 0
      };
      
      // Register character
      await this.interpreter.registerCharacter(characterDeclaration);
      
      const character = this.interpreter.getCharacter(characterData.name);
      
      this.log(`✅ Character ${characterData.name} created successfully`, 'success');
      this.emit('characterCreated', { character });
      
      return character;
      
    } catch (error) {
      this.log(`❌ Failed to create character ${characterData.name}:`, 'error');
      this.log(error.message, 'error');
      this.emit('characterError', { characterData, error });
      throw error;
    }
  }

  async buildWorld(worldData) {
    try {
      this.log(`🌍 Building world: ${worldData.name}`);
      
      // Create world declaration
      const worldDeclaration = {
        type: 'WorldDeclaration',
        name: worldData.name,
        cosmology: worldData.cosmology || {},
        geography: worldData.geography || {},
        cultures: worldData.cultures || [],
        history: worldData.history || [],
        line: 0
      };
      
      // Register world
      await this.interpreter.registerWorld(worldDeclaration);
      
      const world = this.interpreter.getWorld(worldData.name);
      
      this.log(`✅ World ${worldData.name} built successfully`, 'success');
      this.emit('worldBuilt', { world });
      
      return world;
      
    } catch (error) {
      this.log(`❌ Failed to build world ${worldData.name}:`, 'error');
      this.log(error.message, 'error');
      this.emit('worldError', { worldData, error });
      throw error;
    }
  }

  async summonGuardian(guardianName, task = '') {
    try {
      this.log(`🔮 Summoning Guardian: ${guardianName}`);
      
      const result = await this.interpreter.builtInSummon(guardianName, task);
      
      this.log(`✅ Guardian ${guardianName} responded`, 'success');
      this.emit('guardianSummoned', { guardianName, task, result });
      
      return result;
      
    } catch (error) {
      this.log(`❌ Failed to summon Guardian ${guardianName}:`, 'error');
      this.log(error.message, 'error');
      this.emit('guardianError', { guardianName, task, error });
      throw error;
    }
  }

  // Registry access methods
  getSpells() {
    return this.interpreter.listSpells().map(name => ({
      name,
      details: this.interpreter.getSpell(name)
    }));
  }

  getCharacters() {
    return this.interpreter.listCharacters().map(name => ({
      name,
      details: this.interpreter.getCharacter(name)
    }));
  }

  getWorlds() {
    return this.interpreter.listWorlds().map(name => ({
      name,
      details: this.interpreter.getWorld(name)
    }));
  }

  getGuardians() {
    return this.interpreter.listGuardians().map(name => ({
      name,
      details: this.interpreter.getGuardian(name)
    }));
  }

  getExecutionHistory() {
    return this.interpreter.getExecutionHistory();
  }

  // File system utilities
  async setupFileWatcher() {
    // Note: In a real implementation, you'd use chokidar or similar
    this.log('👀 File watching enabled (placeholder implementation)');
    this.emit('watcherEnabled');
  }

  async saveToFile(data, filePath) {
    try {
      const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      await fs.writeFile(filePath, content, 'utf-8');
      this.log(`💾 Saved to ${filePath}`, 'success');
      this.emit('fileSaved', { filePath });
    } catch (error) {
      this.log(`❌ Failed to save ${filePath}:`, 'error');
      this.log(error.message, 'error');
      throw error;
    }
  }

  // Utility methods
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    
    if (this.options.logLevel === 'debug' || 
        (this.options.logLevel === 'info' && level !== 'debug') ||
        (this.options.logLevel === 'warn' && ['warn', 'error'].includes(level)) ||
        (this.options.logLevel === 'error' && level === 'error')) {
      
      switch (level) {
        case 'error':
          console.error(logMessage);
          break;
        case 'warn':
          console.warn(logMessage);
          break;
        case 'success':
          console.log(`\x1b[32m${logMessage}\x1b[0m`); // Green
          break;
        default:
          console.log(logMessage);
      }
    }
    
    this.emit('log', { message, level, timestamp });
  }

  getStats() {
    return {
      isInitialized: this.isInitialized,
      spellsCount: this.interpreter.arcaneaRegistry.size,
      charactersCount: this.interpreter.characters.size,
      worldsCount: this.interpreter.worlds.size,
      guardiansCount: this.interpreter.guardians.size,
      filesWatched: this.watchedFiles.size,
      executionHistory: this.interpreter.getExecutionHistory().length
    };
  }

  async shutdown() {
    this.log('🔄 Shutting down Arcanea Runtime...');
    
    // Cleanup resources
    this.watchedFiles.clear();
    this.compiledModules.clear();
    
    this.isInitialized = false;
    this.log('👋 Arcanea Runtime shutdown complete');
    this.emit('shutdown');
  }
}

module.exports = ArcaneaRuntime;