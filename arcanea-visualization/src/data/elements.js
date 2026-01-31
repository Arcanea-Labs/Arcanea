// Primordial Elements
export const primordialElements = {
  earth: { 
    id: 'earth', 
    group: 1, 
    type: 'primordial', 
    description: 'Foundation, stability, material form',
    symbol: '🜃',
    color: '#8B4513'
  },
  water: { 
    id: 'water', 
    group: 1, 
    type: 'primordial', 
    description: 'Flow, emotion, intuition, adaptation',
    symbol: '🜄',
    color: '#1E90FF'
  },
  air: { 
    id: 'air', 
    group: 1, 
    type: 'primordial', 
    description: 'Thought, communication, freedom',
    symbol: '🜁',
    color: '#87CEEB'
  },
  fire: { 
    id: 'fire', 
    group: 1, 
    type: 'primordial', 
    description: 'Energy, transformation, will, passion',
    symbol: '🜂',
    color: '#FF4500'
  },
  spirit: { 
    id: 'spirit', 
    group: 1, 
    type: 'primordial', 
    description: 'Consciousness, connection, the numinous',
    symbol: '✨',
    color: '#9370DB'
  },
  void: { 
    id: 'void', 
    group: 1, 
    type: 'primordial', 
    description: 'Potential, the unmanifest, pure possibility',
    symbol: '⚫',
    color: '#2F4F4F'
  }
};

// Elemental Combinations
export const elementalCombinations = {
  stone: { 
    id: 'stone', 
    group: 2, 
    type: 'archetype', 
    description: 'earth + water :: Endurance, patience, memory',
    symbol: '🪨',
    color: '#808080',
    sources: ['earth', 'water']
  },
  crystal: { 
    id: 'crystal', 
    group: 2, 
    type: 'archetype', 
    description: 'earth + air :: Structure, clarity, focus',
    symbol: '💎',
    color: '#E6E6FA',
    sources: ['earth', 'air']
  },
  metal: { 
    id: 'metal', 
    group: 2, 
    type: 'archetype', 
    description: 'earth + fire :: Strength, refinement, value',
    symbol: '⚙️',
    color: '#B0C4DE',
    sources: ['earth', 'fire']
  },
  mist: { 
    id: 'mist', 
    group: 2, 
    type: 'archetype', 
    description: 'water + air :: Dreams, intuition, mystery',
    symbol: '🌫️',
    color: '#F0F8FF',
    sources: ['water', 'air']
  },
  storm: { 
    id: 'storm', 
    group: 2, 
    type: 'archetype', 
    description: 'air + fire :: Sudden change, inspiration',
    symbol: '⛈️',
    color: '#4682B4',
    sources: ['air', 'fire']
  },
  // Higher Order Archetypes
  time: {
    id: 'time',
    group: 3,
    type: 'higher',
    description: 'earth + spirit :: Cycles, duration, history',
    symbol: '⏳',
    color: '#2E8B57',
    sources: ['earth', 'spirit']
  },
  space: {
    id: 'space',
    group: 3,
    type: 'higher',
    description: 'air + spirit :: Connection, relationship, context',
    symbol: '🌌',
    color: '#191970',
    sources: ['air', 'spirit']
  },
  mind: {
    id: 'mind',
    group: 3,
    type: 'higher',
    description: 'fire + spirit :: Intellect, will, focus',
    symbol: '🧠',
    color: '#8A2BE2',
    sources: ['fire', 'spirit']
  },
  soul: {
    id: 'soul',
    group: 3,
    type: 'higher',
    description: 'water + spirit :: Emotion, intuition, depth',
    symbol: '💫',
    color: '#BA55D3',
    sources: ['water', 'spirit']
  }
};

// Export all elements and combinations
export const allElements = {
  ...primordialElements,
  ...elementalCombinations
};
