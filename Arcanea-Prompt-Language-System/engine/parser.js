/**
 * Arcanea Parser
 * 
 * Parses .arc files into an Abstract Syntax Tree (AST)
 */

class Parser {
  constructor() {
    this.position = 0;
    this.tokens = [];
  }

  /**
   * Parse Arcanea code into an AST
   * @param {string} source - The Arcanea source code
   * @returns {Object} - The AST
   */
  parse(source) {
    this.source = source;
    this.position = 0;
    this.tokens = this.tokenize(source);
    
    const ast = {
      type: 'Program',
      body: [],
      sourceType: 'script',
    };

    while (!this.isAtEnd()) {
      const declaration = this.parseDeclaration();
      if (declaration) {
        ast.body.push(declaration);
      }
    }

    return ast;
  }

  // Tokenization and parsing helper methods...
  tokenize(source) {
    // Simple tokenizer - will be expanded
    return source.split(/\s+/).filter(token => token.length > 0);
  }

  isAtEnd() {
    return this.position >= this.tokens.length;
  }

  parseDeclaration() {
    // Parse spell declarations, archetype definitions, etc.
    if (this.match('@spell')) return this.parseSpell();
    if (this.match('@archetype')) return this.parseArchetype();
    return null;
  }

  parseSpell() {
    const spell = {
      type: 'Spell',
      name: this.consume('IDENTIFIER', 'Expect spell name').value,
      parameters: [],
      body: [],
    };

    // Parse parameters if any
    if (this.match('(')) {
      do {
        if (this.check('IDENTIFIER')) {
          spell.parameters.push(this.advance().value);
        }
      } while (this.match(','));
      this.consume(')', 'Expect ")" after parameters');
    }

    // Parse spell body
    this.consume('{', 'Expect "{" before spell body');
    while (!this.check('}') && !this.isAtEnd()) {
      spell.body.push(this.parseStatement());
    }
    this.consume('}', 'Expect "}" after spell body');

    return spell;
  }

  parseArchetype() {
    // Similar to parseSpell but for archetypes
    return {
      type: 'Archetype',
      name: this.consume('IDENTIFIER', 'Expect archetype name').value,
      // Additional archetype parsing...
    };
  }

  // Helper methods for parsing...
  match(type) {
    if (this.check(type)) {
      this.advance();
      return true;
    }
    return false;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.position++;
    return this.previous();
  }

  peek() {
    return this.tokens[this.position];
  }

  previous() {
    return this.tokens[this.position - 1];
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(`[Line ${this.peek().line}] ${message}`);
  }
}

module.exports = Parser;
