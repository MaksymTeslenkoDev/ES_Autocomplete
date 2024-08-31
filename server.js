'use strict';

require('dotenv').config();
const path = require('path');
const APPLICATION_PATH = path.join(process.cwd(), './');
const buildServer = require('./index.js');

(async () => {
  try {
    const server = await buildServer({
      ELASTICSEARCH_HOST: 'localhost',
      ELASTICSEARCH_PORT: 9200,
      appPath: APPLICATION_PATH,
    });
    await server.listen({ port: 3000, host: 'localhost' });
  } catch (err) {
    console.log('Error starting server', err);
    process.exit(1);
  }
})();
