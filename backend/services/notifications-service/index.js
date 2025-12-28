const express = require('express');
const path = require('path');

// Load env from local .env if present
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { getConfig } = require('../../src/common/env');
const logger = require('../../src/common/logger');

async function start() {
  const config = getConfig();
  const app = express();

  // Simple health route
  app.get('/health', (req, res) => res.json({ ok: true }));

  // Mount notifications domain routes from the monorepo copy
  // Expect that the domain code is present at ./src/domains/notifications
  const notificationsRoutes = require('../../src/domains/notifications/routes');
  app.use(config.apiBase || '/api/v1', notificationsRoutes);

  const port = process.env.PORT || 4001;
  app.listen(port, () => {
    logger.info(`Notifications service listening on ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start notifications service', err);
  process.exit(1);
});
