module.exports = function makeController(deps) {
  const service = deps.services && deps.services.adminService;
  return {
    async metrics(req, res, next) {
      try {
        if (!service) return next(new Error('admin service unavailable'));
        const data = await service.getMetrics();
        res.json({ data });
      } catch (err) { next(err); }
    }
  };
};
