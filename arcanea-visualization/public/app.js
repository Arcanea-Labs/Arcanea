// Main application script for the mythology graph visualization

document.addEventListener('DOMContentLoaded', () => {
  // Configuration
  const width = window.innerWidth;
  const height = window.innerHeight - 60; // Account for header
  
  // Create SVG container
  const svg = d3.select('#graph')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`);

  // Add zoom/pan behavior
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Create a group for all graph elements
  const g = svg.append('g');
  
  // Tooltip
  const tooltip = d3.select('#tooltip');
  
  // Graph data and simulation
  let graph = { nodes: [], links: [] };
  let simulation;

  // Load data from API
  async function loadData() {
    try {
      const response = await fetch('/api/graph');
      graph = await response.json();
      updateGraph();
    } catch (error) {
      console.error('Error loading graph data:', error);
    }
  }

  // Update graph with new data
  function updateGraph() {
    // Remove existing elements
    g.selectAll('*').remove();

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr('class', d => `link ${d.type}`)
      .attr('stroke-width', 1.5);

    // Create nodes
    const node = g.append('g')
      .selectAll('.node')
      .data(graph.nodes)
      .enter().append('g')
      .attr('class', d => `node ${d.type} ${d.pantheon || ''}`.trim())
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => {
        if (d.group === 1) return 15;  // Primordial elements
        if (d.group <= 3) return 12;  // Archetypes
        return 10;                    // Other nodes
      })
      .attr('fill', d => d.color || '#999');

    // Add symbols or text to nodes
    node.append('text')
      .attr('dy', '.3em')
      .attr('text-anchor', 'middle')
      .text(d => d.symbol || d.name?.charAt(0) || d.id.charAt(0).toUpperCase())
      .attr('fill', 'white')
      .attr('font-size', d => d.symbol ? '16px' : '12px');

    // Add node labels
    const labels = node.append('text')
      .attr('dy', d => d.group === 1 ? -20 : -15)
      .text(d => d.name || d.id)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Show labels on hover
    node.on('mouseover', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', d => {
          if (d.group === 1) return 20;
          if (d.group <= 3) return 16;
          return 14;
        });
      
      labels.filter(dd => dd.id === d.id).style('opacity', 1);
      
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      
      tooltip.html(`
        <div class="tooltip-title">${d.name || d.id}</div>
        <div class="tooltip-type">${d.type}${d.pantheon ? ` (${d.pantheon})` : ''}</div>
        <div class="tooltip-desc">${d.description || ''}</div>
      `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    });

    node.on('mousemove', (event) => {
      tooltip
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    });

    node.on('mouseout', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', d => {
          if (d.group === 1) return 15;
          if (d.group <= 3) return 12;
          return 10;
        });
      
      labels.filter(dd => dd.id === d.id).style('opacity', 0);
      
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });

    // Create simulation
    simulation = d3.forceSimulation(graph.nodes)
      .force('link', d3.forceLink(graph.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => {
        if (d.group === 1) return 30;
        if (d.group <= 3) return 25;
        return 20;
      }))
      .on('tick', ticked);

    // Update positions on tick
    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    }

    // Zoom to fit
    zoomToFit();
  }


  // Drag functions
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
    // Uncomment to make nodes stay where dropped
    // d.fx = event.x;
    // d.fy = event.y;
  }


  // Zoom to fit all nodes
  function zoomToFit() {
    const bounds = svg.node().getBBox();
    const parent = svg.node().parentElement;
    const fullWidth = parent.clientWidth;
    const fullHeight = parent.clientHeight;
    const width = bounds.width;
    const height = bounds.height;
    const midX = bounds.x + width / 2;
    const midY = bounds.y + height / 2;
    
    if (width === 0 || height === 0) return; // nothing to fit
    
    const scale = 0.9 / Math.max(width / fullWidth, height / fullHeight);
    const translate = [
      fullWidth / 2 - scale * midX,
      fullHeight / 2 - scale * midY
    ];
    
    const transform = d3.zoomIdentity
      .translate(translate[0], translate[1])
      .scale(scale);
    
    svg.transition()
      .duration(750)
      .call(zoom.transform, transform);
  }

  // Initialize
  loadData();

  // Handle window resize
  window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight - 60;
    svg.attr('width', newWidth)
       .attr('height', newHeight);
    zoomToFit();
  });
});
