# Starlight Intelligence Integration

The `Starlight-Intelligence-System` repository hosts agent logic and experiments that complement this codebase. Arcanea will likely consume those agents through APIs or as a git submodule.

## Keeping External Forks Updated

For UI layers like OpenWebUI or BIG-AGI, we plan to fork the upstream project and include it here as a submodule. To pull upstream fixes:

```
cd ui/open-webui
git fetch upstream
git merge upstream/main
```

Documentation will be updated once the integration stabilizes.

