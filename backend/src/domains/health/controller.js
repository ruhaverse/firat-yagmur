module.exports = function makeController(deps) {
  const service = deps.services && deps.services.healthService;
  return {
    async status(req, res, next) {
      try {
        const sentryOk = false;
        if (!service) return res.json({ sentry: sentryOk, db: false });
        const dbOk = await service.checkDb();
        res.json({ sentry: sentryOk, db: dbOk });
      } catch (err) { next(err); }
    }
  };
};
