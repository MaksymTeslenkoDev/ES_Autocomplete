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
              edge_ngram_tokenizer: {
                type: 'edge_ngram',
                min_gram: 1,
                max_gram: 20,
                token_chars: ['letter'],
              },
              ngram_tokenizer: {
                type: 'ngram',
                min_gram: 3,
                max_gram: 3,
                token_chars: ['letter'],
              },
            },
            analyzer: {
              edge_ngram_analyzer: {
                tokenizer: 'edge_ngram_tokenizer',
                filter: ['lowercase'],
              },
              ngram_analyzer: {
                tokenizer: 'ngram_tokenizer',
                filter: ['lowercase'],
              },
              standard_analyzer: {
                tokenizer: 'standard',
                filter: ['lowercase'],
              },
            },
          },
        },
        mappings: {
          properties: {
            word: {
              type: 'text',
              fields: {
                edge_ngram: {
                  type: 'text',
                  analyzer: 'edge_ngram_analyzer',
                },
                ngram: {
                  type: 'text',
                  analyzer: 'ngram_analyzer',
                },
                standard: {
                  type: 'text',
                  analyzer: 'standard_analyzer',
                },
              },
            },
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
})();
