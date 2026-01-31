// Import elemental data
import { allElements, primordialElements, elementalCombinations } from './elements.js';

// Import mythology datasets
import { greekMythology } from './mythologies/greek.js';
import { norseMythology } from './mythologies/norse.js';

// Combine all data sources
export function combineDataSources() {
  const nodes = [];
  const links = [];
  const nodeMap = new Map(); // For quick lookups

  // Add primordial elements
  Object.values(primordialElements).forEach(element => {
    nodes.push(element);
    nodeMap.set(element.id, element);
  });

  // Add elemental combinations
  Object.values(elementalCombinations).forEach(combo => {
    nodes.push(combo);
    nodeMap.set(combo.id, combo);
    
    // Create links to source elements
    combo.sources.forEach(sourceId => {
      if (nodeMap.has(sourceId)) {
        links.push({
          source: sourceId,
          target: combo.id,
          type: 'elemental',
          value: 1,
          description: `Combines to form ${combo.id}`
        });
      }
    });
  });

  // Function to add mythology data
  function addMythology(mythology) {
    // Add nodes
    mythology.nodes.forEach(node => {
      if (!nodeMap.has(node.id)) {
        nodes.push(node);
        nodeMap.set(node.id, node);
      }
    });

    // Add links
    if (mythology.links) {
      mythology.links.forEach(link => {
        if (nodeMap.has(link.source) && nodeMap.has(link.target)) {
          links.push({
            ...link,
            value: link.value || 1
          });
        }
      });
    }
  }


  // Add all mythologies
  addMythology(greekMythology);
  addMythology(norseMythology);
  
    // Add cross-mythology connections
  function addCrossMythologyConnections() {
    // Example: Connect Zeus (Greek) and Odin (Norse) as sky fathers
    if (nodeMap.has('zeus') && nodeMap.has('odin')) {
      links.push({
        source: 'zeus',
        target: 'odin',
        type: 'archetype',
        value: 2,
        description: 'Sky father archetype'
      });
    }
  }
  
  // Call the function to add cross-mythology connections
  addCrossMythologyConnections();

  return { nodes, links };
}

// Export the combined data
export const graphData = combineDataSources();

// Export functions for API use
export const getGraphData = () => graphData;

export const getNode = (id) => {
  return graphData.nodes.find(node => node.id === id);
};

export const getConnectedNodes = (nodeId, depth = 1) => {
  const result = new Set();
  const visited = new Set([nodeId]);
  let currentDepth = 0;
  
  function traverse(id, currentDepth) {
    if (currentDepth > depth) return;
    
    graphData.links.forEach(link => {
      if (link.source === id && !visited.has(link.target)) {
        visited.add(link.target);
        result.add(link.target);
        traverse(link.target, currentDepth + 1);
      } else if (link.target === id && !visited.has(link.source)) {
        visited.add(link.source);
        result.add(link.source);
        traverse(link.source, currentDepth + 1);
      }
    });
  }
  
  traverse(nodeId, 0);
  return Array.from(result).map(id => getNode(id));
};
