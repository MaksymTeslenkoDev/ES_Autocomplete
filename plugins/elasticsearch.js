'use strict';

const fp = require('fastify-plugin');
const { Client } = require('@elastic/elasticsearch');

async function elasticsearch(fastify, options) {
  const client = new Client({ node: options.url });

  const indices = {
    WORDS: 'words',
  };

  await client.ping();
  fastify.log.info('Connection to Elasticsearch established');

  fastify.decorate('elastic', client);
  fastify.decorate('indices', indices);

  fastify.addHook('onClose', (instance, done) => {
    if (!opts.testing) {
      instance.elastic.close(done);
    } else {
      done();
    }
  });
}

module.exports = fp(elasticsearch);
