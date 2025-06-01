require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Arcanea API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Arcanea API running on port ${PORT}`);
});

module.exports = app;
