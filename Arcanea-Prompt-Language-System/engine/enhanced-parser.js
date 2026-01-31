/**
 * Enhanced Arcanea Parser v2.0
 * 
 * Supports characters, worlds, and complex ecosystem structures
 * Fully integrated with Guardian agents and AI systems
 */

const TokenType = {
  // Symbols
  AT: 'AT',
  LEFT_BRACE: 'LEFT_BRACE',
  RIGHT_BRACE: 'RIGHT_BRACE',
  LEFT_BRACKET: 'LEFT_BRACKET',
  RIGHT_BRACKET: 'RIGHT_BRACKET',
  LEFT_PAREN: 'LEFT_PAREN',
  RIGHT_PAREN: 'RIGHT_PAREN',
  COLON: 'COLON',
  DOUBLE_COLON: 'DOUBLE_COLON',
  COMMA: 'COMMA',
  DOUBLE_QUOTE: 'DOUBLE_QUOTE',
  HASH: 'HASH',
  
  // Literals
  IDENTIFIER: 'IDENTIFIER',
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  
  // Keywords
  SPELL: 'SPELL',
  CHARACTER: 'CHARACTER',
  WORLD: 'WORLD',
  ARCHETYPE: 'ARCHETYPE',
  PRIMORDIAL: 'PRIMORDIAL',
  MODIFIER: 'MODIFIER',
  DIRECTION: 'DIRECTION',
  PATTERN: 'PATTERN',
  DESCRIPTION: 'DESCRIPTION',
  PARAMETERS: 'PARAMETERS',
  EXAMPLE: 'EXAMPLE',
  IMPLEMENTATION: 'IMPLEMENTATION',
  DATA: 'DATA',
  BACKSTORY: 'BACKSTORY',
  RELATIONSHIPS: 'RELATIONSHIPS',
  ARC_SPELLS: 'ARC_SPELLS',
  
  // Special
  NEWLINE: 'NEWLINE',
  EOF: 'EOF'
};

class Token {
  constructor(type, lexeme, literal, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString() {
    return `${this.type} ${this.lexeme}`;
  }
}

class Scanner {
  constructor(source) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    
    this.tokens.push(new Token(TokenType.EOF, '', null, this.line));
    return this.tokens;
  }

  scanToken() {
    const c = this.advance();
    
    switch (c) {
      case '@': this.addToken(TokenType.AT); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_BRACE); break;
      case '[': this.addToken(TokenType.LEFT_BRACKET); break;
      case ']': this.addToken(TokenType.RIGHT_BRACKET); break;
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case ':':
        this.addToken(this.match(':') ? TokenType.DOUBLE_COLON : TokenType.COLON);
        break;
      case ',': this.addToken(TokenType.COMMA); break;
      case '"': this.string(); break;
      case '#': this.addToken(TokenType.HASH); break;
      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n':
        this.line++;
        this.addToken(TokenType.NEWLINE);
        break;
      
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          throw new Error(`Unexpected character '${c}' at line ${this.line}`);
        }
    }
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    
    const text = this.source.substring(this.start, this.current);
    let type = TokenType.IDENTIFIER;
    
    // Check for keywords
    switch (text) {
      case 'spell': type = TokenType.SPELL; break;
      case 'character': type = TokenType.CHARACTER; break;
      case 'world': type = TokenType.WORLD; break;
      case 'archetype': type = TokenType.ARCHETYPE; break;
      case 'primordial': type = TokenType.PRIMORDIAL; break;
      case 'modifier': type = TokenType.MODIFIER; break;
      case 'direction': type = TokenType.DIRECTION; break;
      case 'pattern': type = TokenType.PATTERN; break;
      case 'description': type = TokenType.DESCRIPTION; break;
      case 'parameters': type = TokenType.PARAMETERS; break;
      case 'example': type = TokenType.EXAMPLE; break;
      case 'implementation': type = TokenType.IMPLEMENTATION; break;
      case 'data': type = TokenType.DATA; break;
      case 'backstory': type = TokenType.BACKSTORY; break;
      case 'relationships': type = TokenType.RELATIONSHIPS; break;
      case 'arc_spells': type = TokenType.ARC_SPELLS; break;
      case 'true': type = TokenType.BOOLEAN; break;
      case 'false': type = TokenType.BOOLEAN; break;
    }
    
    this.addToken(type);
  }

  number() {
    while (this.isDigit(this.peek())) this.advance();
    
    // Look for decimal point
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance();
      while (this.isDigit(this.peek())) this.advance();
    }
    
    const value = parseFloat(this.source.substring(this.start, this.current));
    this.addTokenLiteral(TokenType.NUMBER, value);
  }

  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      this.advance();
    }
    
    if (this.isAtEnd()) {
      throw new Error(`Unterminated string at line ${this.line}`);
    }
    
    this.advance(); // Closing quote
    
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addTokenLiteral(TokenType.STRING, value);
  }

  match(expected) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    
    this.current++;
    return true;
  }

  peek() {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  advance() {
    this.current++;
    return this.source.charAt(this.current - 1);
  }

  isAlpha(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }

  isAlphaNumeric(c) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  isDigit(c) {
    return c >= '0' && c <= '9';
  }

  addToken(type) {
    this.addTokenLiteral(type, null);
  }

  addTokenLiteral(type, literal) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }
}

