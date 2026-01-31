document.addEventListener('DOMContentLoaded', () => {
    // Enhanced mythological data with more nodes and connections
    const mythologyData = {
        nodes: [
            // Primordial Deities
            { id: "Chaos", name: "Chaos", type: "deity", pantheon: "Greek", description: "The primordial void from which all existence emerged", connections: ["Gaia", "Erebus", "Nyx", "Tartarus"] },
            { id: "Gaia", name: "Gaia", type: "deity", pantheon: "Greek", description: "Mother Earth, the primordial goddess of the earth", connections: ["Chaos", "Uranus", "Pontus", "Cronus"] },
            { id: "Nyx", name: "Nyx", type: "deity", pantheon: "Greek", description: "Primordial goddess of the night", connections: ["Chaos", "Erebus", "Hemera", "Aether"] },
            { id: "Erebus", name: "Erebus", type: "deity", pantheon: "Greek", description: "Primordial god of darkness", connections: ["Chaos", "Nyx", "Aether", "Hemera"] },
            
            // Titans
            { id: "Cronus", name: "Cronus", type: "deity", pantheon: "Greek", description: "Leader of the Titans, god of time", connections: ["Gaia", "Uranus", "Rhea", "Zeus", "Poseidon", "Hades"] },
            { id: "Rhea", name: "Rhea", type: "deity", pantheon: "Greek", description: "Titaness, mother of the Olympian gods", connections: ["Cronus", "Zeus", "Hera", "Poseidon", "Hades", "Demeter"] },
            { id: "Uranus", name: "Uranus", type: "deity", pantheon: "Greek", description: "Primordial god of the sky", connections: ["Gaia", "Cronus", "Cyclopes", "Hecatoncheires"] },
            
            // Olympian Gods
            { id: "Zeus", name: "Zeus", type: "deity", pantheon: "Greek", description: "King of the gods, ruler of the sky and thunder", connections: ["Cronus", "Rhea", "Hera", "Athena", "Apollo", "Artemis", "Hermes", "Dionysus"] },
            { id: "Hera", name: "Hera", type: "deity", pantheon: "Greek", description: "Queen of the gods, goddess of marriage and family", connections: ["Zeus", "Cronus", "Rhea", "Ares", "Hephaestus"] },
            { id: "Poseidon", name: "Poseidon", type: "deity", pantheon: "Greek", description: "God of the sea, earthquakes, and horses", connections: ["Cronus", "Rhea", "Zeus", "Amphitrite", "Triton"] },
            { id: "Hades", name: "Hades", type: "deity", pantheon: "Greek", description: "God of the underworld and the dead", connections: ["Cronus", "Rhea", "Zeus", "Persephone", "Cerberus"] },
            { id: "Athena", name: "Athena", type: "deity", pantheon: "Greek", description: "Goddess of wisdom, warfare, and crafts", connections: ["Zeus", "Metis", "Perseus", "Odysseus"] },
            { id: "Apollo", name: "Apollo", type: "deity", pantheon: "Greek", description: "God of music, poetry, prophecy, and the sun", connections: ["Zeus", "Leto", "Artemis", "Asclepius", "Orpheus"] },
            { id: "Artemis", name: "Artemis", type: "deity", pantheon: "Greek", description: "Goddess of the hunt, wilderness, and the moon", connections: ["Zeus", "Leto", "Apollo", "Orion"] },
            { id: "Aphrodite", name: "Aphrodite", type: "deity", pantheon: "Greek", description: "Goddess of love, beauty, and pleasure", connections: ["Uranus", "Eros", "Ares", "Hephaestus"] },
            { id: "Ares", name: "Ares", type: "deity", pantheon: "Greek", description: "God of war and courage", connections: ["Zeus", "Hera", "Aphrodite", "Phobos", "Deimos"] },
            
            // Heroes
            { id: "Perseus", name: "Perseus", type: "hero", pantheon: "Greek", description: "Slayer of Medusa, founder of Mycenae", connections: ["Zeus", "Danae", "Athena", "Medusa", "Andromeda"] },
            { id: "Heracles", name: "Heracles", type: "hero", pantheon: "Greek", description: "Greatest of Greek heroes, completed twelve labors", connections: ["Zeus", "Alcmene", "Hera", "Hydra", "Cerberus"] },
            { id: "Odysseus", name: "Odysseus", type: "hero", pantheon: "Greek", description: "King of Ithaca, hero of the Odyssey", connections: ["Athena", "Poseidon", "Circe", "Cyclops"] },
            { id: "Achilles", name: "Achilles", type: "hero", pantheon: "Greek", description: "Greatest warrior of the Trojan War", connections: ["Thetis", "Peleus", "Patroclus", "Hector"] },
            { id: "Theseus", name: "Theseus", type: "hero", pantheon: "Greek", description: "Founder-hero of Athens, slayer of the Minotaur", connections: ["Poseidon", "Aethra", "Ariadne", "Minotaur"] },
            
            // Creatures
            { id: "Cerberus", name: "Cerberus", type: "creature", pantheon: "Greek", description: "Three-headed dog guarding the underworld", connections: ["Hades", "Typhon", "Echidna", "Heracles"] },
            { id: "Hydra", name: "Lernaean Hydra", type: "creature", pantheon: "Greek", description: "Multi-headed serpent monster", connections: ["Typhon", "Echidna", "Heracles"] },
            { id: "Medusa", name: "Medusa", type: "creature", pantheon: "Greek", description: "Gorgon with snakes for hair whose gaze turns people to stone", connections: ["Poseidon", "Athena", "Perseus", "Pegasus"] },
            { id: "Minotaur", name: "Minotaur", type: "creature", pantheon: "Greek", description: "Half-man, half-bull creature of the labyrinth", connections: ["Pasiphae", "Minos", "Theseus", "Daedalus"] },
            { id: "Pegasus", name: "Pegasus", type: "creature", pantheon: "Greek", description: "Divine winged horse", connections: ["Poseidon", "Medusa", "Bellerophon", "Zeus"] },
            { id: "Cyclops", name: "Polyphemus", type: "creature", pantheon: "Greek", description: "One-eyed giant, son of Poseidon", connections: ["Poseidon", "Odysseus"] },
            
            // Places
            { id: "Olympus", name: "Mount Olympus", type: "place", pantheon: "Greek", description: "Home of the Olympian gods", connections: ["Zeus", "Hera", "Athena", "Apollo"] },
            { id: "Underworld", name: "The Underworld", type: "place", pantheon: "Greek", description: "Realm of the dead", connections: ["Hades", "Persephone", "Cerberus", "Styx"] },
            { id: "Tartarus", name: "Tartarus", type: "place", pantheon: "Greek", description: "Deep abyss of torment and suffering", connections: ["Chaos", "Cronus", "Titans"] },
            { id: "Delphi", name: "Delphi", type: "place", pantheon: "Greek", description: "Site of the Oracle of Apollo", connections: ["Apollo", "Python", "Pythia"] }
        ],
        links: []
    };

    // Generate links from connections
    mythologyData.nodes.forEach(node => {
        if (node.connections) {
            node.connections.forEach(targetId => {
                // Check if link already exists (to avoid duplicates)
                const existingLink = mythologyData.links.find(link => 
                    (link.source === node.id && link.target === targetId) ||
                    (link.source === targetId && link.target === node.id)
                );
                
                if (!existingLink && mythologyData.nodes.find(n => n.id === targetId)) {
                    mythologyData.links.push({
                        source: node.id,
                        target: targetId,
                        value: 1
                    });
                }
            });
        }
    });

    // Remove loading indicator
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    // Get container dimensions
    const container = d3.select('#visualization');
    const width = container.node().getBoundingClientRect().width;
    const height = container.node().getBoundingClientRect().height;

    // Create SVG
    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.3, 3])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Create main group
    const g = svg.append('g');

    // Create force simulation
    const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(30));

    // Color scale for node types
    const colorScale = {
        deity: '#e74c3c',
        hero: '#3498db',
        creature: '#2ecc71',
        place: '#f39c12'
    };

    // Create links
    const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(mythologyData.links)
        .enter().append('line')
        .attr('class', 'link');

    // Create nodes
    const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(mythologyData.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
        .attr('r', d => {
            switch(d.type) {
                case 'deity': return 20;
                case 'hero': return 16;
                case 'creature': return 18;
                case 'place': return 22;
                default: return 15;
            }
        })
        .style('fill', d => colorScale[d.type] || '#95afc0')
        .style('stroke', '#1a1a2e')
        .style('stroke-width', 2)
        .on('click', (event, d) => {
            event.stopPropagation();
            showInfoPanel(d);
        })
        .on('mouseover', function(event, d) {
            d3.select(this).style('filter', 'brightness(1.3)');
        })
        .on('mouseout', function(event, d) {
            d3.select(this).style('filter', null);
        });

    // Add labels to nodes
    node.append('text')
        .attr('class', 'node-label')
        .attr('dy', -25)
        .attr('text-anchor', 'middle')
        .text(d => d.name);

    // Add tooltips
    node.append('title')
        .text(d => `${d.name}\n${d.type}\n${d.description}`);

    // Update simulation
    simulation
        .nodes(mythologyData.nodes)
        .on('tick', ticked);

    simulation.force('link')
        .links(mythologyData.links);

    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('transform', d => `translate(${d.x},${d.y})`);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Search functionality
    window.searchNodes = function(searchTerm) {
        if (!searchTerm) {
            node.style('opacity', 1);
            link.style('opacity', 1);
            return;
        }

        const term = searchTerm.toLowerCase();
        
        node.style('opacity', d => {
            const matches = d.name.toLowerCase().includes(term) || 
                          d.description.toLowerCase().includes(term);
            return matches ? 1 : 0.2;
        });

        link.style('opacity', l => {
            const sourceMatch = l.source.name.toLowerCase().includes(term);
            const targetMatch = l.target.name.toLowerCase().includes(term);
            return (sourceMatch || targetMatch) ? 0.6 : 0.1;
        });
    };

    // Filter functionality
    window.applyFilter = function(filterType) {
        if (filterType === 'all') {
            node.style('opacity', 1);
            link.style('opacity', 1);
            return;
        }

        node.style('opacity', d => d.type === filterType ? 1 : 0.2);
        
        link.style('opacity', l => {
            const sourceMatch = l.source.type === filterType;
            const targetMatch = l.target.type === filterType;
            return (sourceMatch || targetMatch) ? 0.6 : 0.1;
        });
    };

    // Reset visualization
    window.resetVisualization = function() {
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
        
        node.style('opacity', 1);
        link.style('opacity', 1);
        
        simulation.alpha(0.3).restart();
    };

    // Info panel function (defined in index.html)
    window.showInfoPanel = showInfoPanel;
});
