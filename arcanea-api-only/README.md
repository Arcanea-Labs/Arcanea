# Arcanea API Gateway

This folder sketches a possible layout for the core API service. It includes a FastAPI gateway that routes "spells" to different provider integrations and a fork of OpenWebUI for the user interface.

```
arcanea/
├─ .env.example          # API keys ONLY, no model weights
├─ providers.yml         # map "chat" -> "openai", "image" -> "stability"
├─ gateway/              # FastAPI; parses Arcanea spell -> provider call
│   └─ routes.py
├─ integrations/         # thin wrappers around each vendor
│   ├─ openai.py
│   ├─ stability.py
│   ├─ luma.py
│   ├─ suno.py
│   └─ elevenlabs.py
├─ ui/arcanea-webui/     # OpenWebUI fork (git submodule)
├─ agents/               # Luminor JSON personas
├─ prompts/              # Spell libraries (.arc)
└─ docker-compose.yaml
```

This is only a plan; none of these components are implemented yet.