class Parser {
  constructor() {
    this.tokens = [];
    this.current = 0;
    this.errors = [];
  }

  parse(tokens) {
    this.tokens = tokens;
    this.current = 0;
    this.errors = [];
    
    const statements = [];
    while (!this.isAtEnd()) {
      const stmt = this.declaration();
      if (stmt) statements.push(stmt);
    }
    
    return {
      type: 'Program',
      body: statements,
      errors: this.errors
    };
  }

  declaration() {
    try {
      if (this.match(TokenType.AT)) {
        if (this.check(TokenType.SPELL)) return this.spellDeclaration();
        if (this.check(TokenType.CHARACTER)) return this.characterDeclaration();
        if (this.check(TokenType.WORLD)) return this.worldDeclaration();
        if (this.check(TokenType.ARCHETYPE)) return this.archetypeDeclaration();
        if (this.check(TokenType.PRIMORDIAL)) return this.primordialDeclaration();
        if (this.check(TokenType.MODIFIER)) return this.modifierDeclaration();
        if (this.check(TokenType.DIRECTION)) return this.directionDeclaration();
        if (this.check(TokenType.PATTERN)) return this.patternDeclaration();
      }
      return this.statement();
    } catch (error) {
      this.synchronize();
      return null;
    }
  }

  spellDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expect spell name after @spell.');
    
    const description = this.parseOptionalDescription();
    const archetypes = this.parseOptionalArchetypes();
    const parameters = this.parseOptionalParameters();
    const example = this.parseOptionalExample();
    
    this.consume(TokenType.IMPLEMENTATION, 'Expect @implementation after spell declaration.');
    const implementation = this.consume(TokenType.STRING, 'Expect implementation string.');
    
