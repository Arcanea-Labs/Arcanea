document.addEventListener('DOMContentLoaded', () => {
  // Configuration
  const width = window.innerWidth;
  const height = window.innerHeight - 120; // Account for header and controls
  
  // Create SVG container
  const svg = d3.select('#graph-container')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`);

  // Add zoom/pan behavior
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  // Apply zoom to SVG
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
      .attr('class', d => `link ${d.value === 2 ? 'higher' : 'elemental'}`);

    // Create nodes
    const node = g.append('g')
      .selectAll('.node')
      .data(graph.nodes)
      .enter().append('g')
      .attr('class', d => `node ${d.type}`)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.type === 'primordial' ? 12 : 8)
      .on('mouseover', showTooltip)
      .on('mousemove', moveTooltip)
      .on('mouseout', hideTooltip);

    // Add labels
    node.append('text')
      .attr('dy', d => d.type === 'primordial' ? -15 : -12)
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .style('font-size', d => d.type === 'primordial' ? '12px' : '10px')
      .style('font-weight', d => d.type === 'primordial' ? 'bold' : 'normal');

    // Initialize simulation
    simulation = d3.forceSimulation(graph.nodes)
      .force('link', d3.forceLink(graph.links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.type === 'primordial' ? 30 : 20))
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

  // Tooltip functions
  function showTooltip(event, d) {
    tooltip.transition()
      .duration(200)
      .style('opacity', 0.9);
    tooltip.html(`<strong>${d.id}</strong><br>${d.description}`)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  }

  function moveTooltip(event) {
    tooltip
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  }

  function hideTooltip() {
    tooltip.transition()
      .duration(500)
      .style('opacity', 0);
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
    const bounds = g.node().getBBox();
    const parent = g.node().parentElement;
    const fullWidth = parent.clientWidth;
    const fullHeight = parent.clientHeight;
    const width = bounds.width;
    const height = bounds.height;
    const midX = bounds.x + width / 2;
    const midY = bounds.y + height / 2;
    
    if (width === 0 || height === 0) return; // nothing to fit
    
    const scale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
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

  // Reset zoom and position
  function resetView() {
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
  }

  // Search functionality
  document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const nodes = g.selectAll('.node');
    
    nodes.each(function(d) {
      const node = d3.select(this);
      const isMatch = d.id.toLowerCase().includes(searchTerm) || 
                     d.description.toLowerCase().includes(searchTerm);
      node.style('opacity', searchTerm === '' || isMatch ? 1 : 0.1);
    });
    
    // Also fade links connected to hidden nodes
    g.selectAll('.link')
      .style('opacity', function(d) {
        const sourceHidden = d3.select(`.node[data-id="${d.source.id}"]`).style('opacity') === '0.1';
        const targetHidden = d3.select(`.node[data-id="${d.target.id}"]`).style('opacity') === '0.1';
        return (sourceHidden || targetHidden) ? 0.1 : 0.6;
      });
  });

  // Button event listeners
  document.getElementById('zoom-fit').addEventListener('click', zoomToFit);
  document.getElementById('reset').addEventListener('click', resetView);

  // Handle window resize
  window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight - 120;
    svg.attr('width', newWidth)
       .attr('height', newHeight);
  });

  // Load the initial data
  loadData();
});
