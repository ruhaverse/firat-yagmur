// Middleware factory to require a specific role name
function requireRole(roleName) {
  return async function (req, res, next) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Authentication required' });
      const userId = req.user.id;
      // Resolve rbac service at call time so domain-registered service can be used
      const common = require('../common');
      const rbacService = common && common.services && common.services.rbacService;
      if (!rbacService) return res.status(500).json({ error: 'RBAC service unavailable' });

      const ok = await rbacService.hasRole(userId, roleName);
      if (!ok) return res.status(403).json({ error: 'Insufficient permissions' });
      next();
    } catch (err) {
      next(err);
    }
  };
}

// Helper to check multiple roles (any match)
function requireAnyRole(roles) {
  return async function (req, res, next) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Authentication required' });
      const userId = req.user.id;
      const common = require('../common');
      const rbacService = common && common.services && common.services.rbacService;
      if (!rbacService) return res.status(500).json({ error: 'RBAC service unavailable' });

      const ok = await rbacService.hasAnyRole(userId, roles);
      if (!ok) return res.status(403).json({ error: 'Insufficient permissions' });
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { requireRole, requireAnyRole };
