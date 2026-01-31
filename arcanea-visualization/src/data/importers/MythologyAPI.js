import axios from 'axios';
import { BaseImporter } from './BaseImporter.js';
import { DATA_SOURCES, PANTHEON_CONFIG, ENTITY_TYPES, RELATIONSHIP_TYPES } from './config.js';

/**
 * Importer for the public Mythology API (mythologyapi.com)
 */
export class MythologyAPIImporter extends BaseImporter {
  constructor() {
    super('mythology_api');
    this.baseUrl = DATA_SOURCES.MYTHOLOGY_API.BASE_URL;
    this.endpoints = DATA_SOURCES.MYTHOLOGY_API.ENDPOINTS;
  }

  /**
   * Fetch all deities for a specific pantheon
   * @param {string} pantheon - Pantheon ID (e.g., 'greek', 'norse')
   * @returns {Promise<Array>} List of deities
   */
  async fetchDeities(pantheon) {
    try {
      const url = `${this.baseUrl}${this.endpoints.DEITIES}?pantheon=${pantheon}`;
      const response = await axios.get(url);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching deities for ${pantheon}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch all myths for a specific pantheon
   * @param {string} pantheon - Pantheon ID
   * @returns {Promise<Array>} List of myths
   */
  async fetchMyths(pantheon) {
    try {
      const url = `${this.baseUrl}${this.endpoints.MYTHS}?pantheon=${pantheon}`;
      const response = await axios.get(url);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching myths for ${pantheon}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch all creatures for a specific pantheon
   * @param {string} pantheon - Pantheon ID
   * @returns {Promise<Array>} List of creatures
   */
  async fetchCreatures(pantheon) {
    try {
      const url = `${this.baseUrl}${this.endpoints.CREATURES}?pantheon=${pantheon}`;
      const response = await axios.get(url);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching creatures for ${pantheon}:`, error.message);
      return [];
    }
  }

  /**
   * Process a single pantheon
   * @param {string} pantheonId - Pantheon ID
   * @returns {Promise<object>} Processed data for the pantheon
   */
  async processPantheon(pantheonId) {
    const pantheon = PANTHEON_CONFIG[pantheonId.toUpperCase()];
    if (!pantheon || !pantheon.enabled) {
      return { nodes: [], links: [] };
    }

    // Fetch all data for this pantheon
    const [deities, myths, creatures] = await Promise.all([
      this.fetchDeities(pantheon.id),
      this.fetchMyths(pantheon.id),
      this.fetchCreatures(pantheon.id)
    ]);

    // Process entities
    const nodes = [];
    const links = [];
    const entityMap = new Map();

    // Process deities
    deities.forEach(deity => {
      const nodeId = `${pantheon.id}_deity_${deity.id}`;
      entityMap.set(`deity_${deity.id}`, nodeId);
      
      nodes.push({
        id: nodeId,
        name: deity.name,
        type: ENTITY_TYPES.DEITY,
        pantheon: pantheon.id,
        domain: deity.domain || [],
        description: deity.description,
        symbol: deity.symbol || '🏛️',
        color: pantheon.color,
        group: 10 + Object.keys(PANTHEON_CONFIG).indexOf(pantheonId.toUpperCase())
      });

      // Add relationships
      if (deity.parents && Array.isArray(deity.parents)) {
        deity.parents.forEach(parentId => {
          links.push({
            source: `deity_${parentId}`,
            target: nodeId,
            type: RELATIONSHIP_TYPES.PARENT,
            value: 1
          });
        });
      }
    });

    // Process myths
    myths.forEach(myth => {
      const nodeId = `${pantheon.id}_myth_${myth.id}`;
      nodes.push({
        id: nodeId,
        name: myth.title,
        type: 'myth',
        pantheon: pantheon.id,
        description: myth.summary,
        symbol: '📜',
        color: pantheon.color,
        group: 20 + Object.keys(PANTHEON_CONFIG).indexOf(pantheonId.toUpperCase())
      });

      // Link deities to myths
      if (myth.deities && Array.isArray(myth.deities)) {
        myth.deities.forEach(deityId => {
          if (entityMap.has(`deity_${deityId}`)) {
            links.push({
              source: entityMap.get(`deity_${deityId}`),
              target: nodeId,
              type: RELATIONSHIP_TYPES.ASSOCIATED_WITH,
              value: 1
            });
          }
        });
      }
    });

    // Process creatures
    creatures.forEach(creature => {
      const nodeId = `${pantheon.id}_creature_${creature.id}`;
      nodes.push({
        id: nodeId,
        name: creature.name,
        type: ENTITY_TYPES.CREATURE,
        pantheon: pantheon.id,
        description: creature.description,
        symbol: '🐉',
        color: pantheon.color,
        group: 30 + Object.keys(PANTHEON_CONFIG).indexOf(pantheonId.toUpperCase())
      });

      // Link creatures to deities
      if (creature.relatedDeities && Array.isArray(creature.relatedDeities)) {
        creature.relatedDeities.forEach(deityId => {
          if (entityMap.has(`deity_${deityId}`)) {
            links.push({
              source: entityMap.get(`deity_${deityId}`),
              target: nodeId,
              type: RELATIONSHIP_TYPES.ASSOCIATED_WITH,
              value: 1
            });
          }
        });
      }
    });

    return { nodes, links };
  }

  /**
   * Import data from the Mythology API
   * @returns {Promise<object>} Combined data from all pantheons
   */
  async import() {
    console.log('Starting import from Mythology API...');
    
    const enabledPantheons = Object.values(PANTHEON_CONFIG)
      .filter(p => p.enabled)
      .map(p => p.id);
    
    const results = await Promise.all(
      enabledPantheons.map(pantheon => 
        this.fetchWithCache(`pantheon_${pantheon}`, () => this.processPantheon(pantheon))
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
    
    console.log(`Imported ${combined.nodes.length} nodes and ${combined.links.length} links from Mythology API`);
    return combined;
  }
}
