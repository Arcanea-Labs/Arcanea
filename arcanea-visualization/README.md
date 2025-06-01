# Arcanea Ontology Explorer

An interactive visualization of the Arcanea ontology using D3.js. Explore the relationships between primordial elements, archetypes, and higher-order concepts in the Arcanea universe.

## Features

- Interactive force-directed graph visualization
- Zoom and pan functionality
- Node search and filtering
- Tooltips with detailed descriptions
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/arcanea-ontology.git
   cd arcanea-ontology/arcanea-visualization
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

- **Zoom**: Use the mouse wheel to zoom in/out
- **Pan**: Click and drag to move around the graph
- **Search**: Type in the search box to filter nodes
- **Fit View**: Click the "Fit View" button to zoom to fit all nodes
- **Reset View**: Click the "Reset View" button to reset the view

## Project Structure

```
arcanea-visualization/
├── public/                 # Static files
│   ├── index.html          # Main HTML file
│   └── visualization.js    # D3.js visualization code
├── server.js               # Express server
├── package.json            # Project dependencies
└── README.md               # This file
```

## Integration with MCP Server

This visualization can be connected to an MCP (Model Context Protocol) Server to dynamically load and visualize the Arcanea ontology. The current implementation uses a sample dataset, but it can be easily modified to fetch data from an MCP Server.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [D3.js](https://d3js.org/) for the visualization library
- [Arcanea Universe](https://github.com/your-username/arcanea) for the ontology
