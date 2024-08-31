module.exports = async function (fastify, opts) {
  fastify.get('/autocomplete', async function (request, reply) {
    const { query } = request.query;
    const { body } = await fastify.elastic.search({
      index: fastify.indices.WORDS,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  'word.edge_ngram': query,
                },
              },
            ],
          },
        },
      },
    });

    const words = body.hits.hits.map((hit) => hit._source.word);
    reply.send(words);
  });
};
