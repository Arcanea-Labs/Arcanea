/**
 * Arcanea Obsidian Sync System
 * 
 * Bi-directional synchronization between Arcanea ecosystem and Obsidian vault
 * Enables seamless workflow between desktop app and Obsidian
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

class ObsidianSync extends EventEmitter {
  constructor(options = {}) {
    super();
    this.vaultPath = options.vaultPath || '';
    this.syncInterval = options.syncInterval || 5000; // 5 seconds
    this.conflictResolution = options.conflictResolution || 'timestamp'; // 'timestamp', 'manual', 'merge'
    this.watchEnabled = options.watchEnabled !== false;
    
    this.syncState = new Map();
    this.pendingChanges = [];
    this.isSyncing = false;
    this.watcher = null;
    
    this.directories = {
      promptBooks: 'Prompt Books',
      characterBook: 'CharacterBook',
      worldBuilder: 'World Builder',
      guardianGuidance: 'Guardian Guidance',
      spells: 'Prompt Books/Spells',
      archetypes: 'Prompt Books/Archetypes',
      templates: 'Prompt Books/Templates'
    };
  }

  /**
   * Initialize Obsidian vault structure
   */
  async initializeVault() {
    if (!this.vaultPath) {
      throw new Error('Vault path not configured');
    }

    try {
      // Create directory structure
      for (const [key, dir] of Object.entries(this.directories)) {
        const dirPath = path.join(this.vaultPath, dir);
        await fs.mkdir(dirPath, { recursive: true });
      }

      // Create README
      await this.createReadme();

      this.emit('vault:initialized', { path: this.vaultPath });
      return true;
    } catch (error) {
      this.emit('vault:error', { error: error.message });
      throw error;
    }
  }

  /**
   * Create Obsidian README
   */
  async createReadme() {
    const readmeContent = `# Arcanea Vault

Welcome to your Arcanea creative ecosystem vault.

## Structure

- **Prompt Books/** - Your spell and prompt library
  - **Spells/** - AI generation spells (.arc files)
  - **Archetypes/** - Character and world archetypes
  - **Templates/** - Reusable templates
- **CharacterBook/** - Character profiles and development
- **World Builder/** - World building documentation
- **Guardian Guidance/** - Agent guidance and wisdom

## Usage

1. Create or edit .arc files in the appropriate folders
2. Use the Arcanea desktop app for visual editing
3. Changes sync automatically between app and Obsidian

## File Formats

- **.arc** - Arcanea spell files with @ declarations
- **.md** - Standard Markdown documentation
- **.json** - Structured data for characters/worlds

## Sync Status

Last sync: ${new Date().toISOString()}
`;

    const readmePath = path.join(this.vaultPath, 'README.md');
    await fs.writeFile(readmePath, readmeContent, 'utf-8');
  }

  /**
   * Sync from Arcanea to Obsidian (export)
   */
  async syncToObsidian(data) {
    if (this.isSyncing) {
      this.pendingChanges.push({ type: 'export', data });
      return { queued: true };
    }

    this.isSyncing = true;
    const results = [];

    try {
      // Sync prompts
      if (data.prompts) {
        for (const prompt of data.prompts) {
          const result = await this.exportPrompt(prompt);
          results.push(result);
        }
      }

      // Sync characters
      if (data.characters) {
        for (const character of data.characters) {
          const result = await this.exportCharacter(character);
          results.push(result);
        }
      }

      // Sync worlds
      if (data.worlds) {
        for (const world of data.worlds) {
          const result = await this.exportWorld(world);
          results.push(result);
        }
      }

      this.emit('sync:export', { count: results.length, results });
      return { success: true, count: results.length, results };

    } catch (error) {
      this.emit('sync:error', { error: error.message, direction: 'export' });
      throw error;
    } finally {
      this.isSyncing = false;
      this.processPendingChanges();
    }
  }

  /**
   * Sync from Obsidian to Arcanea (import)
   */
  async syncFromObsidian() {
    if (this.isSyncing) {
      this.pendingChanges.push({ type: 'import' });
      return { queued: true };
    }

    this.isSyncing = true;
    const results = {
      prompts: [],
      characters: [],
      worlds: [],
      archetypes: []
    };

    try {
      // Import .arc files from Prompt Books
      const spellsDir = path.join(this.vaultPath, this.directories.spells);
      const spellFiles = await this.getArcFiles(spellsDir);
      
      for (const file of spellFiles) {
        const content = await fs.readFile(file, 'utf-8');
        const prompt = this.parseArcToPrompt(content, file);
        if (prompt) {
          results.prompts.push(prompt);
        }
      }

      // Import characters
      const characterDir = path.join(this.vaultPath, this.directories.characterBook);
      const characterFiles = await this.getArcFiles(characterDir);
      
      for (const file of characterFiles) {
        const content = await fs.readFile(file, 'utf-8');
        const character = this.parseArcToCharacter(content, file);
        if (character) {
          results.characters.push(character);
        }
      }

      // Import worlds
      const worldDir = path.join(this.vaultPath, this.directories.worldBuilder);
      const worldFiles = await this.getArcFiles(worldDir);
      
      for (const file of worldFiles) {
        const content = await fs.readFile(file, 'utf-8');
        const world = this.parseArcToWorld(content, file);
        if (world) {
          results.worlds.push(world);
        }
      }

      this.emit('sync:import', { 
        prompts: results.prompts.length,
        characters: results.characters.length,
        worlds: results.worlds.length
      });

      return { success: true, data: results };

    } catch (error) {
      this.emit('sync:error', { error: error.message, direction: 'import' });
      throw error;
    } finally {
      this.isSyncing = false;
      this.processPendingChanges();
    }
  }

  /**
   * Export prompt to Obsidian
   */
  async exportPrompt(prompt) {
    const fileName = `${this.sanitizeFileName(prompt.name)}.arc`;
    const filePath = path.join(this.vaultPath, this.directories.spells, fileName);

    const content = this.convertPromptToArc(prompt);
    
    // Check for conflicts
    const existingContent = await this.readFileIfExists(filePath);
    if (existingContent) {
      const resolution = await this.resolveConflict(filePath, existingContent, content);
      if (!resolution.save) {
        return { file: filePath, action: 'skipped', reason: resolution.reason };
      }
    }

    await fs.writeFile(filePath, content, 'utf-8');
    this.syncState.set(filePath, {
      lastSync: Date.now(),
      hash: this.hashContent(content)
    });

    return { file: filePath, action: 'exported' };
  }

  /**
   * Export character to Obsidian
   */
  async exportCharacter(character) {
    const fileName = `${this.sanitizeFileName(character.name)}.arc`;
    const dirPath = path.join(this.vaultPath, this.directories.characterBook, 'Main Characters');
    await fs.mkdir(dirPath, { recursive: true });
    
    const filePath = path.join(dirPath, fileName);
    const content = this.convertCharacterToArc(character);

    await fs.writeFile(filePath, content, 'utf-8');
    
    return { file: filePath, action: 'exported' };
  }

  /**
   * Export world to Obsidian
   */
  async exportWorld(world) {
    const fileName = `${this.sanitizeFileName(world.name)}.arc`;
    const dirPath = path.join(this.vaultPath, this.directories.worldBuilder, 'Worlds');
    await fs.mkdir(dirPath, { recursive: true });
    
    const filePath = path.join(dirPath, fileName);
    const content = this.convertWorldToArc(world);

    await fs.writeFile(filePath, content, 'utf-8');
    
    return { file: filePath, action: 'exported' };
  }

  /**
   * Convert prompt object to .arc format
   */
  convertPromptToArc(prompt) {
    const tags = prompt.tags?.map(t => 
      t.weight && t.weight !== 1.0 ? `(${t.label}:${t.weight})` : t.label
    ).join(', ') || '';

    return `@spell ${this.sanitizeId(prompt.name)}
@description "${prompt.description || prompt.name}"
@category "${prompt.category || 'general'}"

@parameters {
  "content": "${prompt.content || ''}"
}

@tags
${tags}

@negative_prompts
${prompt.negativePrompts || ''}

@implementation
${prompt.content || ''}${tags ? ', ' + tags : ''}
`;
  }

  /**
   * Convert character object to .arc format
   */
  convertCharacterToArc(character) {
    return `@character ${this.sanitizeId(character.name)}
@archetype ${character.archetype || 'unknown'}
@elemental_alignment [${character.elements?.join(', ') || 'void'}]

@data {
  "name": "${character.name}",
  "role": "${character.role || 'protagonist'}",
  "traits": ${JSON.stringify(character.traits || [])}
}

@backstory
${character.backstory || '# Character Backstory\n\nComing soon...'}

@relationships
${JSON.stringify(character.relationships || [], null, 2)}
`;
  }

  /**
   * Convert world object to .arc format
   */
  convertWorldToArc(world) {
    return `@world ${this.sanitizeId(world.name)}
@description "${world.description || ''}"
@elemental_balance [${world.elements?.join(', ') || 'all'}]

@cosmology {
  "type": "${world.cosmology || 'physical'}",
  "governance": "${world.governance || 'natural'}"
}

@geography
${world.geography || '# Geography\n\nComing soon...'}

@cultures
${world.cultures || '# Cultures\n\nComing soon...'}

@history
${world.history || '# History\n\nComing soon...'}
`;
  }

  /**
   * Parse .arc file to prompt object
   */
  parseArcToPrompt(content, filePath) {
    // Simple parsing - in production would use the full parser
    const lines = content.split('\n');
    const prompt = {
      id: path.basename(filePath, '.arc'),
      name: '',
      content: '',
      tags: [],
      negativePrompts: '',
      category: 'prompts'
    };

    let inImplementation = false;
    let implementationLines = [];

    for (const line of lines) {
      if (line.startsWith('@spell ')) {
        prompt.name = line.replace('@spell ', '').trim();
      } else if (line.startsWith('@implementation')) {
        inImplementation = true;
      } else if (inImplementation) {
        implementationLines.push(line);
      } else if (line.startsWith('@negative_prompts')) {
        // Next non-empty line is negative prompts
      }
    }

    prompt.content = implementationLines.join('\n').trim();
    return prompt;
  }

  /**
   * Parse .arc file to character object
   */
  parseArcToCharacter(content, filePath) {
    const lines = content.split('\n');
    const character = {
      id: path.basename(filePath, '.arc'),
      name: '',
      archetype: '',
      elements: [],
      traits: [],
      backstory: ''
    };

    for (const line of lines) {
      if (line.startsWith('@character ')) {
        character.name = line.replace('@character ', '').trim();
      } else if (line.startsWith('@archetype ')) {
        character.archetype = line.replace('@archetype ', '').trim();
      }
    }

    return character;
  }

  /**
   * Parse .arc file to world object
   */
  parseArcToWorld(content, filePath) {
    const lines = content.split('\n');
    const world = {
      id: path.basename(filePath, '.arc'),
      name: '',
      description: '',
      elements: []
    };

    for (const line of lines) {
      if (line.startsWith('@world ')) {
        world.name = line.replace('@world ', '').trim();
      } else if (line.startsWith('@description ')) {
        world.description = line.replace('@description ', '').replace(/"/g, '').trim();
      }
    }

    return world;
  }

  /**
   * Get all .arc files in directory
   */
  async getArcFiles(dir) {
    try {
      const files = await fs.readdir(dir, { recursive: true });
      return files
        .filter(f => f.endsWith('.arc'))
        .map(f => path.join(dir, f));
    } catch (error) {
      return [];
    }
  }

  /**
   * Resolve sync conflicts
   */
  async resolveConflict(filePath, existingContent, newContent) {
    switch (this.conflictResolution) {
      case 'timestamp':
        // Always use newer content (assumes newContent is always newer from app)
        return { save: true };
      
      case 'manual':
        this.emit('conflict', { file: filePath, existing: existingContent, incoming: newContent });
        return { save: false, reason: 'awaiting_manual_resolution' };
      
      case 'merge':
        const merged = this.mergeContent(existingContent, newContent);
        return { save: true, merged: true, content: merged };
      
      default:
        return { save: true };
    }
  }

  /**
   * Simple content merge (placeholder)
   */
  mergeContent(existing, incoming) {
    // In production, this would be a sophisticated merge
    return incoming;
  }

  /**
   * Process pending changes queue
   */
  async processPendingChanges() {
    if (this.pendingChanges.length === 0) return;

    const change = this.pendingChanges.shift();
    
    if (change.type === 'export') {
      await this.syncToObsidian(change.data);
    } else if (change.type === 'import') {
      await this.syncFromObsidian();
    }
  }

  /**
   * Read file if it exists
   */
  async readFileIfExists(filePath) {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      return null;
    }
  }

  /**
   * Sanitize file name
   */
  sanitizeFileName(name) {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

  /**
   * Sanitize ID
   */
  sanitizeId(name) {
    return name.replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi, '').toLowerCase();
  }

  /**
   * Simple content hash
   */
  hashContent(content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  /**
   * Start watching for file changes
   */
  startWatching() {
    if (!this.watchEnabled || !this.vaultPath) return;

    // In production, would use fs.watch or chokidar
    // For now, poll-based watching
    this.watcher = setInterval(async () => {
      try {
        const result = await this.syncFromObsidian();
        if (result.data && (
          result.data.prompts.length > 0 ||
          result.data.characters.length > 0 ||
          result.data.worlds.length > 0
        )) {
          this.emit('watch:changes', result.data);
        }
      } catch (error) {
        // Silently ignore watch errors
      }
    }, this.syncInterval);

    this.emit('watch:started');
  }

  /**
   * Stop watching
   */
  stopWatching() {
    if (this.watcher) {
      clearInterval(this.watcher);
      this.watcher = null;
      this.emit('watch:stopped');
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      vaultPath: this.vaultPath,
      isSyncing: this.isSyncing,
      pendingChanges: this.pendingChanges.length,
      watchedFiles: this.syncState.size,
      lastSync: Array.from(this.syncState.values()).pop()?.lastSync
    };
  }
}

