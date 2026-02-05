/**
 * Arcanea Interpreter
 * 
 * Executes the AST produced by the Parser
 */

class Interpreter {
  constructor() {
    this.environment = new Environment();
    this.globals = this.environment;
    this.runtime = null;
  }

  /**
   * Interpret an AST
   * @param {Object} ast - The Abstract Syntax Tree to interpret
   * @param {Object} runtime - The runtime environment
   * @returns {Promise<*>} - The result of interpretation
   */
  async interpret(ast, runtime) {
    this.runtime = runtime;
    try {
      const result = await this.evaluate(ast);
      return result;
    } catch (error) {
      console.error('Runtime error:', error);
      throw error;
    }
  }

  async evaluate(node) {
    // Handle different node types
    switch (node.type) {
      case 'Program':
        return this.evaluateProgram(node);
      case 'Spell':
        return this.evaluateSpell(node);
      case 'Archetype':
        return this.evaluateArchetype(node);
      case 'CallExpression':
        return this.evaluateCallExpression(node);
      // Add more cases as needed
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  async evaluateProgram(program) {
    let result = null;
    for (const statement of program.body) {
      result = await this.evaluate(statement);
    }
    return result;
  }

  async evaluateSpell(spell) {
    // Register the spell in the runtime
    this.runtime.registerSpell(spell.name, {
      node: spell,
      environment: this.environment,
      call: async (args) => {
        const previous = this.environment;
        try {
          this.environment = new Environment(this.environment);
          
          // Bind parameters
          for (let i = 0; i < spell.parameters.length; i++) {
            const paramName = spell.parameters[i].name;
            this.environment.define(paramName, args[i]);
          }

          // Execute spell body
          let result = null;
          for (const stmt of spell.body) {
            result = await this.evaluate(stmt);
          }
          
          return result;
        } finally {
          this.environment = previous;
        }
      }
    });
  }

  async evaluateArchetype(archetype) {
    // Register archetype in the runtime
    this.runtime.registerArchetype(archetype.name, {
      node: archetype,
      environment: this.environment,
      // Archetype specific methods...
    });
  }

  async evaluateCallExpression(node) {
    const callee = await this.evaluate(node.callee);
    const args = [];
    
    for (const arg of node.arguments) {
      args.push(await this.evaluate(arg));
    }

    if (typeof callee === 'function') {
      return callee.apply(null, args);
    } else if (callee && typeof callee.call === 'function') {
      return callee.call(args);
    }

    throw new Error(`Not callable: ${node.callee.name}`);
  }
}

class Environment {
  constructor(enclosing = null) {
    this.enclosing = enclosing;
    this.values = new Map();
  }

  define(name, value) {
    this.values.set(name, value);
  }

  get(name) {
    if (this.values.has(name.lexeme || name)) {
      return this.values.get(name.lexeme || name);
    }

    if (this.enclosing) return this.enclosing.get(name);
    throw new Error(`Undefined variable: ${name.lexeme || name}`);
  }

  assign(name, value) {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }

    if (this.enclosing) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new Error(`Undefined variable: ${name.lexeme}`);
  }
}

module.exports = Interpreter;
