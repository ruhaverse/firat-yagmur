module.exports = function createRoutes({ router }) {
  // GET /api/v1/newsFeed/:email
  router.get('/:email', (req, res) => res.json({ data: [] }));

  // fallback empty
  router.get('/', (req, res) => res.json({ data: [] }));
};
