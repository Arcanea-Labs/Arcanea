// Greek Mythology Dataset
export const greekMythology = {
  nodes: [
    // Olympian Gods
    {
      id: 'zeus',
      name: 'Zeus',
      type: 'deity',
      pantheon: 'greek',
      domain: ['sky', 'thunder', 'kingship'],
      description: 'King of the Gods, ruler of Mount Olympus',
      symbol: '⚡',
      color: '#FFD700',
      group: 10
    },
    {
      id: 'hera',
      name: 'Hera',
      type: 'deity',
      pantheon: 'greek',
      domain: ['marriage', 'women', 'childbirth'],
      description: 'Queen of the Gods, goddess of marriage',
      symbol: '👑',
      color: '#9370DB',
      group: 10
    },
    {
      id: 'poseidon',
      name: 'Poseidon',
      type: 'deity',
      pantheon: 'greek',
      domain: ['sea', 'earthquakes', 'horses'],
      description: 'God of the sea and earthquakes',
      symbol: '🌊',
      color: '#1E90FF',
      group: 10
    },
    // Add more deities as needed
    
    // Heroes
    {
      id: 'hercules',
      name: 'Hercules',
      type: 'hero',
      pantheon: 'greek',
      description: 'Son of Zeus, known for his twelve labors',
      symbol: '🦁',
      color: '#FF6347',
      group: 11
    },
    
    // Creatures
    {
      id: 'pegasus',
      name: 'Pegasus',
      type: 'creature',
      pantheon: 'greek',
      description: 'Winged divine horse',
      symbol: '🐎',
      color: '#B0E0E6',
      group: 12
    },
    
    // Places
    {
      id: 'olympus',
      name: 'Mount Olympus',
      type: 'place',
      pantheon: 'greek',
      description: 'Home of the Olympian gods',
      symbol: '⛰️',
      color: '#708090',
      group: 13
    }
  ],
  
  links: [
    // Family relationships
    { source: 'zeus', target: 'hera', type: 'spouse', description: 'Husband and wife' },
    { source: 'zeus', target: 'poseidon', type: 'sibling', description: 'Brothers' },
    { source: 'zeus', target: 'hercules', type: 'parent', description: 'Father and son' },
    
    // Domain connections
    { source: 'poseidon', target: 'water', type: 'domain', description: 'God of the sea' },
    { source: 'zeus', target: 'air', type: 'domain', description: 'God of the sky' },
    
    // Mythological connections
    { source: 'pegasus', target: 'poseidon', type: 'parent', description: 'Created by Poseidon' },
    { source: 'hercules', target: 'olympus', type: 'ascended', description: 'Granted godhood' }
  ]
};
