const serviceFactory = require('./service');

function ping() {
  return async (req, res) => {
    res.json({ ok: true, domain: 'hangs' });
  };
}

function createHang(deps) {
  const service = serviceFactory(deps);
  return async (req, res, next) => {
    try {
      const userId = req.user && req.user.id;
      const { title, description } = req.body;
      if (!title && !description) {
        return res.status(400).json({ error: 'title or description is required' });
      }
      const hang = await service.createHang({ userId, title, description });
      res.status(201).json(hang);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { ping, createHang };
