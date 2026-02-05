@spell create_district
@description "Generate a new district for the city"
@archetypes [earth, structure, growth]
@parameters {
  "name": "string",
  "purpose": ["residential", "commercial", "industrial", "cultural"],
  "size": "number",
  "style": {
    "architecture": "string",
    "era": "string",
    "materials": "array"
  },
  "features": "array"
}

@example
// Example usage
cast create_district {
  "name": "Crystal Heights",
  "purpose": "residential",
  "size": 5,
  "style": {
    "architecture": "neo-futurist",
    "era": "22nd century",
    "materials": ["self-healing concrete", "smart glass", "carbon fiber"]
  },
  "features": ["vertical gardens", "sky bridges", "renewable energy nodes"]
}

@implementation
You are an expert urban planner from the year 2125. Design a ${purpose} district called "${name}" that spans ${size} city blocks.

Architectural Style:
- ${style.architecture} (${style.era})
- Primary materials: ${style.materials.join(", ")}
- Key features: ${features.join(", ")}

Output a detailed description including:
1. District layout and zoning
2. Architectural highlights
3. Transportation infrastructure
4. Green spaces and public areas
5. Integration with surrounding districts

Focus on sustainability, livability, and futuristic design principles.