    return {
      type: 'SpellDeclaration',
      name: name.lexeme,
      description: description?.literal || '',
      archetypes: archetypes || [],
      parameters: parameters || {},
      example: example || '',
      implementation: implementation.literal,
      line: name.line
    };
  }

  characterDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expect character name after @character.');
    
    const archetype = this.parseOptionalArchetypeAssignment();
    const elementalAlignment = this.parseOptionalElementalAlignment();
    const data = this.parseOptionalData();
    
    const backstory = this.parseOptionalBackstory();
    const relationships = this.parseOptionalRelationships();
    const arcSpells = this.parseOptionalArcSpells();
    
    return {
      type: 'CharacterDeclaration',
      name: name.lexeme,
      archetype: archetype?.literal || '',
      elementalAlignment: elementalAlignment || [],
      data: data || {},
      backstory: backstory?.literal || '',
      relationships: relationships || [],
      arcSpells: arcSpells || [],
      line: name.line
    };
  }

  worldDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expect world name after @world.');
    
    const cosmology = this.parseOptionalCosmology();
    const geography = this.parseOptionalGeography();
    const cultures = this.parseOptionalCultures();
    const history = this.parseOptionalHistory();
    
    return {
      type: 'WorldDeclaration',
      name: name.lexeme,
      cosmology: cosmology || {},
      geography: geography || {},
      cultures: cultures || [],
      history: history || [],
      line: name.line
    };
  }

  archetypeDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expect archetype name after @archetype.');
    this.consume(TokenType.DOUBLE_COLON, 'Expect :: after archetype name.');
    const description = this.consume(TokenType.STRING, 'Expect description after ::');
    
    return {
      type: 'ArchetypeDeclaration',
      name: name.lexeme,
      description: description.literal,
      line: name.line
    };
  }

  // Helper parsing methods
  parseOptionalDescription() {
    if (this.check(TokenType.AT) && this.peekNext().type === TokenType.DESCRIPTION) {
      this.advance(); // @
      this.advance(); // description
      this.consume(TokenType.STRING, 'Expect description string.');
      return this.previous();
    }
    return null;
  }

  parseOptionalArchetypes() {
    if (this.check(TokenType.AT) && this.peekNext().type === TokenType.ARCHETYPES) {
      this.advance(); // @
      this.advance(); // archetypes
      this.consume(TokenType.LEFT_BRACKET, 'Expect [ after @archetypes.');
      
      const archetypes = [];
      while (!this.check(TokenType.RIGHT_BRACKET) && !this.isAtEnd()) {
        archetypes.push(this.consume(TokenType.IDENTIFIER, 'Expect archetype name.').lexeme);
        if (!this.check(TokenType.RIGHT_BRACKET)) {
          this.consume(TokenType.COMMA, 'Expect , between archetypes.');
        }
      }
      
      this.consume(TokenType.RIGHT_BRACKET, 'Expect ] after archetypes.');
      return archetypes;
    }
    return null;
  }

  parseOptionalParameters() {
    if (this.check(TokenType.AT) && this.peekNext().type === TokenType.PARAMETERS) {
      this.advance(); // @
      this.advance(); // parameters
      this.consume(TokenType.LEFT_BRACE, 'Expect { after @parameters.');
      
      // Parse JSON-like parameters object
      const parametersStr = this.jsonObject();
      try {
        return JSON.parse(parametersStr);
      } catch (e) {
        this.error(this.peek(), 'Invalid parameters JSON.');
        return {};
      }
    }
    return null;
  }

  parseOptionalExample() {
    if (this.check(TokenType.AT) && this.peekNext().type === TokenType.EXAMPLE) {
      this.advance(); // @
      this.advance(); // example
      this.consume(TokenType.STRING, 'Expect example string.');
      return this.previous().literal;
    }
    return null;
  }

  parseOptionalData() {
    if (this.check(TokenType.AT) && this.peekNext().type === TokenType.DATA) {
      this.advance(); // @
      this.advance(); // data
      this.consume(TokenType.LEFT_BRACE, 'Expect { after @data.');
      
      const dataStr = this.jsonObject();
      try {
        return JSON.parse(dataStr);
      } catch (e) {
        this.error(this.peek(), 'Invalid data JSON.');
        return {};
      }
    }
    return null;
  }

  parseOptionalBackstory() {
    if (this.check(TokenType.AT) && this.peekNext().type === TokenType.BACKSTORY) {
      this.advance(); // @
      this.advance(); // backstory
      this.consume(TokenType.STRING, 'Expect backstory string.');
      return this.previous();
    }
    return null;
  }

  parseOptionalRelationships() {
    if (this.check(TokenType.AT) && this.peekNext().type === TokenType.RELATIONSHIPS) {
      this.advance(); // @
      this.advance(); // relationships
      // Parse relationships as JSON array
      this.consume(TokenType.LEFT_BRACKET, 'Expect [ after @relationships.');
      const relationshipsStr = this.jsonArray();
      try {
        return JSON.parse(relationshipsStr);
      } catch (e) {
        this.error(this.peek(), 'Invalid relationships JSON.');
        return [];
      }
    }
    return null;
  }

  parseOptionalArcSpells() {
    if (this.check(TokenType.AT) && this.peekNext().type === TokenType.ARC_SPELLS) {
      this.advance(); // @
      this.advance(); // arc_spells
      // Parse arc spells as array of spell declarations
      const spells = [];
      while (!this.isAtEnd() && !this.check(TokenType.AT)) {
        const spell = this.statement();
        if (spell) spells.push(spell);
      }
      return spells;
    }
    return null;
  }

  jsonObject() {
    let depth = 1;
    const start = this.current;
    
    this.advance(); // Skip opening {
    while (depth > 0 && !this.isAtEnd()) {
      const token = this.advance();
      if (token.type === TokenType.LEFT_BRACE) depth++;
      if (token.type === TokenType.RIGHT_BRACE) depth--;
    }
    
    return this.source.substring(start, this.current - 1);
  }

  jsonArray() {
    let depth = 1;
    const start = this.current;
    
    this.advance(); // Skip opening [
    while (depth > 0 && !this.isAtEnd()) {
      const token = this.advance();
      if (token.type === TokenType.LEFT_BRACKET) depth++;
      if (token.type === TokenType.RIGHT_BRACKET) depth--;
    }
    
    return this.source.substring(start, this.current - 1);
  }

  statement() {
    // Skip to next @ declaration or end
    while (!this.isAtEnd() && !this.check(TokenType.AT)) {
      this.advance();
    }
    return null;
  }

  // Parser helper methods
  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  peekNext() {
    return this.tokens[this.current + 1];
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    
    const token = this.peek();
    this.error(token, message);
    throw new Error(`Parse error at line ${token.line}: ${message}`);
  }

  error(token, message) {
    this.errors.push({
      line: token.line,
      message: message,
      token: token.lexeme
    });
  }

  synchronize() {
    this.advance();
    
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.NEWLINE) return;
      
      if (this.peek().type === TokenType.AT) return;
      
      this.advance();
    }
  }
}

module.exports = {
  Parser,
  Scanner,
  TokenType
};