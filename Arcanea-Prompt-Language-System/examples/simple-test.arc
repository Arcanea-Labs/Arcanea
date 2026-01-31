# Simple Test .arc File
# Testing basic parsing functionality

@spell test_cast
@description "Simple test spell"
@archetypes [fire, air]
@parameters {
  "target": "string",
  "effect": "string"
}

@implementation
Casting spell on ${target} with ${effect} effect.

@character test_character
@archetype crystal-warrior
@elemental_alignment [earth, fire]
@data {
  "name": "Test Character",
  "role": "Warrior"
}

@backstory
"A test character for parsing demonstration."