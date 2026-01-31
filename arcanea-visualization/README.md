# Arcanea Mythology Graph Explorer

An interactive visualization of world mythologies and their interconnected entities. Explore gods, creatures, places, and their relationships across different mythological traditions.

## 🌟 Features

- **Interactive Graph Visualization**
  - Force-directed graph layout
  - Zoom, pan, and drag functionality
  - Color-coded nodes by pantheon and type
  - Dynamic tooltips with rich content

- **Mythology Coverage**
  - Multiple pantheons (Greek, Norse, Egyptian, etc.)
  - Various entity types (deities, creatures, places, artifacts)
  - Rich relationship mapping

- **Powerful Search & Filtering**
  - Full-text search across all entities
  - Filter by pantheon, type, and relationships
  - Real-time results with highlighting

- **Data Management**
  - Automatic data import from multiple sources
  - Local caching for performance
  - Fallback to sample data when needed

- **Developer Friendly**
  - RESTful API with comprehensive documentation
  - Modular architecture
  - Extensible data model

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm (comes with Node.js) or yarn
- Git (for version control)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Arcanea-Labs/Arcanea.git
   cd Arcanea/arcanea-visualization
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables (create a `.env` file in the project root):
   ```env
   PORT=3001
   NODE_ENV=development
   USE_SAMPLE_DATA=true  # Set to false to use real API when available
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
# or
yarn dev
```

#### Production Mode
```bash
npm run build
npm start
```

The application will be available at: http://localhost:3001

## 🎮 Usage

### Web Interface
- **Navigation**: 
  - Zoom: Mouse wheel or pinch gesture
  - Pan: Click and drag
  - Node Selection: Click on any node
  
- **Controls**:
  - Search: Find entities by name or description
  - Filters: Toggle between pantheons and entity types
  - Reset View: Center and fit the graph
  - Toggle Legend: Show/hide the legend

### API Endpoints

#### Get Graph Data
```
GET /api/graph
```

**Query Parameters**:
- `pantheon`: Filter by pantheon (e.g., `greek`, `norse`)
- `type`: Filter by entity type (e.g., `deity`, `creature`)
- `search`: Full-text search

#### Get Node Details
```
GET /api/nodes/:id
```

#### Get Node Connections
```
GET /api/nodes/:id/connections?depth=2
```

#### Search
```
GET /api/search?q=zeus
```

#### Get Available Pantheons
```
GET /api/pantheons
```

#### Get Available Types
```
GET /api/types
```

### Importing Data

#### Test Data Import
```bash
# Use sample data (default)
npm run test:import

# Force API import
USE_SAMPLE_DATA=false npm run test:import
```

This will generate data files in the `data/exports` directory.

## 🏗️ Project Structure

```bash
arcanea-visualization/
├── public/                 # Static files served by Express
│   ├── index.html         # Main HTML file
│   ├── styles/            # CSS files
│   └── assets/            # Images and other assets
├── src/
│   ├── data/              # Data management
│   │   ├── importers/     # Data importers for different sources
│   │   ├── mythologies/   # Mythology-specific data
│   │   └── index.js       # Data access layer
│   ├── server/            # Server-side code
│   │   └── middleware/    # Express middleware
│   ├── utils/             # Shared utilities
│   └── server.js          # Main server entry point
├── scripts/               # Utility scripts
│   └── test-import.js     # Data import testing script
├── data/                  # Data storage
│   ├── cache/             # Cached API responses
│   └── exports/           # Exported data files
├── .env.example          # Example environment variables
├── package.json          # Project configuration
└── README.md            # This file
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Test data import
npm run test:import
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=3001
NODE_ENV=development
USE_SAMPLE_DATA=true  # Set to false to use real API when available
CACHE_TTL=86400000    # 24 hours in milliseconds
```

### Adding New Data Sources

1. Create a new importer in `src/data/importers/`
2. Extend the `BaseImporter` class
3. Register the importer in `src/data/importers/index.js`
4. Add sample data for testing

### Code Style

- Use ES6+ syntax
- Follow Airbnb JavaScript Style Guide
- Use JSDoc for documentation
- Write unit tests for new features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [D3.js](https://d3js.org/) - For the amazing visualization library
- [Express](https://expressjs.com/) - For the web server
- [Mythology API](https://mythologyapi.com/) - For the mythology data
- All contributors who helped improve this project
