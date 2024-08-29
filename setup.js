'use strict';

require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');

const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_USER_PASSWORD = process.env.ELASTIC_USER_PASSWORD;

const client = new Client({
  node: 'http://localhost:9200',
  auth: { username: ELASTIC_USERNAME, password: ELASTIC_USER_PASSWORD },
});

(async () => {
  try {
    await client.indices.create({
      index: 'words',
      body: {
        settings: {
          number_of_shards: 3,
          number_of_replicas: 1,
          analysis: {
            tokenizer: {
              autocomplete: {
                type: 'edge_ngram',
                min_gram: 1,
                max_gram: 20,
                token_chars: ['letter'],
              },
            },
            analyzer: {
              autocomplete: {
                tokenizer: 'autocomplete',
                filter: ['lowercase'],
              },
              autocomplete_search: {
                tokenizer: 'lowercase',
              },
            },
          },
        },
        mappings: {
          properties: {
            word: {
              type: 'text',
              analyzer: 'autocomplete',
              search_analyzer: 'autocomplete_search',
            },
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
})();
