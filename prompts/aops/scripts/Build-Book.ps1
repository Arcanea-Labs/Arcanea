# Build-Book.ps1
# Builds AOPS book into multiple output formats

param(
    [Parameter(Mandatory=$true)]
    [string]$BookDir,
    
    [ValidateSet('all', 'web', 'pdf', 'epub', 'print')]
    [string]$Format = 'all',
    
    [switch]$Watch,
    [string]$OutputDir
)

# Check if Pandoc is installed
function Test-Pandoc {
    try {
        $null = Get-Command pandoc -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Install Pandoc if not found
if (-not (Test-Pandoc)) {
    Write-Host "Pandoc is not installed. Installing via winget..." -ForegroundColor Yellow
    winget install --id=JohnMacFarlane.Pandoc -e
    
    if (-not (Test-Pandoc)) {
        Write-Error "Failed to install Pandoc. Please install it manually from https://pandoc.org/installing.html"
        exit 1
    }
}

# Load book metadata
$metaFile = Join-Path $BookDir "meta.yaml"
if (-not (Test-Path $metaFile)) {
    Write-Error "Book metadata file not found at $metaFile"
    exit 1
}

$metaContent = Get-Content -Path $metaFile -Raw
$meta = ConvertFrom-Yaml $metaContent

# Set output directory
if ([string]::IsNullOrEmpty($OutputDir)) {
    $OutputDir = $meta.build.output_dir
    if ([string]::IsNullOrEmpty($OutputDir)) {
        $OutputDir = Join-Path $BookDir "_output"
    }
}

# Create output directories
$formats = if ($Format -eq 'all') { @('web', 'pdf', 'epub', 'print') } else { @($Format) }
foreach ($format in $formats) {
    $dir = Join-Path $OutputDir $format
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# Function to build a single format
function Build-Format {
    param(
        [string]$Format,
        [string]$InputFile,
        [string]$OutputFile,
        [hashtable]$Variables
    )
    
    Write-Host "Building $Format..." -ForegroundColor Cyan
    
    $args = @(
        "--standalone",
        "--from=markdown+yaml_metadata_block",
        "--output=$OutputFile"
    )
    
    # Add format-specific arguments
    switch ($Format) {
        'pdf' {
            $args += @(
                "--pdf-engine=xelatex",
                "-V", "papersize:a5",
                "-V", "documentclass:book",
                "--toc",
                "--toc-depth=3"
            )
        }
        'epub' {
            $args += @(
                "--toc",
                "--toc-depth=2",
                "--epub-cover-image=$($meta.cover_image)"
            )
        }
        'web' {
            $args += @(
                "--to=html5",
                "--self-contained",
                "--css=$($meta.build.stylesheet)",
                "--metadata", "pagetitle=$($meta.book.title)"
            )
        }
    }
    
    # Add variables
    foreach ($key in $Variables.Keys) {
        $args += "-V"
        $args += "$key=$($Variables[$key])"
    }
    
    # Add input file
    $args += $InputFile
    
    # Run Pandoc
    $process = Start-Process -FilePath "pandoc" -ArgumentList $args -NoNewWindow -PassThru -Wait
    
    if ($process.ExitCode -eq 0) {
        Write-Host "✅ Successfully built $Format" -ForegroundColor Green
        Write-Host "   Output: $OutputFile" -ForegroundColor Cyan
    } else {
        Write-Error "Failed to build $Format format"
    }
}

# Build each format
foreach ($format in $formats) {
    $inputFile = Join-Path $BookDir "book.md"
    $outputFile = Join-Path $OutputDir $format "$($meta.book.id).$format"
    
    $vars = @{
        "title" = $meta.book.title
        "author" = ($meta.book.authors | ForEach-Object { $_.name }) -join "; "
        "date" = $meta.book.publication_date
    }
    
    Build-Format -Format $format -InputFile $inputFile -OutputFile $outputFile -Variables $vars
}

# Watch for changes if requested
if ($Watch) {
    Write-Host "Watching for changes in $BookDir..." -ForegroundColor Yellow
    
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $BookDir
    $watcher.IncludeSubdirectories = $true
    $watcher.EnableRaisingEvents = $true
    
    $action = {
        $path = $Event.SourceEventArgs.FullPath
        $changeType = $Event.SourceEventArgs.ChangeType
        
        Write-Host "`nDetected $changeType in $path" -ForegroundColor Yellow
        
        # Rebuild the book
        & "$PSScriptRoot\Build-Book.ps1" -BookDir $BookDir -Format $Format -OutputDir $OutputDir
    }
    
    $event = Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action
    $eventCreated = Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action
    $eventRenamed = Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $action
    
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    } finally {
        # Cleanup
        $event, $eventCreated, $eventRenamed | Unregister-Event
        $watcher.Dispose()
    }
}

# YAML parsing helper function
function ConvertFrom-Yaml {
    param([string]$Yaml)
    
    # Simple YAML to hashtable conversion
    $result = @{}
    $lines = $Yaml -split "`n" | Where-Object { $_ -match '\S' -and -not $_.StartsWith('#') }
    
    $currentKey = $null
    $nested = $null
    
    foreach ($line in $lines) {
        if ($line -match '^\s*([^:]+):\s*(.*)') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            if ($value -eq '') {
                # Start of a nested object
                $currentKey = $key
                $result[$currentKey] = @{}
                $nested = $result[$currentKey]
            } else {
                if ($nested -ne $null) {
                    $nested[$key] = $value
                } else {
                    $result[$key] = $value
                }
            }
        } elseif ($line -match '^\s*-\s*(.+)' -and $nested -ne $null) {
            # Handle arrays in YAML (simplified)
            if (-not $nested.ContainsKey('items')) {
                $nested['items'] = @()
            }
            $nested['items'] += $matches[1].Trim()
        }
    }
    
    return $result
}
