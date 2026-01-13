module.exports = function createRoutes({ router }) {
  // GET /api/v1/groups
  router.get('/', (req, res) => res.json({ data: [] }));

  // GET /api/v1/groups/id/:id
  router.get('/id/:id', (req, res) => res.json({ data: null }));

  // GET /api/v1/groups/email/:email
  router.get('/email/:email', (req, res) => res.json({ data: [] }));

  // GET /api/v1/groups/posts/:id
  router.get('/posts/:id', (req, res) => res.json({ data: [] }));

  // POST /api/v1/groups/:uid/create
  router.post('/:uid/create', (req, res) => res.json({ data: { ok: true } }));

  // POST join / DELETE leave
  router.post('/:uid/join/:gid', (req, res) => res.json({ data: { ok: true } }));
  router.delete('/:uid/leave/:gid', (req, res) => res.json({ data: { ok: true } }));
};
