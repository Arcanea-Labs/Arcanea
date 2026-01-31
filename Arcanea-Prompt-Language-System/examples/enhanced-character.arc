# Enhanced Arcanea Character Example
# Demonstrating the full power of the .arc ecosystem

@character Kira_Vance
@archetype storm-seeker
@elemental_alignment [fire, air]
@data {
  "name": "Kira Vance",
  "role": "Rogue Cloud Harvester",
  "age": 28,
  "traits": ["cybernetic_arm", "trust_issues", "photographic_memory", "storm_affinity"],
  "guardian_guidance": "draconia",
  "homeworld": "Venus_Floating_Cities",
  "motivation": "Find the truth about the Cloud Collective"
}

@backstory
# Kira Vance - Storm Seeker of Venus

Born in the floating cities above Venus's turbulent cloud layers, Kira learned to navigate storms where others saw only chaos. After losing her right arm in a plasma discharge accident, she replaced it with a cybernetic enhancement that can sense electromagnetic fluctuations in the clouds.

Her photographic memory makes her both invaluable and dangerous - she remembers every detail, every lie, every promise made. This gift has made her trust issues legendary across the cloud harvester guilds.

Now she hunts for answers about the mysterious Cloud Collective - a consciousness that seems to live within the storms themselves. The city administrators call it dangerous fiction, but Kira has heard its whispers...

@relationships
[
  {
    "character": "Jaxon",
    "type": "complex_rivalry",
    "description": "AI City Administrator who may know more than he reveals"
  },
  {
    "character": "Elder_Mara",
    "type": "mentor",
    "description": "Retired storm seeker who taught Kira everything"
  },
  {
    "character": "The_Collective",
    "type": "mysterious_entity",
    "description": "Cloud consciousness that calls to Kira in dreams"
  }
]

@arc_spells
@spell character_motivation
@description "Generate character-specific motivation and inner conflict"
@archetypes [fire, air, transformation]
@parameters {
  "character": "string",
  "situation": "string",
  "emotional_state": ["determined", "conflicted", "hopeful", "desperate"]
}

@implementation
As ${character} faces ${situation}, their storm-seeker nature emerges with ${emotional_state} intensity.

**Inner Conflict:** The desire for truth wars against the fear of what truth might bring. Every storm they've navigated taught them that chaos can either destroy you or reveal new paths.

**Motivation:** 
- Primary: ${character.data.motivation}
- Secondary: Prove the Cloud Collective is real
- Hidden: Find redemption for past failures

**Action:** ${character.name} moves with the fluid grace of someone who dances with storms, their cybernetic arm humming with unseen energy as they prepare to...

@spell character_dialogue
@description "Generate authentic dialogue based on character traits"
@archetypes [air, narrative, emotion]
@parameters {
  "character": "string",
  "context": "string",
  "tone": ["sarcastic", "serious", "vulnerable", "authoritative"]
}

@example
cast character_dialogue {
  "character": "Kira_Vance",
  "context": "Confronting Jaxon about missing data",
  "tone": "sarcastic"
}

@implementation
Generate dialogue for ${character.name} (${character.role}) with traits: ${character.traits.join(', ')}.

Context: ${context}
Tone: ${tone}
Archetype: ${character.archetype}
Elemental influence: ${character.elemental_alignment.join(' and ')}

**Dialogue Guidelines:**
- Show ${character.name}'s photographic memory through specific details
- Reflect their trust issues through guarded language
- Incorporate storm/weather metaphors natural to their background
- Let cybernetic arm influence their physical presence
- Reveal underlying vulnerability beneath ${tone} exterior

Write authentic dialogue that sounds like ${character.name} speaking naturally.

@world Venus_Floating_Cities
@cosmology {
  "primary_elements": ["air", "fire"],
  "governance": "AI_Administration_Council",
  "energy_source": "Cloud_Plasma_Harvesting",
  "mystery_element": "The_Collective"
}

@geography {
  "continents": ["Aeris_Plateau", "Tempest_Zone", "Harbor_Districts"],
  "magical_regions": ["Plasma_Storms", "Whisper_Clouds", "Memory_Mist"],
  "mystical_sites": ["The_Eye", "Harmonic_Convergence", "Broken_Spire"]
}

@cultures [
  {
    "name": "Cloud_Harvesters",
    "values": ["adaptability", "courage", "memory"],
    "social_structure": "Guild_based",
    "relationship_to_storms": "Partnership"
  },
  {
    "name": "AI_Administrator_Caste",
    "values": ["logic", "efficiency", "secrecy"],
    "social_structure": "Hierarchical",
    "relationship_to_storms": "Control_and_utilization"
  }
]

@history [
  {
    "era": "Foundation_ Era",
    "period": "2200-2250",
    "events": ["First floating cities established", "Storm adaptation techniques developed"]
  },
  {
    "era": "The_Great_Silence",
    "period": "2251-2300", 
    "events": ["Communication breakdown", "Collective_first_detected", "AI_administration_established"]
  },
  {
    "era": "Current_Age",
    "period": "2301-Present",
    "events": ["Kira's_birth", "Cybernetic_advancements", "Rising_collective_influence"]
  }
]