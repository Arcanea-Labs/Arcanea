# 🎓 AOPS User Guide

Welcome to the Arcanean Omnimedia Prompt System (AOPS)! This guide will help you create, manage, and publish interactive prompt books across multiple formats.

## 📚 Table of Contents

1. [Quick Start](#-quick-start)
2. [Core Concepts](#-core-concepts)
3. [Creating Books](#-creating-books)
4. [Working with Content](#-working-with-content)
5. [Building & Publishing](#-building--publishing)
6. [Advanced Features](#-advanced-features)
7. [Troubleshooting](#-troubleshooting)
8. [FAQ](#-frequently-asked-questions)

## ⚡ Quick Start

### Prerequisites
- Windows PowerShell 5.1+ or PowerShell 7+
- [Git](https://git-scm.com/)
- [Pandoc](https://pandoc.org/installing.html)
- [Node.js](https://nodejs.org/) (optional, for advanced features)

### Your First Book

1. **Clone the repository**
   ```bash
   git clone https://github.com/arcanean/aops.git
   cd aops
   ```

2. **Create a new book**
   ```powershell
   .\scripts\New-Book.ps1 -BookId "my-first-book" -Title "My First Book" -Author "Your Name"
   ```

3. **Edit the content**
   - Open the generated book in your favorite editor
   - Modify the markdown files in the `chapters` directory
   - Add your prompts in the `prompts` subdirectories

4. **Build your book**
   ```powershell
   .\scripts\Build-Book.ps1 -BookDir "books\my-first-book" -Format all
   ```

5. **View the output**
   - Find your built files in `books\my-first-book\_output`

## 🧠 Core Concepts

### The Three-Layer Architecture

1. **Core Layer**
   - Markdown and YAML files
   - Version controlled
   - Machine-readable

2. **Human Layer**
   - Web, PDF, ePub, Print
   - Optimized for reading
   - Accessible formats

3. **AR Layer**
   - Augmented reality features
   - Interactive elements
   - Digital enhancements

### Book Structure

```
book-id/
├── meta.yaml           # Book metadata
├── chapters/           # Book content
│   ├── 01-intro/      # Chapter 1
│   │   ├── content.md
│   │   └── prompts/
│   └── 02-next/        # Chapter 2
├── assets/             # Images, audio, etc.
│   └── images/
└── styles/            # Custom styles
    └── main.css
```

## 📖 Creating Books

### Using the New-Book Script

```powershell
.\scripts\New-Book.ps1 \
    -BookId "unique-id" \
    -Title "Book Title" \
    -Author "Your Name" \
    -Topic "fantasy-worldbuilding" \
    -OutputDir "path\to\books"
```

### Book Metadata

Edit `meta.yaml` to customize:
- Title, author, description
- Version and publication date
- Build settings
- Custom variables

### Organizing Content

1. **Chapters**
   - One directory per chapter
   - Numbered for ordering (01-, 02-, etc.)
   - Each contains a `content.md` file

2. **Prompts**
   - Stored in chapter `prompts` directories
   - Use `.prompt.md` extension
   - Include YAML frontmatter

## ✍️ Working with Content

### Markdown Basics

AOPS uses extended Markdown with these features:

```markdown
# Heading 1
## Heading 2

**Bold** and *italic* text

- Bullet points
- Another item

1. Numbered
2. List

> Blockquotes for important notes

`Inline code` and code blocks:

```python
def hello():
    print("Hello, world!")
```

### YAML Frontmatter

All content files should start with YAML frontmatter:

```yaml
---
title: "Chapter Title"
summary: "Brief description"
difficulty: beginner|intermediate|advanced
duration: "30m"
tags: [tag1, tag2, tutorial]
variables:
  character: "Aelar"
  location: "Shattered Isles"
---
```

### Prompts

Create prompt files (`.prompt.md`) with this structure:

```yaml
---
type: character|world|item|scene|dialogue
difficulty: 1-5
version: 1.0.0
tags: [fantasy, character, backstory]
variables:
  character_name: "{{book.variables.main_character}}"
  location: "{{book.variables.world_name}}"
---
# Prompt Title

## Context
Background information and setup.

## Instructions
1. Step one
2. Step two
3. Step three

## Parameters
- **Tone**: [Descriptive, Mysterious, Humorous]
- **Length**: [Short, Medium, Long]
- **Perspective**: [First, Second, Third Person]
```

## 🏗️ Building & Publishing

### Building Your Book

```powershell
# Build all formats
.\scripts\Build-Book.ps1 -BookDir "books\my-book" -Format all

# Build specific format
.\scripts\Build-Book.ps1 -BookDir "books\my-book" -Format web

# Watch for changes
.\scripts\Build-Book.ps1 -BookDir "books\my-book" -Format web -Watch
```

### Output Formats

- **Web**: HTML files with navigation
- **PDF**: Print-ready PDF documents
- **ePub**: eBook format
- **Print**: High-quality print layout

### Publishing Options

1. **Web Hosting**
   - Deploy to GitHub Pages
   - Use Netlify or Vercel
   - Self-host on your server

2. **eBook Stores**
   - Amazon KDP
   - Apple Books
   - Google Play Books

3. **Print on Demand**
   - Lulu
   - Blurb
   - Amazon KDP Print

## 🚀 Advanced Features

### Custom Templates

Create custom templates in the `templates` directory:

```
book-id/
└── templates/
    ├── chapter.html    # Chapter template
    ├── prompt.html     # Prompt template
    └── styles/
        └── custom.css  # Custom styles
```

### Variables

Use variables in your content:

```markdown
Welcome to {{book.variables.world_name}}!

Meet {{character_name}}, a brave adventurer.
```

### Plugins

Extend functionality with plugins:

1. **Interactive Elements**
   - Quizzes
   - Character sheets
   - Interactive maps

2. **Analytics**
   - Track engagement
   - Monitor prompt usage
   - Gather feedback

3. **AI Integration**
   - Generate content
   - Suggest improvements
   - Automate testing

## 🛠️ Troubleshooting

### Common Issues

1. **Pandoc not found**
   - Install Pandoc from https://pandoc.org/installing.html
   - Ensure it's in your system PATH

2. **LaTeX errors (PDF output)**
   - Install a LaTeX distribution (MiKTeX or TeX Live)
   - Run with `-Verbose` for detailed errors

3. **Missing dependencies**
   ```powershell
   # Install required modules
   Install-Module -Name PSScriptAnalyzer -Scope CurrentUser -Force
   ```

### Getting Help

1. Check the [FAQ](#-frequently-asked-questions)
2. Search the [GitHub issues](https://github.com/arcanean/aops/issues)
3. Join our [Discord community](https://discord.gg/arcanean)

## ❓ Frequently Asked Questions

### How do I update an existing book?

1. Make your changes to the markdown files
2. Update the version in `meta.yaml`
3. Rebuild with `Build-Book.ps1`

### Can I use this for non-fantasy content?

Absolutely! AOPS is genre-agnostic and works for any type of content:
- Technical documentation
- Educational materials
- Business templates
- Creative writing

### How do I contribute to AOPS?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Is there a GUI version?

Not yet, but we're working on a web-based editor. For now, any text editor works great with the command-line tools.

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with ❤️ by the Arcanean community
- Powered by [Pandoc](https://pandoc.org/)
- Inspired by modern publishing workflows

---
*Last Updated: May 2025*
