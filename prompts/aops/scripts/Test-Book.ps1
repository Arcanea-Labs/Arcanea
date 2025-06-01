# Test-Book.ps1
# Validates an AOPS book against the standard structure and requirements

param(
    [Parameter(Mandatory=$true)]
    [string]$BookDir,
    
    [switch]$Fix,
    [switch]$Verbose
)

# ANSI color codes
$colors = @{
    Reset = "`e[0m"
    Red = "`e[91m"
    Green = "`e[92m"
    Yellow = "`e[93m"
    Blue = "`e[94m"
    Magenta = "`e[95m"
    Cyan = "`e[96m"
}

function Write-Status {
    param(
        [string]$Message,
        [string]$Status = "INFO",
        [string]$Color = "Cyan"
    )
    
    $statusMap = @{
        "PASS" = "${Green}✓${Reset} "
        "FAIL" = "${Red}✗${Reset} "
        "WARN" = "${Yellow}⚠ ${Reset}"
        "INFO" = "${Blue}ℹ ${Reset}"
        "FIX" = "${Magenta}🔧${Reset} "
    }
    
    $statusIcon = $statusMap[$Status] ?? ""
    $messageColor = $colors[$Color] ?? $colors["Cyan"]
    
    Write-Host "${statusIcon}${messageColor}${Message}${colors.Reset}"
}

function Test-FileExists {
    param([string]$Path, [string]$Description)
    
    $exists = Test-Path -Path $Path
    
    if ($exists) {
        Write-Status -Message "Found $Description" -Status "PASS"
        return $true
    } else {
        Write-Status -Message "Missing $Description" -Status "FAIL"
        return $false
    }
}

function Test-YamlContent {
    param([string]$Path, [string]$Description)
    
    if (-not (Test-Path $Path)) {
        Write-Status -Message "$Description not found" -Status "FAIL"
        return $false
    }
    
    try {
        $content = Get-Content -Path $Path -Raw
        if ($content -match '^---\s*\n') {
            Write-Status -Message "$Description has valid YAML frontmatter" -Status "PASS"
            return $true
        } else {
            Write-Status -Message "$Description is missing YAML frontmatter" -Status "FAIL"
            return $false
        }
    } catch {
        Write-Status -Message "Error reading $Description: $_" -Status "FAIL"
        return $false
    }
}

function Test-RequiredFields {
    param([string]$Path, [string[]]$RequiredFields, [string]$Description)
    
    if (-not (Test-Path $Path)) {
        return $false
    }
    
    $content = Get-Content -Path $Path -Raw
    $missing = @()
    
    foreach ($field in $RequiredFields) {
        if ($content -notmatch "$field:\s") {
            $missing += $field
        }
    }
    
    if ($missing.Count -eq 0) {
        Write-Status -Message "$Description has all required fields" -Status "PASS"
        return $true
    } else {
        Write-Status -Message "$Description is missing required fields: $($missing -join ', ')" -Status "FAIL"
        return $false
    }
}

function Test-ChapterStructure {
    param([string]$ChapterDir)
    
    $chapterName = Split-Path $ChapterDir -Leaf
    $valid = $true
    
    Write-Host "\n${colors.Cyan}== Testing Chapter: $chapterName ==${colors.Reset}"
    
    # Check for content.md
    if (-not (Test-FileExists -Path "$ChapterDir\content.md" -Description "$chapterName content")) {
        $valid = $false
    } else {
        # Check for YAML frontmatter in content.md
        if (-not (Test-YamlContent -Path "$ChapterDir\content.md" -Description "$chapterName content")) {
            $valid = $false
        }
        
        # Check for required fields
        $requiredFields = @('title', 'summary', 'difficulty')
        if (-not (Test-RequiredFields -Path "$ChapterDir\content.md" -RequiredFields $requiredFields -Description "$chapterName content")) {
            $valid = $false
        }
    }
    
    # Check prompts directory
    $promptsDir = Join-Path $ChapterDir "prompts"
    if (Test-Path $promptsDir) {
        $promptFiles = Get-ChildItem -Path $promptsDir -Filter "*.prompt.md"
        
        if ($promptFiles.Count -eq 0) {
            Write-Status -Message "No prompt files found in $chapterName" -Status "WARN"
        } else {
            Write-Status -Message "Found $($promptFiles.Count) prompt(s) in $chapterName" -Status "PASS"
            
            # Test each prompt
            foreach ($prompt in $promptFiles) {
                Test-YamlContent -Path $prompt.FullName -Description "Prompt: $($prompt.Name)" | Out-Null
                
                $requiredPromptFields = @('type', 'difficulty', 'version')
                Test-RequiredFields -Path $prompt.FullName -RequiredFields $requiredPromptFields -Description "Prompt: $($prompt.Name)" | Out-Null
            }
        }
    } else {
        Write-Status -Message "No prompts directory found in $chapterName" -Status "WARN"
    }
    
    return $valid
}

