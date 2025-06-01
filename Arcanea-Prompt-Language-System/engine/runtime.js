/**
 * Arcanea Runtime
 * 
 * Manages the execution environment, spells, and archetypes
 */

class Runtime {
  constructor() {
    this.spells = new Map();
    this.archetypes = new Map();
    this.modules = new Map();
    this.context = {
      variables: new Map(),
      functions: new Map(),
      types: new Map()
    };
  }

  /**
   * Register a spell in the runtime
   * @param {string} name - The name of the spell
   * @param {Object} spell - The spell definition
   */
  registerSpell(name, spell) {
    this.spells.set(name, spell);
  }

  /**
   * Get a spell by name
   * @param {string} name - The name of the spell
   * @returns {Object|null} The spell or null if not found
   */
  getSpell(name) {
    return this.spells.get(name) || null;
  }

  /**
   * Register an archetype in the runtime
   * @param {string} name - The name of the archetype
   * @param {Object} archetype - The archetype definition
   */
  registerArchetype(name, archetype) {
    this.archetypes.set(name, archetype);
  }

  /**
   * Get an archetype by name
   * @param {string} name - The name of the archetype
   * @returns {Object|null} The archetype or null if not found
   */
  getArchetype(name) {
    return this.archetypes.get(name) || null;
  }

  /**
   * Load a module
   * @param {string} name - The name of the module
   * @param {Object} module - The module to load
   */
  loadModule(name, module) {
    this.modules.set(name, module);
    // Initialize the module if it has an init function
    if (typeof module.init === 'function') {
      module.init(this);
    }
  }

  /**
   * Get a loaded module
   * @param {string} name - The name of the module
   * @returns {Object|null} The module or null if not found
   */
  getModule(name) {
    return this.modules.get(name) || null;
  }

  /**
   * Set a variable in the runtime context
   * @param {string} name - The name of the variable
   * @param {*} value - The value to set
   */
  setVariable(name, value) {
    this.context.variables.set(name, value);
  }

  /**
   * Get a variable from the runtime context
   * @param {string} name - The name of the variable
   * @returns {*|null} The variable value or null if not found
   */
  getVariable(name) {
    return this.context.variables.get(name) || null;
  }

  /**
   * Register a native function
   * @param {string} name - The name of the function
   * @param {Function} fn - The function to register
   */
  registerFunction(name, fn) {
    this.context.functions.set(name, fn);
  }

  /**
   * Get a registered function
   * @param {string} name - The name of the function
   * @returns {Function|null} The function or null if not found
   */
  getFunction(name) {
    return this.context.functions.get(name) || null;
  }

  /**
   * Register a custom type
   * @param {string} name - The name of the type
   * @param {Object} type - The type definition
   */
  registerType(name, type) {
    this.context.types.set(name, type);
  }

  /**
   * Get a registered type
   * @param {string} name - The name of the type
   * @returns {Object|null} The type or null if not found
   */
  getType(name) {
    return this.context.types.get(name) || null;
  }

  /**
   * Execute a spell by name
   * @param {string} name - The name of the spell to execute
   * @param {Array} args - Arguments to pass to the spell
   * @returns {Promise<*>} The result of the spell execution
   */
  async castSpell(name, args = []) {
    const spell = this.getSpell(name);
    if (!spell) {
      throw new Error(`Unknown spell: ${name}`);
    }
    return await spell.call(args);
  }

  /**
   * Initialize the runtime with built-in types and functions
   */
  initialize() {
    // Register built-in types
    this.registerType('string', {
      name: 'string',
      validate: (value) => typeof value === 'string'
    });

    this.registerType('number', {
      name: 'number',
      validate: (value) => typeof value === 'number' && !isNaN(value)
    });

    this.registerType('boolean', {
      name: 'boolean',
      validate: (value) => typeof value === 'boolean'
    });

    // Register built-in functions
    this.registerFunction('print', (...args) => {
      console.log(...args);
      return args.length === 1 ? args[0] : args;
    });

    this.registerFunction('length', (value) => {
      if (Array.isArray(value) || typeof value === 'string') {
        return value.length;
      }
      throw new Error('Cannot get length of non-iterable value');
    });
  }
}

module.exports = Runtime;
