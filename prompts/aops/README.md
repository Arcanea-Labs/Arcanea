# 🏰 Arcanean Omnimedia Prompt System (AOPS)

A revolutionary system for creating, managing, and publishing interactive prompt books across multiple formats.

## 🌟 Core Features

- **Multi-Format Publishing**: Single-source publishing to web, PDF, ePub, and print
- **Version Control**: Track changes and maintain history of all prompt books
- **AI Integration**: Optimized for both human creators and AI systems
- **Modular Design**: Mix and match content modules
- **Augmented Reality**: Optional AR features for physical editions

## 🏗️ Directory Structure

```
aops/
├── books/              # Individual prompt books
├── templates/          # Templates for books and modules
├── tools/              # Conversion and build tools
├── docs/               # System documentation
├── output/             # Generated output files
│   ├── web/           # Web-ready content
│   ├── pdf/           # PDF exports
│   ├── epub/          # eBook formats
│   └── print/         # Print-ready files
├── scripts/            # Build and automation scripts
└── assets/             # Media and styling
    ├── images/
    ├── styles/
    └── fonts/
```

## 🚀 Getting Started

1. **Create a New Book**
   ```bash
   cd scripts
   .\new-book.ps1 "My Awesome Prompt Book"
   ```

2. **Build Outputs**
   ```bash
   cd scripts
   .\build.ps1 --format all
   ```

## 📚 Documentation

- [System Overview](docs/system-overview.md)
- [Book Format Specification](docs/book-format.md)
- [Template Guide](docs/templates.md)
- [Publishing Workflow](docs/publishing.md)
- [API Reference](docs/api.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.
