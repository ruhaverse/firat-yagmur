module.exports = function createRoutes({ router }) {
  // GET /api/v1/stories
  router.get('/', (req, res) => res.json({ data: [] }));

  // GET /api/v1/stories/:email
  router.get('/:email', (req, res) => res.json({ data: [] }));

  // POST /api/v1/stories/:userId
  router.post('/:userId', (req, res) => res.json({ data: { ok: true } }));
};
