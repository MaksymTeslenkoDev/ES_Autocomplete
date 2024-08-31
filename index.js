'use strict';

const fastify = require('fastify');
const elasticsearch = require('./plugins/elasticsearch.js');

async function buildServer(config) {
  const server = fastify({
    logger: {
      level: 'info',
    },
  });

  // Plugins
  server.register(elasticsearch, {
    url: `http://${config.ELASTICSEARCH_HOST}:${config.ELASTICSEARCH_PORT}`,
    appPath: config.appPath,
  });

  // Routes
  await server.register(require('./routes/autocomplete.js'));

  return server;
}

module.exports = buildServer;
