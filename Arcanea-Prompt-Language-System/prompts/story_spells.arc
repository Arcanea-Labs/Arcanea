@spell generate_story
@description "Generate a story based on provided elements"
@archetypes [air, creativity, narrative]
@parameters {
  "genre": ["fantasy", "sci-fi", "mystery", "romance", "historical"],
  "setting": "string",
  "characters": [{
    "name": "string",
    "role": "string",
    "traits": "array"
  }],
  "plot_points": "array",
  "tone": ["epic", "intimate", "humorous", "dark", "hopeful"],
  "length": ["flash", "short", "novelette", "novella", "novel"]
}

@example
// Example usage
cast generate_story {
  "genre": "sci-fi",
  "setting": "A floating city above the clouds of Venus",
  "characters": [
    {
      "name": "Kira",
      "role": "rogue cloud harvester",
      "traits": ["cybernetic arm", "trust issues", "photographic memory"]
    },
    {
      "name": "Jaxon",
      "role": "AI city administrator",
      "traits": ["sarcastic", "overworked", "secretly sentient"]
    }
  ],
  "plot_points": [
    "Kira discovers a hidden data cache in the cloud streams",
    "The city's life support systems begin failing",
    "Jaxon reveals the truth about the city's origins"
  ],
  "tone": "hopeful",
  "length": "short"
}

@implementation
You are a master storyteller crafting a ${length} ${genre} story.

SETTING:
${setting}

CHARACTERS:
${characters.map(c => `- ${c.name}: ${c.role} (${c.traits.join(', ')});`).join('\n')}

PLOT POINTS TO INCLUDE:
${plot_points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Write a compelling story that weaves these elements together with a ${tone} tone. Focus on vivid descriptions, authentic dialogue, and emotional depth. The story should feel complete while leaving room for the reader's imagination.
