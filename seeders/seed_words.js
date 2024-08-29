'use strict';

require('dotenv').config();
const zlib = require('node:zlib');
const { Writable } = require('node:stream');
const fs = require('node:fs');
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
});

(async () => {
  try {
    const writable = new Writable({
      highWaterMark: 21456,
      write: async function (chunk, encoding, next) {
        const words = chunk.toString().split('\n');
        const body = words.flatMap((word) => [
          { index: { _index: 'words' } },
          { word },
        ]);
        const {
          body: { items, ...bulkResponse },
        } = await client.bulk({
          refresh: true,
          body,
        });

        console.log({
          ...bulkResponse,
          itemLength: items.length,
        });

        if (bulkResponse.errors) {
          console.log(bulkResponse.errors);
          throw new Error('Bulk response contains errors');
        }
        next();
      },
    });

    const unzip = zlib.createGunzip({ highWaterMark: 9345 });

    writable.on('drain', () => {
      console.log('Event drain: resume readable');
      unzip.resume();
    });

    writable.on('finish', () => {
      console.log('Done');
    });

    fs.createReadStream('../words.tar.gz').pipe(unzip);

    unzip.on('data', (chunk) => {
      const canWrite = writable.write(chunk);
      if (!canWrite) {
        console.log('Pause reabable due to backpressure');
        unzip.pause();
      }
    });

    unzip.on('end', () => {
      writable.end();
    });
  } catch (err) {
    console.error(err);
  }
})();
