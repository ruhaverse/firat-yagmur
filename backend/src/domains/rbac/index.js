module.exports = {
  register(app, deps) {
    try {
      if (!deps.services) deps.services = {};
      if (!deps.services.rbacService) {
        const makeService = require('./service');
        deps.services.rbacService = makeService(deps);
      }
    } catch (e) {
      if (deps && deps.logger && deps.logger.warn) deps.logger.warn({ err: e }, 'Failed to instantiate rbacService');
    }
  }
};
