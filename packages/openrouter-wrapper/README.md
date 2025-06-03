# OpenRouter Wrapper

A tiny client for interacting with the OpenRouter API used by Arcanea. It reads
configuration from environment variables.

## Usage

```
import { createClient } from '@arcanea/openrouter-wrapper'
const client = createClient()
```

Set `CLAUDE_API_KEY` in your `.env` file.

## Testing

Run the package tests from the repo root:

```
pnpm test packages/openrouter-wrapper
```