// Export
module.exports = ObsidianSync;

// Example usage
if (require.main === module) {
  console.log('🔄 Arcanea Obsidian Sync System\n');

  const sync = new ObsidianSync({
    vaultPath: './test-vault',
    syncInterval: 3000
  });

  // Event listeners
  sync.on('vault:initialized', (data) => {
    console.log('✅ Vault initialized:', data.path);
  });

  sync.on('sync:export', (data) => {
    console.log('📤 Exported', data.count, 'items');
  });

  sync.on('sync:import', (data) => {
    console.log('📥 Imported:', data);
  });

  // Demo
  (async () => {
    try {
      // Initialize vault
      await sync.initializeVault();

      // Export sample data
      const sampleData = {
        prompts: [
          {
            id: '1',
            name: 'Test Spell',
            content: 'A magical test prompt',
            tags: [
              { label: 'best quality', weight: 1.1 },
              { label: 'masterpiece', weight: 1.0 }
            ],
            negativePrompts: 'blurry, low quality'
          }
        ],
        characters: [
          {
            name: 'Test Character',
            archetype: 'storm-seeker',
            elements: ['fire', 'air'],
            traits: ['brave', 'determined']
          }
        ]
      };

      const exportResult = await sync.syncToObsidian(sampleData);
      console.log('Export result:', exportResult);

      // Import back
      const importResult = await sync.syncFromObsidian();
      console.log('Import result:', importResult);

      console.log('\n✨ Sync complete!');

    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  })();
}
