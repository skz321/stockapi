const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth.routes');
const tradesRoutes = require('./routes/trades.routes');
const strategiesRoutes = require('./routes/strategies.routes');
const marketsnapshotsRoutes = require('./routes/marketsnapshots.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Swagger UI
const openapiPath = path.join(__dirname, '..', 'openapi.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(openapiPath, 'utf8'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradesRoutes);
app.use('/api/strategies', strategiesRoutes);
app.use('/api/marketsnapshots', marketsnapshotsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
