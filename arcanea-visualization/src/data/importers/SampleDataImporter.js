import { BaseImporter } from './BaseImporter.js';
import { PANTHEON_CONFIG, ENTITY_TYPES, RELATIONSHIP_TYPES } from './config.js';

/**
 * Fallback importer that provides sample data when external APIs are unavailable
 */
export class SampleDataImporter extends BaseImporter {
  constructor() {
    super('sample_data');
  }

  /**
   * Generate sample data for a pantheon
   * @param {string} pantheonId - Pantheon ID
   * @returns {object} Sample data for the pantheon
   */
  generateSampleData(pantheonId) {
    const pantheon = PANTHEON_CONFIG[pantheonId.toUpperCase()];
    if (!pantheon) return { nodes: [], links: [] };

    const nodes = [];
    const links = [];
    const groupOffset = Object.keys(PANTHEON_CONFIG).indexOf(pantheonId.toUpperCase()) * 10;

    // Sample deities for the pantheon
    const sampleDeities = this.getSampleDeities(pantheon);
    sampleDeities.forEach((deity, index) => {
      const nodeId = `${pantheon.id}_deity_${index}`;
      nodes.push({
        id: nodeId,
        name: deity.name,
        type: ENTITY_TYPES.DEITY,
        pantheon: pantheon.id,
        domain: deity.domains || [],
        description: deity.description,
        symbol: deity.symbol || '🏛️',
        color: pantheon.color,
        group: 10 + groupOffset
      });

      // Add relationships
      if (deity.relatedTo) {
        deity.relatedTo.forEach(rel => {
          const targetId = `${pantheon.id}_deity_${rel.id}`;
          links.push({
            source: nodeId,
            target: targetId,
            type: rel.type,
            value: 1
          });
        });
      }
    });

    // Sample creatures
    const sampleCreatures = this.getSampleCreatures(pantheon);
    sampleCreatures.forEach((creature, index) => {
      const nodeId = `${pantheon.id}_creature_${index}`;
      nodes.push({
        id: nodeId,
        name: creature.name,
        type: ENTITY_TYPES.CREATURE,
        pantheon: pantheon.id,
        description: creature.description,
        symbol: creature.symbol || '🐉',
        color: this.adjustColor(pantheon.color, 20),
        group: 20 + groupOffset
      });

      // Link to deities
      if (creature.relatedDeities) {
        creature.relatedDeities.forEach(deityIndex => {
          const targetId = `${pantheon.id}_deity_${deityIndex}`;
          links.push({
            source: targetId,
            target: nodeId,
            type: RELATIONSHIP_TYPES.ASSOCIATED_WITH,
            value: 1
          });
        });
      }
    });

    // Sample places
    const samplePlaces = this.getSamplePlaces(pantheon);
    samplePlaces.forEach((place, index) => {
      const nodeId = `${pantheon.id}_place_${index}`;
      nodes.push({
        id: nodeId,
        name: place.name,
        type: 'place',
        pantheon: pantheon.id,
        description: place.description,
        symbol: place.symbol || '🗺️',
        color: this.adjustColor(pantheon.color, -20),
        group: 30 + groupOffset
      });
    });

    return { nodes, links };
  }

  /**
   * Get sample deities for a pantheon
   * @private
   */
  getSampleDeities(pantheon) {
    const samples = {
      greek: [
        {
          name: 'Zeus',
          domains: ['sky', 'thunder', 'kingship'],
          description: 'King of the Gods, ruler of Mount Olympus',
          symbol: '⚡',
          relatedTo: [{ id: 1, type: 'spouse' }]
        },
        {
          name: 'Hera',
          domains: ['marriage', 'women', 'childbirth'],
          description: 'Queen of the Gods, goddess of marriage',
          symbol: '👑',
          relatedTo: [{ id: 0, type: 'spouse' }]
        },
        {
          name: 'Poseidon',
          domains: ['sea', 'earthquakes', 'horses'],
          description: 'God of the sea and earthquakes',
          symbol: '🌊',
          relatedTo: [{ id: 0, type: 'sibling' }]
        }
      ],
      norse: [
        {
          name: 'Odin',
          domains: ['wisdom', 'war', 'poetry'],
          description: 'Allfather, ruler of Asgard',
          symbol: '👁️',
          relatedTo: [{ id: 1, type: 'spouse' }]
        },
        {
          name: 'Frigg',
          domains: ['marriage', 'prophecy', 'motherhood'],
          description: 'Wife of Odin, queen of the Aesir',
          symbol: '👑',
          relatedTo: [{ id: 0, type: 'spouse' }]
        },
        {
          name: 'Thor',
          domains: ['thunder', 'lightning', 'strength'],
          description: 'God of thunder, wielder of Mjölnir',
          symbol: '⚡',
          relatedTo: [{ id: 0, type: 'parent' }]
        }
      ],
      egyptian: [
        {
          name: 'Ra',
          domains: ['sun', 'creation', 'kingship'],
          description: 'God of the sun and creation',
          symbol: '☀️'
        },
        {
          name: 'Isis',
          domains: ['magic', 'motherhood', 'fertility'],
          description: 'Goddess of magic and motherhood',
          symbol: '🌙'
        },
        {
          name: 'Anubis',
          domains: ['death', 'mummification', 'the afterlife'],
          description: 'God of death and embalming',
          symbol: '⚰️'
        }
      ]
    };

    return samples[pantheon.id] || [];
  }

