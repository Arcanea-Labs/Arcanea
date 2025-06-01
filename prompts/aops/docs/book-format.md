# 📘 Book Format Specification

## 1. Directory Structure

Each book follows this standard structure:

```
book-title/
├── meta.yaml           # Book metadata
├── README.md           # Book introduction
├── chapters/           # Book content
│   ├── 01-chapter-1/
│   │   ├── content.md
│   │   ├── prompts/    # Individual prompts
│   │   └── assets/     # Chapter-specific assets
├── assets/             # Global book assets
│   ├── images/
│   ├── audio/
│   └── data/
└── templates/          # Custom templates (optional)
```

## 2. Metadata (meta.yaml)

```yaml
---
# Required Fields
book:
  id: unique-book-identifier
  title: "Book Title"
  subtitle: "Optional Subtitle"
  version: 1.0.0
  authors:
    - name: "Author Name"
      role: "Author"
  language: en
  description: >
    A brief description of the book's purpose and content.
  
# Optional Fields
  publisher: "Publisher Name"
  publication_date: 2025-06-01
  cover_image: assets/cover.jpg
  tags: [tag1, tag2, tag3]
  license: CC-BY-NC-ND-4.0
  series:
    name: "Series Name"
    position: 1
    total: 3

# Build Configuration
build:
  formats: [web, pdf, epub, print]  # Output formats
  stylesheet: styles/main.css        # Custom styles
  template: default                 # Base template
  output_dir: ../../output          # Relative to book dir
  assets_dir: assets                # Assets directory
  
  # Format-specific settings
  web:
    base_url: /books/book-id/
    seo: true
  
  pdf:
    paper_size: A5
    font_size: 11pt
    
  epub:
    cover_image: assets/cover.jpg
    
  print:
    bleed: 3mm
    crop_marks: true

# AR Features (Optional)
ar:
  enabled: true
  features:
    - 3d_models
    - audio_clips
    - interactive_maps
  qr_codes:
    position: bottom-right
    size: 15mm

# Table of Contents
toc:
  - title: "Introduction"
    file: "chapters/01-introduction/content.md"
    children:
      - title: "Getting Started"
        file: "chapters/01-introduction/getting-started.md"
  - title: "Chapter 1"
    file: "chapters/02-chapter-1/content.md"

# Custom Variables
variables:
  character_name: "Aelar"
  location: "The Shattered Isles"
  year: 1247
---
```

## 3. Chapter Format

Each chapter is a directory containing:

- `content.md` - Main chapter content
- `prompts/` - Individual prompt files
- `assets/` - Chapter-specific assets

### 3.1 Chapter Metadata

At the top of each `content.md`:

```yaml
---
title: "Chapter Title"
summary: "Brief chapter summary"
difficulty: beginner|intermediate|advanced
duration: "30m"  # Estimated reading time
prerequisites:
  - "chapter-1"
  - "basic-knowledge"
tags: [tag1, tag2]
vars:
  custom_var: "value"
---
```

## 4. Prompt Format

Prompt files (`.prompt.md`):

```yaml
---
type: character|world|item|scene|dialogue
difficulty: 1-5
version: 1.0.0
tags: [fantasy, character, backstory]
prerequisites: []
variables:
  character_name: "Aelar"
  location: "The Shattered Isles"
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
- **Perspective**: [First Person, Second Person, Third Person]

## Examples
```markdown
### Input
{"name": "Eldrin", "race": "Elf"}

### Output
Eldrin, a silver-haired elf from the ancient forests of...
```

## Variations
- Variation 1: [Description]
- Variation 2: [Description]

## Notes
Additional information and tips.
```

## 5. Asset Management

### 5.1 Images
- Store in `assets/images/`
- Supported formats: JPG, PNG, SVG, WebP
- Recommended size: 1200px width for web
- Include alt text and captions

### 5.2 Audio
- Store in `assets/audio/`
- Supported formats: MP3, OGG, WAV
- Include transcripts

## 6. Linking System

### 6.1 Cross-References
```markdown
[Link to chapter](chapter:01-introduction)
[Link to prompt](prompt:character-background)
[Link to asset](asset:images/map.png)
```

### 6.2 Variables
Use `{{variable_name}}` for dynamic content.

## 7. Version Control

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Document changes in CHANGELOG.md
- Tag releases in Git

## 8. Best Practices

1. **Naming Conventions**
   - Use kebab-case for filenames
   - Be descriptive but concise
   - Avoid special characters

2. **Content Organization**
   - Keep chapters focused
   - Use clear headings
   - Include summaries

3. **Accessibility**
   - Add alt text to images
   - Use semantic HTML
   - Ensure color contrast

## 9. Validation

Run the validation script:
```bash
npm run validate-book -- path/to/book
```

Checks:
- Required files exist
- Links are valid
- Images have alt text
- Metadata is complete
- Variables are defined

## 10. Templates

Create custom templates in the `templates/` directory:
- `chapter.md` - Chapter template
- `prompt.md` - Prompt template
- `character.md` - Character template

## 11. Internationalization

For multi-language support:
```
book-title/
├── en/              # English version
├── es/              # Spanish version
└── ja/              # Japanese version
```

## 12. Examples

See the `examples/` directory for complete book examples.

---
*Last Updated: May 2025*
