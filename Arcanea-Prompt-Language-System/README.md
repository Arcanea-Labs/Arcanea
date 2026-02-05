# Arcanea Prompt Language System

A magical language system for crafting powerful, reusable AI prompts and workflows. Inspired by arcane traditions and designed for the age of AI, Arcanea provides a structured way to create, share, and execute complex prompt-based operations.

## ✨ Features

- **Spell System**: Create reusable prompt templates called "spells" with parameters and structured output
- **Archetype-Based**: Build on a foundation of elemental archetypes for consistent theming
- **Type Safety**: Define and validate input/output types for your prompts
- **Composable**: Chain and combine spells to create complex workflows
- **Extensible**: Add custom functions and types to the runtime
- **Visual Editor**: Coming soon - create and edit spells through a visual interface

## 📚 Documentation

- [Language Specification](./docs/specs/language.md)
- [API Reference](./docs/specs/api.md)
- [Tutorials & Guides](./docs/guides/)
- [Example Spells](./examples/)

## 🚀 Quick Start

1. **Installation**
   ```bash
   npm install arcanea-prompt-engine
   ```

2. **Create your first spell** (`greeting.arc`):
   ```arc
   @spell greet
   @description "Generate a friendly greeting"
   @archetypes [air, communication]
   @parameters {
     "name": "string",
     "timeOfDay": ["morning", "afternoon", "evening"]
   }
   
   @implementation
   Create a ${timeOfDay} greeting for someone named ${name}. 
   Make it warm and personalized based on the time of day.
   ```

3. **Use the spell in your code**:
   ```javascript
   import { Arcanea } from 'arcanea-prompt-engine';
   
   const arcanea = new Arcanea();
   await arcanea.loadSpell('./greeting.arc');
   
   const greeting = await arcanea.cast('greet', {
     name: 'Alex',
     timeOfDay: 'afternoon'
   });
   
   console.log(greeting);
   // "Good afternoon, Alex! I hope you're having a wonderful day so far."
   ```

## 📂 Project Structure

```
arcanea-prompt-language/
├── engine/               # Core engine code
│   ├── parser.js         # Parses .arc files
│   ├── interpreter.js    # Executes spells
│   └── runtime.js        # Manages execution environment
├── prompts/              # Core spell definitions
│   ├── base_archetypes.arc
│   ├── city_spells.arc
│   ├── story_spells.arc
│   └── education_spells.arc
├── examples/             # Example implementations
│   ├── city/
│   ├── story/
│   └── education/
└── tests/               # Test suite
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

## 📜 License

MIT - See [LICENSE](LICENSE) for more information.

---

Crafted with ✨ by the Arcanea Project Team
