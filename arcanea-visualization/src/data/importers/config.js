// Configuration for data importers

export const DATA_SOURCES = {
  MYTHOLOGY_API: {
    BASE_URL: 'https://mythologyapi.com/api',
    ENDPOINTS: {
      DEITIES: '/deities',
      MYTHS: '/myths',
      CREATURES: '/creatures'
    },
    CACHE_TTL: 24 * 60 * 60 * 1000 // 24 hours
  },
  WIKIDATA: {
    SPARQL_ENDPOINT: 'https://query.wikidata.org/sparql',
    CACHE_TTL: 7 * 24 * 60 * 60 * 1000 // 1 week
  }
};

export const PANTHEON_CONFIG = {
  GREEK: {
    id: 'greek',
    name: 'Greek',
    color: '#4169E1', // Royal Blue
    symbol: '🏛️',
    description: 'The mythology of ancient Greece',
    enabled: true
  },
  NORSE: {
    id: 'norse',
    name: 'Norse',
    color: '#8B4513', // Saddle Brown
    symbol: '⚔️',
    description: 'The mythology of the Norse people',
    enabled: true
  },
  EGYPTIAN: {
    id: 'egyptian',
    name: 'Egyptian',
    color: '#DAA520', // Golden Rod
    symbol: '☥',
    description: 'The mythology of ancient Egypt',
    enabled: true
  },
  JAPANESE: {
    id: 'japanese',
    name: 'Japanese',
    color: '#B22222', // Fire Brick
    symbol: '🎎',
    description: 'The mythology of Japan',
    enabled: true
  },
  CELTIC: {
    id: 'celtic',
    name: 'Celtic',
    color: '#228B22', // Forest Green
    symbol: '☘️',
    description: 'The mythology of the Celtic people',
    enabled: true
  },
  HINDU: {
    id: 'hindu',
    name: 'Hindu',
    color: '#9370DB', // Medium Purple
    symbol: '🕉️',
    description: 'The mythology of Hinduism',
    enabled: true
  },
  CHINESE: {
    id: 'chinese',
    name: 'Chinese',
    color: '#FF4500', // Orange Red
    symbol: '🐉',
    description: 'Chinese mythology and folklore',
    enabled: true
  },
  MESOPOTAMIAN: {
    id: 'mesopotamian',
    name: 'Mesopotamian',
    color: '#CD853F', // Peru
    symbol: '🏺',
    description: 'The mythology of ancient Mesopotamia',
    enabled: true
  }
};

export const ENTITY_TYPES = {
  DEITY: 'deity',
  HERO: 'hero',
  CREATURE: 'creature',
  PLACE: 'place',
  ARTIFACT: 'artifact',
  CONCEPT: 'concept',
  EVENT: 'event'
};

export const RELATIONSHIP_TYPES = {
  PARENT: 'parent',
  CHILD: 'child',
  SIBLING: 'sibling',
  SPOUSE: 'spouse',
  ENEMY: 'enemy',
  ALLY: 'ally',
  CREATOR: 'creator',
  CREATION: 'creation',
  RULER: 'ruler',
  SERVANT: 'servant',
  ASSOCIATED_WITH: 'associated',
  PART_OF: 'part_of',
  MANIFESTATION: 'manifestation',
  AVATAR: 'avatar',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

export const CACHE_CONFIG = {
  ENABLED: true,
  DIRECTORY: './.cache',
  TTL: 24 * 60 * 60 * 1000 // 24 hours
};