# Main execution
Write-Host "\n${colors.Cyan}=== AOPS Book Validator ===${colors.Reset}\n"
Write-Status -Message "Validating book at: $BookDir" -Status "INFO"

# Check if book directory exists
if (-not (Test-Path $BookDir)) {
    Write-Status -Message "Book directory not found: $BookDir" -Status "FAIL"
    exit 1
}

$bookValid = $true

# 1. Check meta.yaml
Write-Host "\n${colors.Cyan}== Testing Book Metadata ==${colors.Reset}"
if (-not (Test-FileExists -Path "$BookDir\meta.yaml" -Description "Book metadata")) {
    $bookValid = $false
} else {
    $requiredMetaFields = @('book.id', 'book.title', 'book.version', 'book.authors', 'book.language')
    if (-not (Test-RequiredFields -Path "$BookDir\meta.yaml" -RequiredFields $requiredMetaFields -Description "Book metadata")) {
        $bookValid = $false
    }
}

# 2. Check chapters
Write-Host "\n${colors.Cyan}== Testing Chapter Structure ==${colors.Reset}"
$chapterDirs = Get-ChildItem -Path "$BookDir\chapters" -Directory | Sort-Object Name
$validChapters = 0

if ($chapterDirs.Count -eq 0) {
    Write-Status -Message "No chapters found in the book" -Status "FAIL"
    $bookValid = $false
} else {
    foreach ($chapterDir in $chapterDirs) {
        if (Test-ChapterStructure -ChapterDir $chapterDir.FullName) {
            $validChapters++
        } else {
            $bookValid = $false
        }
    }
    
    Write-Status -Message "Validated $validChapters/$($chapterDirs.Count) chapters" -Status "INFO"
}

# 3. Check assets
Write-Host "\n${colors.Cyan}== Testing Assets ==${colors.Reset}"
$assetsDir = Join-Path $BookDir "assets"
if (-not (Test-Path $assetsDir)) {
    Write-Status -Message "No assets directory found" -Status "WARN"
} else {
    $assetCount = (Get-ChildItem -Path $assetsDir -Recurse -File).Count
    if ($assetCount -eq 0) {
        Write-Status -Message "No assets found in assets directory" -Status "WARN"
    } else {
        Write-Status -Message "Found $assetCount asset(s)" -Status "PASS"
    }
}

# 4. Check styles
Write-Host "\n${colors.Cyan}== Testing Styles ==${colors.Reset}"
$stylesDir = Join-Path $BookDir "styles"
if (-not (Test-Path $stylesDir)) {
    Write-Status -Message "No styles directory found" -Status "WARN"
} else {
    $cssFiles = Get-ChildItem -Path $stylesDir -Filter "*.css"
    if ($cssFiles.Count -eq 0) {
        Write-Status -Message "No CSS files found in styles directory" -Status "WARN"
    } else {
        Write-Status -Message "Found $($cssFiles.Count) CSS file(s)" -Status "PASS"
    }
}

# Summary
Write-Host "\n${colors.Cyan}=== Validation Summary ===${colors.Reset}"
if ($bookValid) {
    Write-Status -Message "✅ Book validation PASSED" -Status "PASS" -Color "Green"
    exit 0
} else {
    Write-Status -Message "❌ Book validation FAILED" -Status "FAIL" -Color "Red"
    
    if ($Fix) {
        Write-Host "\n${colors.Yellow}Attempting to fix issues...${colors.Reset}"
        # Add automatic fixes here
        Write-Status -Message "Please review the issues above and fix them manually" -Status "WARN"
    }
    
    exit 1
}