  /**
   * Get sample creatures for a pantheon
   * @private
   */
  getSampleCreatures(pantheon) {
    const samples = {
      greek: [
        {
          name: 'Pegasus',
          description: 'Winged divine horse',
          symbol: '🐎',
          relatedDeities: [0, 1] // Zeus and Hera
        },
        {
          name: 'Cerberus',
          description: 'Three-headed dog guarding the underworld',
          symbol: '🐕',
          relatedDeities: [2] // Hades
        }
      ],
      norse: [
        {
          name: 'Fenrir',
          description: 'Gigantic wolf, son of Loki',
          symbol: '🐺',
          relatedDeities: [0] // Odin
        },
        {
          name: 'Jörmungandr',
          description: 'World serpent, child of Loki',
          symbol: '🐍',
          relatedDeities: [2] // Thor
        }
      ],
      egyptian: [
        {
          name: 'Sphinx',
          description: 'Mythical creature with a lion\'s body and a human head',
          symbol: '🦁',
          relatedDeities: [0] // Ra
        },
        {
          name: 'Ammit',
          description: 'Demoness who devoured the hearts of the unworthy',
          symbol: '🐊',
          relatedDeities: [2] // Anubis
        }
      ]
    };

    return samples[pantheon.id] || [];
  }

  /**
   * Get sample places for a pantheon
   * @private
   */
  getSamplePlaces(pantheon) {
    const samples = {
      greek: [
        { name: 'Mount Olympus', description: 'Home of the gods', symbol: '⛰️' },
        { name: 'Underworld', description: 'Realm of Hades', symbol: '⚰️' }
      ],
      norse: [
        { name: 'Asgard', description: 'Home of the Aesir gods', symbol: '🏰' },
        { name: 'Valhalla', description: 'Hall of the slain', symbol: '🛡️' }
      ],
      egyptian: [
        { name: 'Duat', description: 'Egyptian underworld', symbol: '🌅' },
        { name: 'Heliopolis', description: 'City of the sun god Ra', symbol: '☀️' }
      ]
    };

    return samples[pantheon.id] || [];
  }

  /**
   * Adjust color brightness
   * @private
   */
  adjustColor(color, percent) {
    // Simple color adjustment implementation
    // In a real app, you'd want a more robust color manipulation library
    return color; // Simplified for example
  }

  /**
   * Import sample data
   * @returns {Promise<object>} Combined sample data
   */
  async import() {
    console.log('Generating sample mythology data...');
    
    const enabledPantheons = Object.values(PANTHEON_CONFIG)
      .filter(p => p.enabled)
      .map(p => p.id);
    
    const results = await Promise.all(
      enabledPantheons.map(pantheon => 
        this.fetchWithCache(`sample_${pantheon}`, () => this.generateSampleData(pantheon))
      )
    );
    
    // Combine all results
    const combined = {
      nodes: [],
      links: []
    };
    
    results.forEach(result => {
      if (result && result.nodes) {
        combined.nodes.push(...result.nodes);
      }
      if (result && result.links) {
        combined.links.push(...result.links);
      }
    });
    
    console.log(`Generated ${combined.nodes.length} sample nodes and ${combined.links.length} links`);
    return combined;
  }
}
