# AOPS Scripts

This directory contains PowerShell scripts for managing Arcanean Omnimedia Prompt System (AOPS) books.

## Available Scripts

### New-Book.ps1
Creates a new AOPS book from templates.

**Usage:**
```powershell
.\New-Book.ps1 -BookId "my-awesome-book" -Title "My Awesome Book" -Author "Your Name" -Topic "fantasy-worldbuilding"
```

**Parameters:**
- `-BookId`: Unique identifier for the book (lowercase, hyphenated)
- `-Title`: Display title of the book
- `-Author`: Author name (default: "Arcanean Author")
- `-Topic`: Main topic/category (default: "worldbuilding")
- `-OutputDir`: Output directory (default: `../books`)

### Build-Book.ps1
Builds a book into multiple output formats.

**Usage:**
```powershell
.\Build-Book.ps1 -BookDir "..\books\my-awesome-book" -Format all -Watch
```

**Parameters:**
- `-BookDir`: Path to the book directory
- `-Format`: Output format: `all`, `web`, `pdf`, `epub`, or `print` (default: `all`)
- `-Watch`: Watch for changes and rebuild automatically
- `-OutputDir`: Custom output directory (default: from book's meta.yaml)

## Prerequisites

- Windows PowerShell 5.1+ or PowerShell 7+
- [Pandoc](https://pandoc.org/installing.html) (will be installed automatically if missing)
- For PDF output: A LaTeX distribution like [MiKTeX](https://miktex.org/) or [TeX Live](https://www.tug.org/texlive/)

## Examples

1. Create a new book:
   ```powershell
   .\New-Book.ps1 -BookId "realms-unbound" -Title "Realms Unbound" -Author "Frank X" -Topic "fantasy-worldbuilding"
   ```

2. Build all formats:
   ```powershell
   .\Build-Book.ps1 -BookDir "..\books\realms-unbound" -Format all
   ```

3. Watch for changes during development:
   ```powershell
   .\Build-Book.ps1 -BookDir "..\books\realms-unbound" -Format web -Watch
   ```

## Output Files

Built files will be saved to the `_output` directory in the book folder by default, with this structure:

```
book-folder/
└── _output/
    ├── web/       # Web-optimized HTML
    ├── pdf/       # PDF version
    ├── epub/      # eBook format
    └── print/     # Print-ready files
```

## Troubleshooting

- **Pandoc not found**: Ensure Pandoc is installed and in your system PATH
- **LaTeX errors**: For PDF output, a LaTeX distribution must be installed
- **Permission issues**: Run PowerShell as Administrator if you encounter permission errors

## License

MIT License - See [LICENSE](../../LICENSE) for details.
