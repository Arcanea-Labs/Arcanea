# New-Book.ps1
# Creates a new AOPS book from templates

param(
    [Parameter(Mandatory=$true)]
    [string]$BookId,
    
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [string]$Author = "Arcanean Author",
    [string]$Topic = "worldbuilding",
    [string]$OutputDir = (Join-Path $PSScriptRoot "..\books")
)

# Set variables for template processing
$templateDir = Join-Path $PSScriptRoot "..\templates\book"
$bookDir = Join-Path $OutputDir $BookId
$date = Get-Date -Format "yyyy-MM-dd"

# Create book directory structure
$dirs = @(
    "chapters/01-introduction/prompts",
    "chapters/02-getting-started/prompts",
    "assets/images",
    "styles"
)

foreach ($dir in $dirs) {
    $fullPath = Join-Path $bookDir $dir
    New-Item -ItemType Directory -Force -Path $fullPath | Out-Null
}

# Process template files
$templateFiles = Get-ChildItem -Path $templateDir -Recurse -File

foreach ($file in $templateFiles) {
    $relativePath = $file.FullName.Substring($templateDir.Length + 1)
    $outputPath = Join-Path $bookDir $relativePath
    
    # Create directory if it doesn't exist
    $outputDir = [System.IO.Path]::GetDirectoryName($outputPath)
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir | Out-Null
    }
    
    # Process template variables
    $content = Get-Content -Path $file.FullName -Raw
    
    # Replace template variables
    $content = $content -replace '\{\{BOOK_ID\}\}', $BookId
    $content = $content -replace '\{\{BOOK_TITLE\}\}', $Title
    $content = $content -replace '\{\{AUTHOR_NAME\}\}', $Author
    $content = $content -replace '\{\{BOOK_TOPIC\}\}', $Topic
    $content = $content -replace '\{\{CURRENT_DATE\}\}', $date
    $content = $content -replace '\{\{MAIN_TAG_1\}\', $Topic
    $content = $content -replace '\{\{MAIN_TAG_2\}\', "guide"
    
    # Save processed file
    $content | Out-File -FilePath $outputPath -Encoding utf8NoBOM
}

# Create a basic stylesheet
$cssContent = @"
/* Main Stylesheet for $Title */
:root {
    --primary-color: #4a6fa5;
    --secondary-color: #6b8cae;
    --background: #ffffff;
    --text: #333333;
    --accent: #ff6b6b;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--text);
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

h1, h2, h3, h4, h5, h6 {
    color: var(--primary-color);
    margin-top: 1.5em;
}

code {
    background: #f4f4f4;
    padding: 2px 5px;
    border-radius: 3px;
}

pre {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
}

blockquote {
    border-left: 4px solid var(--secondary-color);
    padding-left: 15px;
    margin-left: 0;
    color: #555;
    font-style: italic;
}

/* Print styles */
@media print {
    body {
        font-size: 12pt;
        line-height: 1.5;
    }
    
    nav, .no-print {
        display: none;
    }
}
"@

$cssPath = Join-Path $bookDir "styles\main.css"
$cssContent | Out-File -FilePath $cssPath -Encoding utf8NoBOM

# Create a sample prompt
$promptContent = @"
---
type: character
difficulty: 2
version: 1.0.0
tags: [character, backstory]
variables:
  character_name: "{{book.variables.main_character}}"
  location: "{{book.variables.world_name}}"
---
# Character Background: {{character_name}}

## Context
Create a detailed background for {{character_name}}, a resident of {{location}}.

## Instructions
1. Start with their early life
2. Describe a formative event
3. Explain their current motivations
4. Include a secret or hidden aspect

## Parameters
- **Tone**: [Heroic, Mysterious, Tragic, Humorous]
- **Length**: [Brief, Moderate, Detailed]
- **Style**: [Narrative, Bullet Points, Diary Entry]

## Example
```yaml
character_name: "Eldrin"
location: "The Shattered Isles"
```

## Notes
- Consider how the character fits into the larger world
- Include potential plot hooks
- Leave room for growth and change
"@

$promptPath = Join-Path $bookDir "chapters\01-introduction\prompts\sample-character.prompt.md"
$promptContent | Out-File -FilePath $promptPath -Encoding utf8NoBOM

Write-Host "✅ Created new book: $Title" -ForegroundColor Green
Write-Host "📁 Location: $bookDir" -ForegroundColor Cyan
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "1. Review and edit the content in $bookDir"
Write-Host "2. Add your own chapters and prompts"
Write-Host "3. Use the build script to generate outputs"

# Open the book directory in Explorer
explorer $bookDir
