// Norse Mythology Dataset
export const norseMythology = {
  nodes: [
    // Aesir Gods
    {
      id: 'odin',
      name: 'Odin',
      type: 'deity',
      pantheon: 'norse',
      domain: ['wisdom', 'war', 'poetry', 'death'],
      description: 'Allfather, ruler of Asgard',
      symbol: '👁️',
      color: '#000000',
      group: 20
    },
    {
      id: 'thor',
      name: 'Thor',
      type: 'deity',
      pantheon: 'norse',
      domain: ['thunder', 'lightning', 'storms', 'strength'],
      description: 'God of thunder, wielder of Mjölnir',
      symbol: '⚡',
      color: '#4169E1',
      group: 20
    },
    {
      id: 'loki',
      name: 'Loki',
      type: 'deity',
      pantheon: 'norse',
      domain: ['mischief', 'trickery', 'change'],
      description: 'The trickster god',
      symbol: '🦊',
      color: '#32CD32',
      group: 20
    },
    
    // Vanir Gods
    {
      id: 'freyja',
      name: 'Freyja',
      type: 'deity',
      pantheon: 'norse',
      domain: ['love', 'fertility', 'war', 'death'],
      description: 'Goddess of love and war',
      symbol: '💖',
      color: '#FF69B4',
      group: 21
    },
    
    // Creatures
    {
      id: 'fenrir',
      name: 'Fenrir',
      type: 'creature',
      pantheon: 'norse',
      description: 'Gigantic wolf, son of Loki',
      symbol: '🐺',
      color: '#4B0082',
      group: 22
    },
    
    // Places
    {
      id: 'asgard',
      name: 'Asgard',
      type: 'place',
      pantheon: 'norse',
      description: 'Home of the Aesir gods',
      symbol: '🏰',
      color: '#FFD700',
      group: 23
    },
    {
      id: 'yggdrasil',
      name: 'Yggdrasil',
      type: 'place',
      pantheon: 'norse',
      description: 'The world tree',
      symbol: '🌳',
      color: '#228B22',
      group: 23
    }
  ],
  
  links: [
    // Family relationships
    { source: 'odin', target: 'thor', type: 'parent', description: 'Father and son' },
    { source: 'loki', target: 'fenrir', type: 'parent', description: 'Father and son' },
    
    // Mythological connections
    { source: 'thor', target: 'fire', type: 'domain', description: 'God of thunder' },
    { source: 'odin', target: 'mind', type: 'domain', description: 'God of wisdom' },
    { source: 'yggdrasil', target: 'asgard', type: 'connects', description: 'Connects the realms' },
    
    // Ragnarök connections
    { source: 'fenrir', target: 'odin', type: 'prophecy', description: 'Will kill Odin during Ragnarök' }
  ]
};
